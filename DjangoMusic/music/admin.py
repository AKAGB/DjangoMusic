from django.contrib import admin
from .models import *
# Register your models here.

class SongAdmin(admin.ModelAdmin):
    list_display = ['songname', 'song_time',
                    'singer', 'song_url', 'album_name']

class PlaylistAdmin(admin.ModelAdmin):
    list_display = ['playlistname', 'build_user',
                    'build_date']

admin.site.register(Song, SongAdmin)
admin.site.register(Playlist, PlaylistAdmin)