from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('signup/', views.signup, name = 'signup'),
    path('signin/', views.signin, name = 'signin'),
    path('signout/', views.signout, name='signout'),
    path('friend/', views.friend, name = 'friend'),
    path('token/', views.token, name='token'),
]
