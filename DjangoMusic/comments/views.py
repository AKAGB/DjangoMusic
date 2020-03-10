from django.shortcuts import render
from music.models import Song
from .models import Comment
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

# Create your views here.
@login_required
def getComment(request):
    # 首先获取歌曲信息（图片、歌名、歌手、专辑）
    # songid = request.GET.get('id', None)
    if request.method == 'POST':
        body = request.POST.get('comment', None)
        songid = request.POST.get('song', None)
        song = Song.objects.get(id=songid)
        Comment.objects.create(
            body=body,
            song=song,
            author=request.user,
        )
        
    else:
        songid = request.GET.get('songid', None)
        song = Song.objects.get(id=songid)
    # 读取歌曲相关的所有评论
    comments_list = list(song.comments.order_by('create_time').values())
    comments_result = []
    for each in comments_list:
        tmp = {}
        tmp['body'] = each['body']
        tmp['time'] = str(each['create_time'])[:19]
        cauthor = User.objects.get(id=each['author_id'])
        tmp['author'] = cauthor.username
        comments_result.append(tmp) 
    comments_result = comments_result[::-1]
    result = Song.objects.get(id=songid)

    return render(request, 'comments/comment_list.html', {
        'songname': result.songname,
        'album_name': result.album_name,
        'picture_url': result.picture_url,
        'singer': result.singer,
        'songid': songid,
        'username': request.user.username,
        'comments_result': comments_result,
        'counts': len(comments_result),
    })