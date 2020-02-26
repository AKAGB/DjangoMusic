from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from user.models import MusicUser
from .models import Playlist, Song
# Create your views here.

@login_required
def mymusic(request, success=4):
    music_user = MusicUser.objects.filter(user=request.user)[0]
    collect = music_user.collect_user.all()
    build = music_user.build_user.all()
    collect_list = list(collect.values())
    build_list = list(build.values())

    # 前后端数据对接
    collect_result = []
    for each in collect_list:
        dict_collect = {}
        dict_collect.update({"id":each["id"]})
        dict_collect.update({"playList_name":each["playlistname"]})
        dict_collect.update({"playlist_createdTime":str(each["build_date"])})
        play = Playlist.objects.filter(id = each["id"])
        song_num = len(play[0].songs.all().values())
        dict_collect.update({"playlist_cnt":song_num})
        collect_result.append(dict_collect)

    build_result = []
    for each in build_list:
        dict_build = {}
        dict_build.update({"id":each["id"]})
        dict_build.update({"playList_name":each["playlistname"]})
        dict_build.update({"playlist_createdTime":str(each["build_date"])})
        play=Playlist.objects.filter (id = each["id"])
        song_num = len(play[0].songs.all().values())
        dict_build.update({"playlist_cnt":song_num})
        build_result.append(dict_build)

    return render(request, 'music/playlist.html', {
        'username': request.user.username,
        'build_result': build_result,
        'collect_result': collect_result,
        'style1': 'nav_hover',
        'success': success,
    })

@login_required
def upload(request):
    """
    上传音乐界面
    """
    error = ['','','','上传音乐文件','上传歌词文件','上传配图文件']
    flag = True
    if request.method == "POST":
        songname = ""
        singer = ""
        words = ""
        song_url = ""
        picture_url = ""
        album_name = ""
        song_time = 0
        songname = request.POST.get("songname",None)  #输入歌曲名
        singer = request.POST.get("singer",None) #输入歌手名
        album_name = request.POST.get("album_name",None) #输入专辑名
        #获取歌曲文件
        song_file = request.FILES.get("song_file",None)
        #获取歌词文件
        song_words_file = request.FILES.get("song_words_file",None)
        #获取图片文件
        picture_file = request.FILES.get("picture_file",None)
        #判断输入是否出错
        if album_name == None or album_name == "":
            error[0] = "专辑名不能为空"
            flag = False
        if songname == None or songname == "":
            error[1] = "歌名不能为空"
            flag = False
        if singer == None or singer == "":
            error[2] = "歌手名不能为空"
            flag = False
        if song_file == None or song_file.name[-4:]!=".mp3":
            error[3] = "歌曲文件未选择或格式不为MP3"
            flag = False
        if song_words_file == None or song_words_file.name[-4:]!=".txt":
            error[4] = "歌词txt文件未选择或格式不为txt"
            flag = False
        if picture_file == None:
            error[5] = "歌曲配图文件未选择"
            flag = False
        #按要求输入相关数据和文件后进行数据处理
        if flag:
            thesong = Song.objects.create(
                    songname = songname,
                    singer = singer,
                    album_name = album_name,
                    words = "words",
                    song_url = "song_url",
                    picture_url = "picture_url",
                    song_time = "song_time",
                    userid = request.user
                )
            id=thesong.id
            #歌曲文件及路径名
            file_name_song = "./static/song_file/" + str(id) + "_" + song_file.name
            #歌词文件及路径名
            file_name_song_words = "./static/song_words_file/" + str(id) + "_" + song_words_file.name
            #图片文件及路径名
            file_name_picture = "./static/picture_file/" + str(id) + "_" + picture_file.name
            picture_url = file_name_picture
            song_url = file_name_song
            #分块写入文件
            with open(file_name_song, mode='wb+') as f:
                for chunk in  song_file.chunks():
                    f.write(chunk)
            with open(file_name_song_words, mode='wb+') as f:
                for chunk in  song_words_file.chunks():
                    f.write(chunk)
            with open(file_name_picture, mode='wb+') as f:
                for chunk in  picture_file.chunks():
                    f.write(chunk)
            #读取歌词存为string
            for line in  open(file_name_song_words, encoding='utf-8'):
                line = line.strip('\n')
                words = words+line+"\n"
            #获取音乐时长
            audio = MP3(song_url)
            song_time = str(audio.info.length)
            #创建model
            thesong = Song.objects.filter(id=id).update(
                    words = words,
                    song_url = song_url[1:],
                    picture_url = picture_url[1:],
                    song_time = song_time
                )
            #插入到默认歌单：我发布的音乐
            thesong = Song.objects.get(id=id)
            playlist = Playlist.objects.get(playlistname=str(request.user.username)+"_发布的音乐")
            playlist.songs.add(thesong)
            return render(request, 'upload.html', {
                'alertBool': 1,
                'username': request.user.username,
                })
        else:
            return render(request, 'upload.html', {
                    'alertBool': 0,
                    'username': request.user.username,
                })
    else:
        return render(request, 'upload.html', {
                    'username': request.user.username,
                    'alertBool': 2,
                    "error": error,
                    "style2":"nav_hover"
                })

@login_required
def search(request):
    """
    搜索歌曲或歌单
    """

    value = request.GET.get("value",None)
    songs_result = search_music(value)
    username = request.user.username
    playlists_result = search_playlist(username,value)
    return render(request, 'Search.html', {
        'value': value,
        'songs_result': songs_result,
        'playlists_result' : playlists_result
    })

def search_music(value):
    """
    根据关键字搜索歌曲
    """
    songs = Song.objects.filter (songname__icontains=value)
    temp_result = list(songs.values())

    songs_result=[]
    for each_song in temp_result:
        dict_song = {}
        dict_song.update({"song_id":each_song["id"]})
        dict_song.update({"songList_songname":each_song["songname"]})
        dict_song.update({"songList_songauthor":each_song["singer"]})
        dict_song.update({"songList_album":each_song["album_name"]})
        temp = each_song["song_time"]
        time = str(int(float(temp)/60)) + ':' + str(int(float(temp))%60)
        dict_song.update({"songList_songtime":time})
        songs_result.append(dict_song)
    return songs_result

def search_playlist(username,value):
    """
    根据关键字搜索歌单
    """
    playlists = Playlist.objects.filter (playlistname__icontains=value)
    playlists_result = []
    tmep_playlists_result = list(playlists.all().values())
    for each_playlist in tmep_playlists_result:
        dict_playlist = {}
        dict_playlist.update({"playlist_id":each_playlist["id"]})
        dict_playlist.update({"songListT_name":each_playlist["playlistname"]})

        play=Playlist.objects.filter (id = each_playlist["id"])
        song_num = len(play[0].songs.all().values())

        dict_playlist.update({"songListT_num":song_num})
        dict_playlist.update({"songList_songauthor":play[0].build_user.username})
        if len(play[0].collectuser.all().filter(username=username)) > 0:
            # 已收藏
            dict_playlist.update({"playlist_flag":"1"})
        else:
            # 未收藏
            dict_playlist.update({"playlist_flag":"0"})
        playlists_result.append(dict_playlist)
    return playlists_result

@login_required
def music_player_song(request):
    """
    音乐播放界面
    """
    value = request.GET.get("value")
    songid = request.GET.get("songid")
    songs_result=search_music(value)
    return render(request, 'music_player.html', {
        'songid' : songid,
        'songs_result': songs_result,
    })

@login_required
def music_player_playlist(request):
    """
    获取完整歌单播放
    """
    playlistid = request.GET.get("playlistid")
    songid = request.GET.get("songid")
    p = Playlist.objects.filter (id=playlistid)
    playlist = p.all().values()[0]
    songs = list(p[0].songs.all().values())
    songs_result=[]
    for each_song in songs:
        dict_song = {}
        dict_song.update({"song_id":each_song["id"]})
        dict_song.update({"songList_songname":each_song["songname"]})
        dict_song.update({"songList_songauthor":each_song["singer"]})
        dict_song.update({"songList_album":each_song["album_name"]})
        temp = each_song["song_time"]
        time = str(int(float(temp)/60)) + ':' + str(int(float(temp))%60)
        dict_song.update({"songList_songtime":time})
        songs_result.append(dict_song)
    
    return render(request, 'music_player.html', {
        'songid' : songid,
        'songs_result': songs_result,
    })