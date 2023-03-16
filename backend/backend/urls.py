"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import sys

sys.path.append("../secretshare")

from django.contrib import admin
from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient

mgo_client = MongoClient("localhost", port=27017)
database = mgo_client.db

import json

from mpce import MPCEngine

engine = MPCEngine()


@csrf_exempt
def start_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        # Extract public_key and auth_token from request data
        public_key = req.POST.get("public_key")
        auth_token = req.POST.get("auth_token")

        if not public_key or not auth_token:
            return HttpResponseBadRequest("Missing public_key or auth_token")

        # Pass the public_key and auth_token to the engine.create_session() method
        session_id = engine.create_session(public_key, auth_token)

        return JsonResponse({"session_id": session_id})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def end_session(req: HttpRequest) -> HttpResponse:
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            session_id = data["session_id"]
        except (json.JSONDecodeError, KeyError):
            return HttpResponseBadRequest("Invalid request body")

        engine.end_session(session_id)
        return JsonResponse({"message": f"Session {session_id} ended"})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def generate_urls(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        try:
            data = json.loads(request.body)
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
        except (json.JSONDecodeError, KeyError):
            return HttpResponseBadRequest("Invalid request body")

        result = engine.reveal(
            session_id
        )  # Implement your logic to reveal the result of the computation
        return JsonResponse({"result": result})
    else:
        return HttpResponseBadRequest("Invalid request method")


@csrf_exempt
def submit_data(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        try:
            data = json.loads(request.body)
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


urlpatterns = [
    path("admin/", admin.site.urls),
    path("start_session/", start_session),
    path("end_session/", end_session),
    path("generate_urls", generate_urls),
    path("reveal/", reveal),
    path("submit_data/", submit_data),
]
