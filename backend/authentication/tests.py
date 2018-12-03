from django.test import TestCase, Client
import json
from authentication.models import Account, Profile, Notification

class AuthenticationTestCase(TestCase):
	def test(self):
		client = Client(enforece_csrf_checks = True)
		response = client.post('api/signup/', json.dumps({'username': 'admin@yeon.com',
			'password': 'admin', 'firstName': 'yeon', 'lastName': 'admin'}),
		content_type = 'application/json')
		#self.assertEqual(response.status_code, 403)

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
		self.account1 = Account.objects.create_user(email='jihyo@twice.com', first_name='Jihyo', last_name='Park', password='jihyo')
		self.account2 = Account.objects.create_user(email='nayeon@twice.com', first_name='Nayeon', last_name='Im', password='nayeon')
		self.account3 = Account.objects.create_user(email='sana@twice.com', first_name='Sana', last_name='Minatozaki', password='sana')
		self.profile1 = Profile(account=self.account1)
		self.profile2 = Profile(account=self.account2)
		self.profile3 = Profile(account=self.account3)
		self.profile1.save()
		self.profile2.save()
		self.profile3.save()

	def test_send_friend_request(self):
		client = Client()

		response = client.post('/api/signin/', json.dumps({'username': 'jihyo@twice.com',
			'password': 'jihyo'}), content_type = 'application/json')
		self.assertEqual(response.status_code, 200) #SignIn Succeed

		response = client.post('/api/friend/2/')
		self.assertEqual(response.status_code, 201) #Sent a Friend Request Succeed
		now = response.json()['createdTime']

		response = client.get('/api/friend/')
		self.assertEqual(response.status_code, 200)
		self.assertJSONEqual(response.content, [{
				'id': 1,
				'content': 'You sent a friend request to Nayeon Im.',
				'select': False,
				'datetime': now,
				'read': False,
				'sender': 1,
				'receiver': 2
			}])


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
		self.assertEqual(response.status_code, 200) #SignIn Succeed

		response = client.put('/api/friend/')
		self.assertEqual(response.status_code, 200)
		response = client.get('/api/friend/')
		self.assertJSONEqual(response.content, [{
				'id': 1,
				'content': 'You sent a friend request to Nayeon Im.',
				'select': False,
				'datetime': '2018-11-24T17:32:19.919Z',
				'read': True,
				'sender': 1,
				'receiver': 2
			}])

	
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
		self.assertEqual(response.status_code, 200) #SignIn Succeed

		response = client.put('/api/friend/2/', json.dumps({'answer':'accept'}), content_type = 'application/json')
		self.assertEqual(response.status_code, 200)

		notiOfSenderChanged = Notification.objects.get(id=1)
		notiOfReceiverChanged = Notification.objects.get(id=2)

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