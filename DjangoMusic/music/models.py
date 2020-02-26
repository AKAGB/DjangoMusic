from django.db import models
from user.models import MusicUser
from django.utils import timezone

# Create your models here.
class Song(models.Model):
    songname = models.CharField(max_length=255)
    song_time = models.CharField(max_length=255)
    singer = models.CharField(max_length=255)
    song_url = models.CharField(max_length=255)
    picture_url = models.CharField(max_length=255)
    userid = models.ForeignKey(MusicUser, models.DO_NOTHING, db_column='userid')
    album_name = models.CharField(max_length=255)
    words = models.CharField(max_length=4095)
    isvalid = models.IntegerField(default=1)

    def __str__(self):
        return self.songname
    
    @staticmethod
    def getDetail():
        return ['songname','song_url',
        'song_time', 'singer', 'userid', 'album_name',"words"]
    
    @staticmethod
    def getattr():
        return ['songname','song_time',
        'singer', 'album_name']
    
    @staticmethod
    def getItems(username, attr=None, value=None, playlist=None):
        if playlist is not None:
            sets = Playlist.objects.get(playlistname=playlist).songs.all()
        else:
            sets = Song.objects.all()
        r = sets
        if attr is not None:
            if attr == 'id':
                r = sets.filter(id=value)
            else:
                r = eval('sets.filter(%s__icontains=value)' % attr)
        result = list(r.values())
        return result

class Playlist(models.Model):
    playlistname = models.CharField(max_length=255)
    build_user = models.ForeignKey(MusicUser, related_name='build_user', on_delete=True, default=1)
    build_date = models.DateField(default=timezone.now)
    picture_url = models.CharField(max_length=255)
    
    collectuser = models.ManyToManyField(MusicUser, related_name = "collect_user")
    songs = models.ManyToManyField(Song,blank=True)
    
    def __str__(self):
        return self.playlistname
    
    @ staticmethod
    def getattr():
        return ['playlistname','build_user','build_date']
    
    @staticmethod
    def getDetail():
        return ['playlistname','build_user','build_date']

    @staticmethod
    def getItems(username, attr=None, value=None, related=False):
        # if not related:
        if attr is None:
            r = Playlist.objects.all()
        else:    
            if attr == 'id':
                r = Playlist.objects.filter(id=value)
            else:
                r = eval('Playlist.objects.filter(%s__icontains=value)' % attr)
        result = list(r.values())

        for i, playlist in enumerate(r):
            result[i]['build_user'] = playlist.build_user.username
            if result[i]['build_user'] == username:
                # 创建者
                result[i]['state'] = 0
            elif len(playlist.collectuser.all().filter(username=username)) > 0:
                # 已收藏
                result[i]['state'] = 1
            else:
                # 未收藏
                result[i]['state'] = 2
        
        return result