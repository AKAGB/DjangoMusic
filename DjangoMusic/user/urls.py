from django.urls import re_path
from . import views

app_name = 'user'
urlpatterns = [
    re_path(r'^register/$', views.register, name='register'),
    re_path(r'^login/$', views.login, name='login'),
]