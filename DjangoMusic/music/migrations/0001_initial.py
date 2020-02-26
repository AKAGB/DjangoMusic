# Generated by Django 2.2.8 on 2020-02-25 02:01

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('songname', models.CharField(max_length=255)),
                ('song_time', models.CharField(max_length=255)),
                ('singer', models.CharField(max_length=255)),
                ('song_url', models.CharField(max_length=255)),
                ('picture_url', models.CharField(max_length=255)),
                ('album_name', models.CharField(max_length=255)),
                ('words', models.CharField(max_length=4095)),
                ('isvalid', models.IntegerField(default=1)),
                ('userid', models.ForeignKey(db_column='userid', on_delete=django.db.models.deletion.DO_NOTHING, to='user.MusicUser')),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('playlistname', models.CharField(max_length=255)),
                ('build_date', models.DateField(default=django.utils.timezone.now)),
                ('picture_url', models.CharField(max_length=255)),
                ('build_user', models.ForeignKey(default=1, on_delete=True, related_name='build_user', to='user.MusicUser')),
                ('collectuser', models.ManyToManyField(related_name='collect_user', to='user.MusicUser')),
                ('songs', models.ManyToManyField(blank=True, to='music.Song')),
            ],
        ),
    ]