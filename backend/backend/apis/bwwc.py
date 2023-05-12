import os
import sys

from .auth import Authenticator  # need the dot in front of auth

sys.path.append("secretshare")

import logging

from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json

from secretshare.mpce import MPCEngine

logger = logging.getLogger("django")

engine = MPCEngine()
auth = Authenticator()


@csrf_exempt
def start_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        public_key = req.POST.get("public_key")
        auth_token = req.META.get("HTTP_AUTHORIZATION").split()[1]

        if not auth.is_valid_token(auth_token):
            return HttpResponse("Unauthorized", status=401)

        if not public_key or not auth_token:
            return HttpResponseBadRequest("Invalid request body")

        user_id = auth.get_user_id(auth_token)
        session_id = engine.create_session(user_id, public_key)

        return JsonResponse({"session_id": session_id, "prime": str(engine.prime)})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def stop_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        session_id = req.POST.get("session_id")
        auth_token = req.META.get("HTTP_AUTHORIZATION").split()[1]
        user_id = auth.get_user_id(auth_token)

        if not auth.is_valid_token(auth_token):
            return HttpResponse("Unauthorized", status=401)

        if not session_id or not auth_token:
            return HttpResponseBadRequest("Invalid request body")

        if engine.is_initiator(session_id, user_id):
            engine.close_submissions(session_id)
            engine.reduce_unencrypted(
                session_id, lambda x, y: (float(x) + float(y)) % engine.prime
            )
            return JsonResponse({"status": 200})
        else:
            return HttpResponse("Unauthorized", status=401)
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def end_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        session_id = req.POST.get("session_id")
        auth_token = req.META.get("HTTP_AUTHORIZATION").split()[1]
        user_id = auth.get_user_id(auth_token)

        if not auth.is_valid_token(auth_token):
            return HttpResponse("Unauthorized", status=401)

        if not session_id or not auth_token:
            return HttpResponseBadRequest("Invalid request body")

        if engine.is_initiator(session_id, user_id):
            engine.end_session(session_id)
            return JsonResponse({"status": 200})
        else:
            return HttpResponse("Unauthorized", status=401)
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_submission_urls(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        auth_token = req.META.get("HTTP_AUTHORIZATION").split()[1]
        session_id = req.POST.get("session_id")
        participant_count = int(req.POST.get("participant_count"), 0)
        user_id = auth.get_user_id(auth_token)

        if not auth.is_valid_token(auth_token):
            return HttpResponse("Unauthorized", status=401)

        if not engine.is_initiator(session_id, user_id):
            return HttpResponse("Unauthorized", status=401)

        if not auth_token or not session_id or not participant_count:
            return HttpResponseBadRequest("Invalid request body")

        participant_urls = engine.generate_participant_urls(
            session_id, participant_count
        )

        return JsonResponse(participant_urls)
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_encrypted_shares(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        auth_token = req.META.get("HTTP_AUTHORIZATION").split()[1]
        session_id = req.POST.get("session_id")
        user_id = auth.get_user_id(auth_token)

        if (
            not engine.is_initiator(session_id, user_id)
            or not auth_token
            or not session_id
        ):
            return HttpResponseBadRequest("Invalid request body")

        if not auth.is_valid_token(auth_token):
            return HttpResponse("Unauthorized", status=401)

        result = engine.get_encrypted_shares(session_id)
        return JsonResponse({"result": result})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def submit_data(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        session_id = req.POST.get("sessionId")
        participant = req.POST.get("participantCode")
        data = req.POST.get("data")

        if not session_id or not participant:
            return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        try:
            engine.add_participant(session_id, participant)
            engine.update_session_data(session_id, participant, data)

            return JsonResponse({"status": 200})
        except Exception as e:
            return HttpResponseBadRequest(str(e))
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_public_key(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        session_id = req.GET.get("session_id")

        if not session_id:
            return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        public_key = engine.get_public_key(session_id)

        return JsonResponse({"public_key": public_key})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_prime(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        session_id = req.GET.get("session_id")

        if not session_id:
            return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        prime = engine.get_prime(session_id)

        return JsonResponse({"prime": prime})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_submitted_data(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        session_id = req.GET.get("session_id")
        auth_token = req.META.get("HTTP_AUTHORIZATION").split()[1]
        user_id = auth.get_user_id(auth_token)

        if not auth.is_valid_token(auth_token):
            return HttpResponse("Unauthorized", status=401)

        if not engine.is_initiator(session_id, user_id):
            return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        data = engine.get_submitted_data(session_id)
        total_cells = engine.get_cell_count(session_id)
        metadata = engine.get_metadata(session_id)

        return JsonResponse(
            {"data": data, "total_cells": total_cells, "metadata": metadata}
        )
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_submission_history(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        session_id = req.GET.get("session_id")
        auth_token = req.META.get("HTTP_AUTHORIZATION").split()[1]
        user_id = auth.get_user_id(auth_token)

        if not auth.is_valid_token(auth_token):
            return HttpResponse("Unauthorized", status=401)

        if not engine.is_initiator(session_id, user_id):
            return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        data = engine.get_submission_history(session_id)

        return JsonResponse({"data": data})
    else:
        return HttpResponseBadRequest("Invalid request method")

@csrf_exempt
def backup(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        session_id = req.GET.get("session_id")

        if not session_id:
            return HttpResponseBadRequest("Invalid Session ID")

        data = engine.get_session(req.GET.get("session_id"))
        data_json = json.dumps(data)

        cur = connection.cursor()
        query = "INSERT INTO wage_gap (session_id, data) VALUES (%s, %s);"
        cur.execute(query, (session_id, data_json))
        connection.commit()
        cur.close()

@csrf_exempt
def mongo_health(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        if engine.is_mongodb_running() is None:
            return HttpResponseBadRequest("MongoDB client is not initialized")
        else:
            return HttpResponse("MongoDB client is initialized")
    else:
        return HttpResponseBadRequest("Invalid request method")

def get_urlpatterns():
    return [
        path("api/bwwc/start_session/", start_session),
        path("api/bwwc/stop_session/", stop_session),
        path("api/bwwc/end_session/", end_session),
        path("api/bwwc/get_submission_urls/", get_submission_urls),
        path("api/bwwc/get_encrypted_shares/", get_encrypted_shares),
        path("api/bwwc/submit_data/", submit_data),
        path("api/bwwc/get_public_key/", get_public_key),
        path("api/bwwc/get_submitted_data/", get_submitted_data),
        path("api/bwwc/get_prime/", get_prime),
        path("api/bwwc/get_submission_history/", get_submission_history),
    ]
