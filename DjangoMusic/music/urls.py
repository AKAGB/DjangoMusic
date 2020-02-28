from django.urls import path
from . import views

app_name = 'user'
urlpatterns = [
    path(r'mymusic/', views.mymusic, name='mymusic'),
    path(r'upload/', views.upload, name='upload'),
    path(r'ajax_songlist/',views.getsonglist),
    path(r'ajax_addsong/',views.add_song),
    path(r'ajax_removesong/',views.remove_song),
    path(r'ajax_addsonglist/',views. add_songlist),
    path(r'Search/',views.search),
    path(r'music_player_song/',views.music_player_song),
    path(r'get_music_detail/',views.get_music_detail),
    path(r'music_player_playlist/',views.music_player_playlist),
    path(r'single_playlist_info/',views.single_playlist_info),
    path(r'alterPlayList/', views.alterPlayList),
    path(r'remove_playlist/', views.remove_playlist),
    path(r'mymusic/createlist/', views.createlist),
]