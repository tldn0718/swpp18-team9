from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('signup/', views.signup, name = 'signup'),
    path('signin/', views.signin, name = 'signin'),
    path('signout/', views.signout, name='signout'),
    path('graph/', views.totalGraph, name = 'graph'),
    path('graph/<int:level>/', views.levelGraph, name = 'levelGraph'),
    path('friend/', views.totalFriendRequest, name= 'friend'),
    path('friend/<int:id>/', views.specificFriendRequest, name='friendRequest'),
    path('token/', views.token, name='token'),
]
