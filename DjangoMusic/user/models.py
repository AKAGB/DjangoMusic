from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.exceptions import ValidationError

class MusicUser(models.Model):
    user = models.OneToOneField(User, verbose_name='用户', related_name='user',
                    on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50, verbose_name='昵称')
    picture = models.CharField(max_length=350, blank=True, null=True, verbose_name='头像')
    email = models.CharField(max_length=50, blank=True, null=True, verbose_name='邮箱')
    matedata = models.TextField(null=True, blank=True)
    created_time = models.DateTimeField('创建时间', default=now)
    last_mod_time = models.DateTimeField('修改时间', default=now)
    is_musician = models.BooleanField(default=False)

    def __str__(self):
        return self.nickname

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = verbose_name
        ordering = ['-created_time']