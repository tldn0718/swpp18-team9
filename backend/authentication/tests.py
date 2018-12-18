from django.test import TestCase, Client
import json
from authentication.models import Account, Profile, Notification, Post, Group

class AuthenticationTestCase(TestCase):
    def test(self):
        client = Client(enforece_csrf_checks = True)
        response = client.post('api/signup/', json.dumps({'username': 'admin@yeon.com',
            'password': 'admin', 'firstName': 'yeon', 'lastName': 'admin'}),
        content_type = 'application/json')
        # self.assertEqual(response.status_code, 403)

        response = client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value

        response = client.post('/api/signup/', json.dumps({'username': 'admin@yeon.com',
            'password': 'admin', 'firstName': 'yeon', 'lastName': 'admin'}),
            content_type = 'application/json', HTTP_X_CSRFTOKEN = csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.post('/api/signup/', json.dumps({'username': 'friend@yeon.com',
            'password': 'friend', 'firstName': 'yeon', 'lastName': 'admin'}),
            content_type = 'application/json', HTTP_X_CSRFTOKEN = csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.post('/api/signin/', json.dumps({'username': 'admin@yeon.com',
            'password': 'admin'}), content_type = 'application/json', HTTP_X_CSRFTOKEN = csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/signout/')
        self.assertEqual(response.status_code, 204)

        response = client.post('/api/signin/', json.dumps({'username': 'admin@yeon.com',
            'password': 'admin'}), content_type = 'application/json', HTTP_X_CSRFTOKEN = csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/graph/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/graph/2/')
        self.assertEqual(response.status_code, 200)


class FriendTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create_user(email='jihyo@twice.com',
            first_name='Jihyo', last_name='Park', password='jihyo')
        self.account2 = Account.objects.create_user(email='nayeon@twice.com',
            first_name='Nayeon', last_name='Im', password='nayeon')
        self.account3 = Account.objects.create_user(email='sana@twice.com',
            first_name='Sana', last_name='Minatozaki', password='sana')
        self.profile1 = Profile.objects.create(account=self.account1)
        self.profile2 = Profile.objects.create(account=self.account2)
        self.profile3 = Profile.objects.create(account=self.account3)

    def test_send_friend_request(self):
        client = Client()

        response = client.post('/api/signin/', json.dumps({'username': 'jihyo@twice.com',
            'password': 'jihyo'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.post('/api/friend/{}/'.format(self.account2.id))
        self.assertEqual(response.status_code, 201) # Sent a Friend Request Succeed
        now = response.json()['createdTime']

        response = client.get('/api/friend/')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.content)
        self.assertEqual(result[0]['content'], 'You sent a friend request to Nayeon Im.')
        self.assertFalse(result[0]['select'])
        self.assertEqual(result[0]['datetime'], now)
        self.assertFalse(result[0]['read'])
        self.assertEqual(result[0]['sender'], self.account1.id)
        self.assertEqual(result[0]['receiver'], self.account2.id)


    def test_read_friend_request(self):
        client = Client()
        notification = Notification(
            content = 'You sent a friend request to Nayeon Im.',
            select = False,
            datetime = '2018-11-24T17:32:19.919Z',
            read = False,
            sender = self.account1,
            receiver = self.account2,
            profile = self.account1,
            )
        notification.save()

        response = client.post('/api/signin/', json.dumps({'username': 'jihyo@twice.com',
            'password': 'jihyo'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.put('/api/friend/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/friend/')
        new_noti = Notification.objects.get(id=notification.id)
        self.assertTrue(new_noti.read)


    def test_receive_friend_request(self):
        client = Client()
        notiOfSender = Notification(
            content = 'You sent a friend request to Nayeon Im.',
            select = False,
            datetime = '2018-11-24T17:32:19.919Z',
            read = False,
            sender = self.account1,
            receiver = self.account2,
            profile = self.account1,
            )
        notiOfSender.save()
        notiOfReceiver = Notification(
            content = 'Jihyo Park sent a friend request to you.',
            select = True,
            datetime = '2018-11-24T17:32:19.919Z',
            read = False,
            sender = self.account1,
            receiver = self.account2,
            profile = self.account2,
            )
        notiOfReceiver.save()

        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.put('/api/friend/{}/'.format(notiOfReceiver.id),
            json.dumps({'answer':'accept'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200)

        notiOfSenderChanged = Notification.objects.get(id=notiOfSender.id)
        notiOfReceiverChanged = Notification.objects.get(id=notiOfReceiver.id)

        self.assertEqual(notiOfSenderChanged.content, 'Nayeon Im accepted a friend request from you.')
        self.assertFalse(notiOfSenderChanged.select)
        self.assertNotEqual(notiOfSenderChanged.datetime, '2018-11-24T17:32:19.919Z')
        self.assertFalse(notiOfSenderChanged.read)


        self.assertEqual(notiOfReceiverChanged.content, 'You accepted a friend request from Jihyo Park.')
        self.assertFalse(notiOfReceiverChanged.select)
        self.assertNotEqual(notiOfReceiverChanged.datetime, '2018-11-24T17:32:19.919Z')
        self.assertFalse(notiOfReceiverChanged.read)

        self.assertIn(self.profile1, self.profile2.friends.all())
        self.assertIn(self.profile2, self.profile1.friends.all())


class GraphTestCase(TestCase):
    pass

class SearchTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create_user(email='jihyo@twice.com',
            first_name='Jihyo', last_name='Park', password='jihyo')
        self.account2 = Account.objects.create_user(email='nayeon@twice.com',
            first_name='Nayeon', last_name='Im', password='nayeon')
        self.account3 = Account.objects.create_user(email='sana@twice.com',
            first_name='Sana', last_name='Minatozaki', password='sana')
        self.account4 = Account.objects.create_user(email='sana@once.com',
            first_name='Sana', last_name='CuteSexy', password='sana')
        self.profile1 = Profile.objects.create(account=self.account1)
        self.profile2 = Profile.objects.create(account=self.account2)
        self.profile3 = Profile.objects.create(account=self.account3)
        self.profile4 = Profile.objects.create(account=self.account4)
        self.group1 = Group.objects.create(name='Twice')
        self.group1.members.add(self.profile1, self.profile2, self.profile3)
        self.group2 = Group.objects.create(name='Korean')
        self.group2.members.add(self.profile1, self.profile2)
    def test_search(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.get('/api/search/jihyo/')
        self.assertJSONEqual(response.content,
            {'persons': [
                    {'id':self.account1.id, 'first_name': 'Jihyo', 'last_name': 'Park'}
                ], 'groups': []}) # firstName Search Succeed

        response = client.get('/api/search/sana%20minatozaki/')
        self.assertJSONEqual(response.content,
            {'persons': [
                {'id':self.account3.id, 'first_name': 'Sana', 'last_name': 'Minatozaki'}
                ], 'groups': []}) # fullname Search Succeed

        response = client.get('/api/search/sana/')
        self.assertJSONEqual(response.content,
        {'persons' : [
            {'id':self.account3.id, 'first_name': 'Sana', 'last_name': 'Minatozaki'},
            {'id':self.account4.id, 'first_name': 'Sana', 'last_name': 'CuteSexy'}
            ], 'groups': []}) # Several Results Search Succeed

        response = client.get('/api/search/twice/')
        self.assertJSONEqual(response.content, {'persons': [],'groups' : [
                {'id': self.group1.id, 'name': 'Twice', 'motto': ''}
            ]})

class GetSelectedUsersTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create_user(email='jihyo@twice.com',
            first_name='Jihyo', last_name='Park', password='jihyo')
        self.account2 = Account.objects.create_user(email='nayeon@twice.com',
            first_name='Nayeon', last_name='Im', password='nayeon')
        self.account3 = Account.objects.create_user(email='sana@twice.com',
            first_name='Sana', last_name='Minatozaki', password='sana')
        self.profile1 = Profile.objects.create(account=self.account1)
        self.profile2 = Profile.objects.create(account=self.account2)
        self.profile3 = Profile.objects.create(account=self.account3)
    def test_user(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.post('/api/user/', json.dumps({'selectedNodes':
            [{'id': self.account1.id, 'label': 'Jihyo'},
            {'id': self.account2.id, 'label': 'Nayeon'}]}), content_type = 'application/json')
        self.assertJSONEqual(response.content, [
            {'id': self.account1.id, 'first_name': 'Jihyo', 'last_name': 'Park'},
            {'id': self.account2.id, 'first_name': 'Nayeon', 'last_name': 'Im'}])

class PostingTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create_user(email='jihyo@twice.com',
            first_name='Jihyo', last_name='Park', password='jihyo')
        self.account2 = Account.objects.create_user(email='nayeon@twice.com',
            first_name='Nayeon', last_name='Im', password='nayeon')
        self.account3 = Account.objects.create_user(email='sana@twice.com',
            first_name='Sana', last_name='Minatozaki', password='sana')
        self.profile1 = Profile.objects.create(account=self.account1)
        self.profile2 = Profile.objects.create(account=self.account2)
        self.profile3 = Profile.objects.create(account=self.account3)
    def test_post_write(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.post('/api/post/write/', json.dumps({
            'selectedUsers': [
                {'id': self.account1.id, 'first_name': 'Jihyo', 'last_name': 'Park'},
                {'id': self.account2.id, 'first_name': 'Nayeon', 'last_name': 'Im'}
            ],
            'content': 'The Best Thing I Ever Did',
            'imagePaths': []
            }), content_type = 'application/json')
        newPost = Post.objects.get(content='The Best Thing I Ever Did')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(newPost.content, 'The Best Thing I Ever Did')
        self.assertEqual(list(newPost.tags.all()), [self.account1, self.account2])
    def test_post_get(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        newPost = Post(content='Likey')
        newPost.save()
        newPost.tags.add(self.account1)
        newPost.tags.add(self.account2)
        response = client.post('/api/post/get/', json.dumps({
            'selectedUsers': [
                {'id': self.account1.id, 'first_name': 'Jihyo', 'last_name': 'Park'},
                {'id': self.account2.id, 'first_name': 'Nayeon', 'last_name': 'Im'}
            ]}), content_type = 'application/json')
        # The testing below should be corrected.
        '''self.assertJSONEqual(response.content, {'posts': [
                {'id':newPost.id, 'content': 'Likey', 'tags':[self.account1.id, self.account2.id]}
            ]})'''

        response = client.post('/api/post/get/', json.dumps({
            'selectedUsers': [
                {'id': self.account1.id, 'first_name': 'Jihyo', 'last_name': 'Park'}
            ]}), content_type = 'application/json')
        self.assertJSONEqual(response.content, {'posts': []})

        response = client.post('/api/post/get/', json.dumps({
            'selectedUsers': [
                {'id': self.account2.id, 'first_name': 'Nayeon', 'last_name': 'Im'}
            ]}), content_type = 'application/json')
        self.assertJSONEqual(response.content, {'posts': []})

        response = client.post('/api/post/get/', json.dumps({
            'selectedUsers': [
                {'id': self.account1.id, 'first_name': 'Jihyo', 'last_name': 'Park'},
                {'id': self.account2.id, 'first_name': 'Nayeon', 'last_name': 'Im'},
                {'id': self.account3.id, 'first_name': 'Sana', 'last_name': 'Minatozaki'},
            ]}), content_type = 'application/json')
        self.assertJSONEqual(response.content, {'posts': []})

class ProfileTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create_user(email='jihyo@twice.com',
            first_name='Jihyo', last_name='Park', password='jihyo')
        self.account2 = Account.objects.create_user(email='nayeon@twice.com',
            first_name='Nayeon', last_name='Im', password='nayeon')
        self.account3 = Account.objects.create_user(email='sana@twice.com',
            first_name='Sana', last_name='Minatozaki', password='sana')
        self.profile1 = Profile.objects.create(account=self.account1)
        self.profile2 = Profile.objects.create(account=self.account2)
        self.profile3 = Profile.objects.create(account=self.account3)
        self.profile1.friends.add(self.profile2)
        self.profile1.friends.add(self.profile3)
        self.profile2.friends.add(self.profile3)
        self.group1 = Group.objects.create(name='Twice')
        self.group1.members.add(self.profile1, self.profile2, self.profile3)
        self.group2 = Group.objects.create(name='Korean')
        self.group2.members.add(self.profile1, self.profile2)

    def test_get_one_profile(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.get('/api/profile/one/{}/'.format(self.account1.id))
        self.assertJSONEqual(response.content, {'name': 'Jihyo Park', 'motto': '', 'groups': ['Twice','Korean'],
            'distance': 1, 'mutual_friends': [{'id': self.account3.id, 'name': 'Sana Minatozaki'}]})

        response = client.put('/api/profile/one/{}/'.format(self.account1.id), json.dumps({
                'motto': 'ONE IN A MILLION'
            }), content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = client.put('/api/profile/one/{}/'.format(self.account2.id), json.dumps({
                'motto': 'ONE IN A MILLION'
            }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Profile.objects.get(account_id=self.account2.id).motto,'ONE IN A MILLION')

    def test_get_multiple_profile(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) #SignIn Succeed

        response = client.post('/api/profile/multi/', json.dumps({'selectedNodes':
            [{'id': self.account1.id, 'label': 'Jihyo'}, {'id': self.account2.id, 'label': 'Sana'}]}), content_type='application/json')
        # self.assertJSONEqual(response.content, {'names': ['Jihyo Park','Nayeon Im'], 'groups': ['Twice','Korean'], 'distance':1})
        result = json.loads(response.content)
        self.assertEqual(result['names'], ['Jihyo Park','Nayeon Im'])
        self.assertIn('Twice',result['groups'])
        self.assertIn('Korean',result['groups'])
        self.assertEqual(len(result['groups']), 2)
        self.assertEqual(result['distance'], 1)


class GroupTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create_user(email='jihyo@twice.com',
            first_name='Jihyo', last_name='Park', password='jihyo')
        self.account2 = Account.objects.create_user(email='nayeon@twice.com',
            first_name='Nayeon', last_name='Im', password='nayeon')
        self.account3 = Account.objects.create_user(email='sana@twice.com',
            first_name='Sana', last_name='Minatozaki', password='sana')
        self.profile1 = Profile.objects.create(account=self.account1)
        self.profile2 = Profile.objects.create(account=self.account2)
        self.profile3 = Profile.objects.create(account=self.account3)
        self.profile1.friends.add(self.profile2)
        self.profile1.friends.add(self.profile3)
        self.profile2.friends.add(self.profile3)
        self.group1 = Group.objects.create(name='Twice')
        self.group1.members.add(self.profile1, self.profile2, self.profile3)


    def make_Korean_group(self, client):
        return client.post('/api/group/', json.dumps({
                'name': 'Korean',
                'motto': 'We are Koreans in Twice',
                'selectedNodes': [
                    {'id': self.account1.id, 'label': 'Jihyo'},
                    {'id': self.account2.id, 'label': 'Nayeon'},
                ]
            }), content_type='application/json')


    def test_make_group(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = self.make_Korean_group(client)
        self.assertEqual(response.status_code, 201)
        created_group = Group.objects.get(name='Korean')
        self.assertEqual(created_group.name, 'Korean')
        self.assertEqual(created_group.motto, 'We are Koreans in Twice')
        self.assertIn(self.profile1, created_group.members.all())
        self.assertIn(self.profile2, created_group.members.all())
        self.assertEqual(created_group.members.count(), 2)


    def test_get_group_graph(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'nayeon@twice.com',
            'password': 'nayeon'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = client.get('/api/group/{}/'.format(self.group1.id))
        self.assertJSONEqual(response.content, {
                'users': [
                    {'id': self.account1.id, 'label': 'Jihyo'},
                    {'id': self.account2.id, 'label': 'Nayeon'},
                    {'id': self.account3.id, 'label': 'Sana'}
                ],
                'friends': [
                    {'from': self.account1.id, 'to': self.account2.id},
                    {'from': self.account1.id, 'to': self.account3.id},
                    {'from': self.account2.id, 'to': self.account3.id}
                ]
            })


    def test_join_to_group(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'sana@twice.com',
            'password': 'sana'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        response = self.make_Korean_group(client)
        self.assertEqual(response.status_code, 201)

        response = client.put('/api/group/{}/'.format(Group.objects.get(name='Korean').id))
        self.assertEqual(response.status_code, 201)
        self.assertIn(self.profile3, Group.objects.get(name='Korean').members.all())

    def test_leave_a_group(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'sana@twice.com',
            'password': 'sana'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200) # SignIn Succeed

        self.assertIn(self.profile3, self.group1.members.all())
        response = client.delete('/api/group/{}/'.format(self.group1.id))
        self.assertNotIn(self.profile3, self.group1.members.all())


class DistanceTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create_user(email='jihyo@twice.com',
            first_name='Jihyo', last_name='Park', password='jihyo')
        self.account2 = Account.objects.create_user(email='nayeon@twice.com',
            first_name='Nayeon', last_name='Im', password='nayeon')
        self.account3 = Account.objects.create_user(email='sana@twice.com',
            first_name='Sana', last_name='Minatozaki', password='sana')
        self.account4 = Account.objects.create_user(email='jeongyeon@twice.com',
            first_name='jeongyeon', last_name='jeongyeon', password='sana')
        self.account5 = Account.objects.create_user(email='momo@twice.com',
            first_name='momo', last_name='momo', password='sana')
        self.account6 = Account.objects.create_user(email='mina@twice.com',
            first_name='mina', last_name='mina', password='sana')
        self.account7 = Account.objects.create_user(email='dahyun@twice.com',
            first_name='dahyun', last_name='dahyun', password='sana')
        self.account8 = Account.objects.create_user(email='chaeyoung@twice.com',
            first_name='chaeyoung', last_name='chaeyoung', password='sana')
        self.account9 = Account.objects.create_user(email='tzuyu@twice.com',
            first_name='tzuyu', last_name='tzuyu', password='sana')
        self.profile1 = Profile.objects.create(account=self.account1)
        self.profile2 = Profile.objects.create(account=self.account2)
        self.profile3 = Profile.objects.create(account=self.account3)
        self.profile4 = Profile.objects.create(account=self.account4)
        self.profile5 = Profile.objects.create(account=self.account5)
        self.profile6 = Profile.objects.create(account=self.account6)
        self.profile7 = Profile.objects.create(account=self.account7)
        self.profile8 = Profile.objects.create(account=self.account8)
        self.profile9 = Profile.objects.create(account=self.account9)
        self.profile1.friends.add(self.profile2)
        self.profile2.friends.add(self.profile3)
        self.profile2.friends.add(self.profile4)
        self.profile3.friends.add(self.profile4)
        self.profile3.friends.add(self.profile8)
        self.profile4.friends.add(self.profile5)
        self.profile4.friends.add(self.profile7)
        self.profile5.friends.add(self.profile6)
        self.profile6.friends.add(self.profile7)
        self.profile7.friends.add(self.profile9)

    def test_distance(self):
        client = Client()
        response = client.post('/api/signin/', json.dumps({'username': 'jihyo@twice.com',
            'password': 'jihyo'}), content_type = 'application/json')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/profile/one/{}/'.format(self.account1.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 0)

        response = client.get('/api/profile/one/{}/'.format(self.account2.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 1)

        response = client.get('/api/profile/one/{}/'.format(self.account3.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 2)

        response = client.get('/api/profile/one/{}/'.format(self.account4.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 2)

        response = client.get('/api/profile/one/{}/'.format(self.account5.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 3)

        response = client.get('/api/profile/one/{}/'.format(self.account6.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 4)

        response = client.get('/api/profile/one/{}/'.format(self.account7.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 3)

        response = client.get('/api/profile/one/{}/'.format(self.account8.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 3)

        response = client.get('/api/profile/one/{}/'.format(self.account9.id))
        result = json.loads(response.content)
        self.assertEqual(result['distance'], 4)
