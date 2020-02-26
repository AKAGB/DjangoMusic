from django.urls import path
from . import views

app_name = 'user'
urlpatterns = [
    path(r'mymusic/', views.mymusic, name='mymusic'),
    path(r'upload/', views.upload, name='upload'),
]