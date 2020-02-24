from django.urls import path
from . import views

app_name = 'user'
urlpatterns = [
    path(r'register/', views.register, name='register'),
    path(r'login/', views.login, name='login'),
    path(r'index/', views.index),

]