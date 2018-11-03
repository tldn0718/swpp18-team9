from django.shortcuts import render

from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed
from django.http import HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt

import json
from json.decoder import JSONDecodeError
from .models import User


def index(request):
    return HttpResponse("index")

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            body = request.body.decode()
            new_username = json.loads(body)['username']
            new_password = json.loads(body)['password']
        except(KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        
        new_user = User(username = new_username, password = new_password)
        new_user.save()

        response_dict = {
            'username': new_user.username,
            'password': new_user.password,
        }
        return JsonResponse(response_dict, status = 201)
    else:
        return HttpResponseNotAllowed(['GET'])

@csrf_exempt
def signin(request):
    if request.method == 'POST':
        try:
            body = request.body.decode()
            input_username = json.loads(body)['username']
            input_password = json.loads(body)['password']
        except(KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        
        user = User.objects.get(username = input_username)
        
        if user == None:
            return HttpResponseBadRequest()
        elif user.password == input_password:
            response_dict = {
                'username': user.username,
                'password': user.password,
            }
            return JsonResponse(response_dict, status = 201)
        else:
         return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(['GET'])
