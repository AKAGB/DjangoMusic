from django.contrib import admin
from .models import *
# Register your models here.
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'song',
                    'create_time', 'body']

admin.site.register(Comment, CommentAdmin)