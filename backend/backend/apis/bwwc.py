import os
import sys

from .auth import Authenticator  # need the dot in front of auth

sys.path.append("secretshare")

import logging

from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
import psycopg2
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
    # UptimeRobot sends a HEAD request to perform backup
    if req.method == "GET" or req.method == "HEAD":
        logger.info("Backup request received")
        session_id = req.GET.get("session_id")

        if not session_id:
            return HttpResponseBadRequest("Missing Session ID")

        logger.info("Checking if session exists")
        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Session ID does not exist")

        host = os.getenv("POSTGRES_HOST")
        port = os.getenv("POSTGRES_PORT")
        database = os.getenv("POSTGRES_DATABASE")
        user = os.getenv("POSTGRES_USERNAME")
        password = os.getenv("POSTGRES_PASSWORD")

        if not host or not port or not database or not user or not password:
            return HttpResponseBadRequest("Missing PostgreSQL environment variables")

        # Get Session Info
        logger.info("Getting session info")
        data = engine.get_session(session_id)
        participants = list(engine.get_all_participant_data(session_id))
        # MongoDb ObjectID is not JSON serializable
        data["_id"] = str(data["_id"])
        session_data_json = json.dumps(data)
        for participant in participants:
            participant["_id"] = str(participant["_id"])
        participants_json = json.dumps(participants)
        # Establish a connection to the PostgreSQL database
        logger.info("Establishing connection to PostgreSQL database")
        conn = psycopg2.connect(
            host=host, port=port, database=database, user=user, password=password
        )
        # Create a cursor object to interact with the database
        cur = conn.cursor()

        # Execute the SQL statement
        logger.info("Executing SQL statement")
        query = "INSERT INTO wage_gap (session_id, session_data, participants) VALUES (%s, %s, %s);"
        cur.execute(query, (session_id, session_data_json, participants_json))
        # Commit the changes to the database
        logger.info("Committing changes to database")
        conn.commit()
        # Close the cursor and database connection
        cur.close()
        conn.close()
        logger.info("Backup complete")

        return JsonResponse({"status": 200})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def mongo_health(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        if not engine.is_mongodb_running():
            return HttpResponseBadRequest(f"MongoDB is down at: {engine.mongo_uri}")
        else:
            return HttpResponse("MongoDB is up")
    else:
        return HttpResponseBadRequest("Invalid request method")

@csrf_exempt
def app_health_check(req: HttpRequest) -> HttpResponse:
    return HttpResponse("OK")


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
        path("api/bwwc/backup/", backup),
        path("api/bwwc/health/", mongo_health),
        path("/api/bwwc/healthz/", app_health_check),
    ]
