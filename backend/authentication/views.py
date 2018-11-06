from django.shortcuts import render

from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed
from django.http import HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
import json
from json.decoder import JSONDecodeError
from .models import Account

def index(request):
    return HttpResponse("index")

def signup(request):
    if request.method == 'POST':
        try:
            body = request.body.decode()
            new_username = json.loads(body)['username']
            new_password = json.loads(body)['password']
            new_firstname = json.loads(body)['firstName']
            new_lastname = json.loads(body)['lastName']
        except(KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        
        Account.objects.create_user(username = new_username, password = new_password,
        	firstname = new_firstname, lastname = new_lastname)
        return HttpResponse(status = 201)
    else:
        return HttpResponseNotAllowed(['POST'])

def signin(request):
    if request.method == 'POST':
        try:
            body = request.body.decode()
            input_username = json.loads(body)['username']
            input_password = json.loads(body)['password']
        except(KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        
        user = authenticate(username= input_username, password=input_password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])

def signout(request):
    if request.method == 'GET':
        logout(request);
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])