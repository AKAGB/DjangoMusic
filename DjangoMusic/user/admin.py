from django.contrib import admin
from .models import *
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    # 设置数据库中显示哪些字段
    list_display = ['user', 'nickname', 'email']

admin.site.register(MusicUser, UserAdmin)