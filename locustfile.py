from locust import HttpLocust, TaskSet, task
import json

class LoadTask(TaskSet):
    def on_start(self):
        response = self.client.get('/api/token/')
        csrftoken = response.cookies['csrftoken']
        self.client.post('/api/signin/', json.dumps({
                'username': 'admin',
                'password': 'admin'
            }), headers={"X-CSRFToken": csrftoken}, cookies={"csrftoken": csrftoken})

    def on_stop(self):
        self.client.get('/api/signout/')

    @task
    def index_page(self):
        self.client.get('/api/graph/')


class WebsiteUser(HttpLocust):
    task_set = LoadTask
    min_wait = 3000
    max_wait = 8000
