# Generated by Django 2.2.8 on 2020-03-04 08:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlist',
            name='build_user',
            field=models.ForeignKey(default=1, on_delete=True, related_name='build_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='collectuser',
            field=models.ManyToManyField(related_name='collect_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='song',
            name='userid',
            field=models.ForeignKey(db_column='userid', on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]