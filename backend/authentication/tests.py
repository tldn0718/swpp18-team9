from django.test import TestCase, Client
import json

class APITestCase(TestCase):
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

		response = client.post('/api/signin/', json.dumps({'username': 'admin@yeon.com',
			'password': 'admin'}), content_type = 'application/json', HTTP_X_CSRFTOKEN = csrftoken)
		self.assertEqual(response.status_code, 200)

		response = client.get('/api/signout/')
		self.assertEqual(response.status_code, 204)

		response = client.post('/api/signin/', json.dumps({'username': 'admin@yeon.com',
			'password': 'admin'}), content_type = 'application/json', HTTP_X_CSRFTOKEN = csrftoken)
		self.assertEqual(response.status_code, 200)		
		response = client.get('/api/friend/')
		self.assertEqual(response.status_code, 200)
		response = client.get('/api/friend/2/')
		self.assertEqual(response.status_code, 200)
