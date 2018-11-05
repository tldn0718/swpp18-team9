from django.test import TestCase, Client
import json

class ApiTestCase(TestCase):
	def test_signin(self):
		client = Client()
		response = client.post('/api/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
		self.assertEqual(response.status_code, 201)

		response = client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
		self.assertEqual(response.status_code, 204)

