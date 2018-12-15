from django.shortcuts import render

from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
#from django.core import serializers
import json
from json.decoder import JSONDecodeError
from .models import Account, Profile, Notification, Post, Group
from django.db.models import Q
from queue import Queue
from django.utils import timezone

def index(request):
    return HttpResponse("index")

#The parameters are Profile model.
def get_distance(start, target):
    return 1

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
        
        user = authenticate(email=input_username, password=input_password)
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

def totalGraph(request):
    if request.method == 'GET':
        response_users = []
        response_friends = []

        for user in Profile.objects.all().prefetch_related('friends'):
            response_users.append(user.user_toJSON())
            for friend in user.friends.all():
                if user.account.id < friend.account.id:
                    response_friends.append(user.friend_toJSON(friend))

        return JsonResponse({'users': response_users, 'friends': response_friends})
    else:
        return HttpResponseNotAllowed(['GET'])


def levelGraph(request, level):
    if request.method == 'GET':
        closedSet = []
        openSet = Queue()
        edges = []
        loginProfile = Profile.objects.get(account = request.user)
        openSet.put({'node': loginProfile, 'level': 0})

        while not openSet.empty():
            currentNode = openSet.get()
            if currentNode['level'] < level:
                for nextNode in currentNode['node'].friends.all():
                    if nextNode not in map(lambda x: x['node'],closedSet):
                        openSet.put({'node': nextNode, 'level': currentNode['level']+1})
                        edges.append(currentNode['node'].friend_toJSON(nextNode))
            if currentNode['node'] not in map(lambda x: x['node'],closedSet):
                closedSet.append(currentNode)
        nodes = [nodeDictionary['node'].user_toJSON() for nodeDictionary in closedSet]
        return JsonResponse({'users': nodes, 'friends': edges})

    else:
        return HttpResponseNotAllowed(['GET'])


def totalFriendRequest(request):
    if request.method == 'GET':
        #return all notifications of user
        notifications = [noti for noti in request.user.noti_set.all().order_by('-datetime').values(
            'id','content','select','datetime','read', 'sender', 'receiver')]
        return JsonResponse(notifications, safe=False)

    elif request.method == 'PUT':
        #set all notifications of user as read
        for notReadNotification in request.user.noti_set.filter(read = False):
            notReadNotification.read = True
            notReadNotification.save()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])


def specificFriendRequest(request, id):
    if request.method == 'PUT':
        #change the notifications when receiver selected 'accept' or 'decline'
        try:
            body = request.body.decode()
            answer = json.loads(body)['answer']
        except(KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()

        receiverNoti = Notification.objects.get(id = id)
        sender = receiverNoti.sender
        receiver = receiverNoti.receiver
        senderNoti = sender.noti_set.get(receiver= receiver)
        now = timezone.now()

        senderNoti.datetime = receiverNoti.datetime = now
        senderNoti.read = receiverNoti.select = receiverNoti.read = False
        
        if answer == 'accept':
            receiverNoti.content = 'You accepted a friend request from {}.'.format(
                sender.get_full_name())
            senderNoti.content = '{} accepted a friend request from you.'.format(
                receiver.get_full_name())
            profileOfSender = Profile.objects.get(account = sender)
            profileOfReceiver = Profile.objects.get(account = receiver)
            profileOfSender.friends.add(profileOfReceiver)
        else: #answer == 'decline'
            receiverNoti.content = 'You declined a friend request from {}.'.format(
                sender.get_full_name())
            senderNoti.content = '{} declined a friend request from you'.format(
                receiver.get_full_name())
        receiverNoti.save()
        senderNoti.save()
        return HttpResponse(status = 200)

    elif request.method == 'POST':
    #create a notification when user send a friend request
        sender = request.user
        receiver = Account.objects.get(id = id)
        now = timezone.now()
        newSenderNoti = Notification(
            content = 'You sent a friend request to {}.'.format(receiver.get_full_name()),
            select = False, datetime = now, sender = sender, receiver = receiver, profile = sender)
        newReceiverNoti = Notification(
            content = '{} sent a friend request to you.'.format(sender.get_full_name()),
            select = True, datetime = now, sender = sender, receiver = receiver, profile = receiver)
        newSenderNoti.save()
        newReceiverNoti.save()
        return JsonResponse({'createdTime': now}, status=201)
    else:
        return HttpResponseNotAllowed(['PUT', 'POST'])

def search(request, term):
    if request.method == 'GET':
        if ' ' in term:
            firstName = term.split()[0]
            lastName = term.split()[1]
            result = [account for account
                in Account.objects.filter(first_name__icontains=firstName).filter(last_name__icontains=lastName).values('id','first_name','last_name')]
        else:
            firstNameQuery = Q(first_name__icontains=term)
            lastNameQuery = Q(last_name__icontains=term)
            result = [account for account in Account.objects.filter(firstNameQuery|lastNameQuery).values('id','first_name','last_name')]
        return JsonResponse(result, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

#Change the node data to the user data
def getSelectedUsers(request):
    if request.method == 'POST':
        try:
            body = request.body.decode()
            selectedNodes = json.loads(body)['selectedNodes']
        except(KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        selectedID = []
        for selectedNode in selectedNodes:
            selectedID.append(selectedNode['id'])
        selectedUsers = [user for user in Account.objects.filter(id__in = selectedID).values('id','first_name','last_name')]
        return JsonResponse(selectedUsers, safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])

#Get posts with the tags of given users
def postingGet(request):
    if request.method == 'POST':
        try:
            body = request.body.decode()
            selectedUsers = json.loads(body)['selectedUsers']
        except:
            return HttpResponseBadRequest()
        selectedID = [user['id'] for user in selectedUsers]
        posts = Post.objects.all().prefetch_related('tags')
        postResult = []
        for post in posts:
            tagID = post.tags.values_list('id', flat=True) # [i['id'] for i in post.tags.all().values('id')]
            if set(selectedID) == set(tagID):
                postResult.append({'id': post.id, 'content': post.content,
                    'tags': list(post.tags.values_list('id', flat=True))}) #[tag['id'] for tag in post.tags.all().values('id')]
        return JsonResponse({'posts': postResult})
    else:
        return HttpResponseNotAllowed(['POST'])

#Create a new post with the tags of given users
def postingWrite(request):
    if request.method == 'POST':
        try:
            body = request.body.decode()
            selectedUsers = json.loads(body)['selectedUsers']
            content = json.loads(body)['content']
        except:
            return HttpResponseBadRequest()
        newPost = Post.objects.create(content=content)
        tagedID = [user['id'] for user in selectedUsers]
        tagedUsers = Account.objects.filter(id__in = tagedID)
        newPost.tags.set(tagedUsers)
        return JsonResponse({'message': 'success'});
    else:
        return HttpResponseNotAllowed(['POST'])


def group(request):
    #add the user to the specific group. It takes a name of group by Json
    elif request.method == 'POST':
        try:
            body = request.body.decode()
            name = json.loads(body)['name']
        except:
            return HttpResponseBadRequest()
        group, created = Group.objects.get_or_create(name=name)
        group.members.add(request.user.account_of)
        return JsonResponse({'created': created})
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

#note that the name of the group should be unique
#note that the name of the group should be unique
#note that the name of the group should be unique
#note that the name of the group should be unique
#note that the name of the group should be unique
#note that the name of the group should be unique
def group_detail(request, id):
    #return a graph info of the group whose id is 'id'.
    if request.method == 'GET':
        #Error Handling? - What should it work when the group whose id is 'id' does not exist?
        group = Group.objects.get(id=id).prefetch_related('members')
        members = group.members.all()
        members_id = group.values_list('members__id', flat=True)
        nodes = edges = []
        for member in members:
            nodes.append({'id': member.id, 'label': member.account.first_name})
            for friend_id in member.values_list('friends__id', flat=True):
                if (friend_id in members_id) and (member.id < friend_id):
                    nodes.append({'from': member.id,'to': friend_id})
        return JsonResponse({'users': nodes, 'friends': edges})
    else:
        return HttpResponseNotAllowed(['GET'])

#Return or edit the profile of given user. The parameter is id of Account model.
def profile_one(request, id):
    if request.method == 'GET':
        target_user_q = Profile.objects.filter(account_id=id).prefetch_related('group_set', 'account')
        target_user = target_user_q[0]
        name = target_user.account.get_full_name()
        motto = target_user.motto
        groups = list(target_user.group_set.values_list('name', flat=True))
        if(request.user.id == id):
            distance = 0
            mutual_friends = []
        else:
            distance = get_distance(request.user.account_of, target_user)
            target_friends_IDs = set(target_user.friends.values_list('account_id', flat=True))
            my_friends_IDs = set(request.user.account_of.friends.values_list('account_id', flat=True))
            mutual_friends_IDs = target_friends_IDs & my_friends_IDs
            mutual_friends = Account.objects.filter(id__in=mutual_friends_IDs).values_list('id','first_name', 'last_name')
            mutual_friends_result = [{'id': f[0], 'name': f[1] + " " + f[2]} for f in mutual_friends]
        return JsonResponse({'name': name, 'motto': motto, 'groups': groups,
            'distance': distance, 'mutual_friends': mutual_friends_result})
    elif request.method == 'PUT':
        if(request.id != id):
            return HttpResponse(status=401)
        try:
            body = request.body.decode()
            selectedUsers = json.loads(body)['selectedUsers']
        except:
            return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])


def profile_multiple(request):
    if request.method == 'GET':
        try:
            body = request.body.decode()
            selectedNodes = json.loads(body)['selectedNodes']
        except:
            return HttpResponseBadRequest()
        selectedIDs = [map(lambda x: x['id'],selectedNodes)]
        selectedUsers = Profle.objects.filter(account_id__in=selectedID).prefetch_related('account', 'group_set')
        names = selectedUsers.values_list('account_name', flat=True)
        common_groups = set(selectedUsers[0].group_set.values_list('id', flat=True))
        for user in selectedUsers[1:]:
            common_groups = common_groups & set(user.group_set.values_list('id', flat=True))
        if len()==2:
            distance=get_distance(selectedUsers[0], selectedUsers[1])
        else:
            distance=0
        return JsonResponse({'names': names, 'groups':, 'distance':distance})
    else:
        return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

