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

        # Pass the public_key and auth_token to the engine.create_session() method
        session_id = engine.create_session(public_key, auth_token)

        return JsonResponse({"session_id": session_id})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def end_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        session_id = req.POST.get("session_id")
        auth_token = req.POST.get("auth_token")

        if not auth_token:
            return HttpResponseBadRequest("Invalid request body")
        
        engine.end_session(session_id, auth_token)
        return JsonResponse({"message": f"Session {session_id} ended"})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def generate_urls(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            session_id = data["session_id"]
            participant_count = data["participant_count"]
        except (json.JSONDecodeError, KeyError):
            return HttpResponseBadRequest("Invalid request body")

        participant_urls = engine.generate_participant_urls(
            session_id, participant_count
        )

        return JsonResponse(participant_urls)
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def reveal(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            session_id = data["session_id"]
            auth_token = data["auth_token"]
        except (json.JSONDecodeError, KeyError):
            return HttpResponseBadRequest("Invalid request body")

        result = engine.reveal(
            session_id
        )  # Implement your logic to reveal the result of the computation
        return JsonResponse({"result": result})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def submit_data(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            session_id = data["session_id"]
            participant = data["participant"]
            share = data["shares"]
        except (json.JSONDecodeError, KeyError):
            return HttpResponseBadRequest("Invalid request body")

        if not engine.session_exists(session_id):
            return HttpResponseBadRequest("Invalid session ID")

        engine.add_participant(session_id, participant)
        engine.update_session_data(session_id, participant, share)

        return JsonResponse({"message": f"Data submitted by {participant}"})
    else:
        return HttpResponseBadRequest("Invalid request method")


def get_urlpatterns():
    return [
        path("api/bwwc/start_session/", start_session),
        path("api/bwwc/end_session/", end_session),
        path("api/bwwc/generate_urls", generate_urls),
        path("api/bwwc/reveal/", reveal),
        path("api/bwwc/submit_data/", submit_data),
    ]
