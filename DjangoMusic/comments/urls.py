from django.urls import path
from . import views

app_name = 'user'
urlpatterns = [
    path(r'comment/', views.getComment, name='mymusic'),
]