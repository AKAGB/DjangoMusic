from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import MusicUser
from music.models import Song, Playlist

import re
# Create your views here.

def email_check(email):
    """
    检查是否为邮箱格式
    """
    pattern = re.compile(r'\"?([-a-zA-Z0-9.`?{}]+@\w+\.\w+)\"?')
    return re.match(pattern, email)

def recommend_music():
    """
    首页歌单推荐算法
    """
    list_result=[]
    playlists = list(Playlist.objects.all().values())[-3:]
    for each_list in playlists:
        dict_list = {}
        dict_list.update({"list_id":each_list["id"]})
        dict_list.update({"list_name":each_list["playlistname"]})
        dict_list.update({"list_picture":each_list["picture_url"]})
        list_result.append(dict_list)
    print(list_result)
    return list_result

def register(request):
    """
    注册页面
    """
    if request.method == 'POST':
        username = request.POST.get('username', None)
        email = request.POST.get('email', None)
        password1 = request.POST.get('password1', None)
        password2 = request.POST.get('password2', None)

        # 检验输入合理性
        if len(username) < 6 or len(username) > 50:
            return render(request, 'user/registeration.html', {
                'error': '用户名必须介于6-50个字符'
            })
        filter_result = User.objects.filter(username=username)
        if len(filter_result) > 0:
            return render(request, 'user/registeration.html', {
                'error': '该用户名已存在'
            }) 
        if not email_check(email):
            return render(request, 'user/registeration.html', {
                'error': '请输入有效的邮箱'
            })
        filter_result = User.objects.filter(email=email)
        if len(filter_result) > 0:
            return render(request, 'user/registeration.html', {
                'error': '该邮箱已被注册'
            })
        if len(password1) < 6 or len(password1) > 20:
            return render(request, 'user/registeration.html', {
                'error': '密码必须介于6-20个字符之间'
            })
        if password1 != password2:
            return render(request, 'user/registeration.html', {
                'error': '两次密码输入不一致，请重新输入'
            })

        user = User.objects.create_user(username=username, password=password1)
        music_user = MusicUser(user=user, email=email, nickname=username)
        music_user.save()

        # 给新创建的用户创建歌单
        Playlist.objects.create(
            playlistname = str(username) + '_发布的音乐',
            build_user = music_user,
            picture_url = '/static/images/system_image_file/发布的音乐.jpg'
        )
        Playlist.objects.create(
            playlistname = str(username) + '_喜欢的音乐',
            build_user = music_user,
            picture_url = '/static/images/system_image_file/喜欢的音乐.jpg'
        )
        auth.login(request, user)
        return HttpResponseRedirect('/index/')
    else:
        return render(request, 'user/registeration.html')

def login(request):
    """
    登录页面
    """
    if request.method == 'POST':
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)

        user = auth.authenticate(username=username, password=password)

        if user is not None and user.is_active:
            auth.login(request, user)
            # 跳转到用户界面
            return HttpResponseRedirect('/index/')
        else:
            return render(request, 'user/login.html', {
                'error': '账号或密码错误，请重试'
            })
    else:
        return render(request, 'user/login.html')

@login_required
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(r'/login/')

def index(request):
    """
    主页
    """
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    # 获取推荐音乐
    recommendData = recommend_music()
    return render(request, "user/index.html", {
        'username': request.user.username,
        'style0': 'nav_hover',
        'recommendData': recommendData,
    })