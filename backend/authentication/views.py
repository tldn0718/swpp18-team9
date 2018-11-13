from django.shortcuts import render

from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed
from django.http import HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
import json
from json.decoder import JSONDecodeError
from .models import Account, Profile

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
        
        createdUser = Account.objects.create_user(email = new_username, password = new_password,
        	first_name = new_firstname, last_name = new_lastname)
        Profile.objects.create(account = createdUser)
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
            userJson = {
                'id': user.id,
                'email': user.email,
                'firstname': user.first_name,
                'lastname': user.last_name
            }
            return JsonResponse(userJson)
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

def friend(request):
    if request.method == 'GET':
        #Retrieve all users from Profile and save them into response_user
        response_users = []
        response_friends = []

        temp_friends = []
        for user in Profile.objects.all():
            response_users.append(user.user_toJSON())
            for friend in user.friends.all():
                temp_friends.append(user.friend_toJSON(friend))

        #check and remove overlapping friend relationships
        for temp_friend in temp_friends:
            temp_user_1 = temp_friend['user_1']
            temp_user_2 = temp_friend['user_2']
            print(str(temp_user_1) + " " + str(temp_user_2))
            if len(response_friends) == 0:
                response_friends.append(temp_friend)
            for friend in response_friends:
                user_1 = friend['user_1']
                user_2 = friend['user_2']
                if (temp_user_1 == user_1 and temp_user_2 == user_2) or (temp_user_1 == user_2 and temp_user_2 == user_1):
                    break
                num_last = len(response_friends)-1
                if(friend == response_friends[num_last]):
                    response_friends.append(temp_friend)
        
        #Test Dijkstra
        edges = []
        for friend in response_friends:
            edges.append((str(friend['user_1']), str(friend['user_2']), 1))
        
        print('dijkstra')
        print(dijkstra(edges, "6", "11"))


        return JsonResponse({'users': response_users, 'friends': response_friends})
    else:
        return HttpResponseNotAllowed(['GET'])

from .utilities import dijkstra
def shortest_path(request):
    if request.method == 'GET':
        users = []
        friends = []
    else:
        return HttpResponseNotAllowed(['GET'])

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
