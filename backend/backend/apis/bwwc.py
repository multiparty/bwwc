import os
import sys

sys.path.append("secretshare")

import json

from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from secretshare.mpce import MPCEngine

engine = MPCEngine()


@csrf_exempt
def start_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        public_key = req.POST.get("public_key")
        auth_token = req.POST.get("auth_token")

        if not public_key or not auth_token:
            return HttpResponseBadRequest("Invalid request body")

        session_id = engine.create_session(auth_token, public_key)

        return JsonResponse({"session_id": session_id})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def stop_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        session_id = req.POST.get("session_id")
        auth_token = req.POST.get("auth_token")

        if not session_id or not auth_token:
            return HttpResponseBadRequest("Invalid request body")

        if engine.is_initiator(session_id, auth_token):
            engine.close_submissions(session_id)
            return JsonResponse({"status": 200})
        else:
            return HttpResponseBadRequest("Invalid auth token")
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def end_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        session_id = req.POST.get("session_id")
        auth_token = req.POST.get("auth_token")

        if not session_id or not auth_token:
            return HttpResponseBadRequest("Invalid request body")

        if engine.is_initiator(session_id, auth_token):
            engine.end_session(session_id)
            return JsonResponse({"status": 200})
        else:
            return HttpResponseBadRequest("Invalid auth token")
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_submission_urls(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        auth_token = req.POST.get("auth_token")
        session_id = req.POST.get("session_id")
        participant_count = int(req.POST.get("participant_count"), 0)

        if not engine.is_initiator(session_id, auth_token):
            return HttpResponseBadRequest("Invalid auth token")

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
        auth_token = req.POST.get("auth_token")
        session_id = req.POST.get("session_id")

        if not engine.is_initiator(session_id, auth_token) or not auth_token or not session_id:
            return HttpResponseBadRequest("Invalid request body")

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

        engine.add_participant(session_id, participant)
        engine.update_session_data(session_id, participant, data)

        return JsonResponse({"status": 200})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_public_key(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        auth_token = req.GET.get("auth_token")
        session_id = req.GET.get("session_id")

        # if not auth_token or not session_id:
        #     return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        public_key = engine.get_public_key(session_id)

        return JsonResponse({"public_key": public_key})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def get_submitted_data(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        auth_token = req.GET.get("auth_token")
        session_id = req.GET.get("session_id")

        if not auth_token or not engine.is_initiator(session_id, auth_token):
            return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        data = engine.get_submitted_data(session_id)

        return JsonResponse({"data": data})
    else:
        return HttpResponseBadRequest("Invalid request method")


def get_urlpatterns():
    return [
        path("api/bwwc/start_session/", start_session),
        path("api/bwwc/end_session/", end_session),
        path("api/bwwc/get_submission_urls/", get_submission_urls),
        path("api/bwwc/get_encrypted_shares/", get_encrypted_shares),
        path("api/bwwc/submit_data/", submit_data),
        path("api/bwwc/get_public_key/", get_public_key),
        path("api/bwwc/get_submitted_data/", get_submitted_data),
    ]
