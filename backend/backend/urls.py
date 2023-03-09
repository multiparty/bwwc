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
from django.contrib import admin
from django.urls import path
from django.http import HttpRequest, HttpResponse
from pymongo import MongoClient

mgo_client= MongoClient('localhost', port=27017)
database = mgo_client.db

def init(req: HttpRequest) -> HttpResponse:
    pass

def start_session(req: HttpRequest) -> HttpResponse:
    pass

def end_session(req: HttpRequest) -> HttpResponse:
    pass

def generate_urls(req: HttpRequest) -> HttpResponse:
    pass

def reveal(req: HttpRequest) -> HttpResponse:
    pass

def submit_data(req: HttpRequest) -> HttpResponse:
    pass


urlpatterns = [
    path('admin/', admin.site.urls),
    path('init/', init),
    path('start_session/', start_session),
    path('end_session/', end_session),
    path('generate_urls', generate_urls),
    path('reveal/', reveal),
    path('submit_data/', submit_data)
]
