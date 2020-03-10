from django.db import models
from django.utils.timezone import now
from music.models import Song
from django.contrib.auth.models import User

# Create your models here.

class Comment(models.Model):
    body = models.TextField('正文', max_length=300)
    create_time = models.DateTimeField('创建时间', default=now)
    author = models.ForeignKey(User, verbose_name='发布者', on_delete=models.CASCADE)
    song = models.ForeignKey(Song, verbose_name='歌曲', on_delete=models.CASCADE,
                 related_name='comments')

    class Meta:
        ordering = ['id']
        verbose_name = '评论'
        verbose_name_plural = verbose_name
        get_latest_by = 'id'

    def __str__(self):
        return self.body

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)