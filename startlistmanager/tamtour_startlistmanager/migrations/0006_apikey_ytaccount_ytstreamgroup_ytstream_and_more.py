# Generated by Django 5.1.4 on 2024-12-27 00:34

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tamtour_startlistmanager', '0005_startliste_overlay_title_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ApiKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('valid_until', models.DateTimeField()),
                ('key', models.UUIDField(default=uuid.uuid4, unique=True)),
            ],
            options={
                'verbose_name': 'API-Key',
                'verbose_name_plural': 'API-Keys',
            },
        ),
        migrations.CreateModel(
            name='YTAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('yt_account_id', models.CharField(blank=True, default='', max_length=12)),
                ('credentials', models.JSONField(blank=True, default=dict)),
            ],
            options={
                'verbose_name': 'YT Account',
                'verbose_name_plural': 'YT Accounts',
            },
        ),
        migrations.CreateModel(
            name='YTStreamGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('stream_description_preset', models.TextField(blank=True, default='', help_text="Unterstützt Platzhalter '{{ TIMETABLE }}' und '{{ STARTLOG }}'")),
                ('yt_playlist_id', models.CharField(blank=True, default='', max_length=12)),
                ('account', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stream_groups', to='tamtour_startlistmanager.ytaccount')),
            ],
            options={
                'verbose_name': 'YT Streamgruppe',
                'verbose_name_plural': 'YT Streamgruppen',
            },
        ),
        migrations.CreateModel(
            name='YTStream',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('yt_title', models.CharField(max_length=80)),
                ('yt_id', models.CharField(blank=True, default='', max_length=12)),
                ('description_head', models.TextField(blank=True, default='', help_text="Unterstützt Platzhalter '{{ TIMETABLE }}' und '{{ STARTLOG }}'")),
                ('description_foot', models.TextField(blank=True, default='', help_text="Unterstützt Platzhalter '{{ TIMETABLE }}' und '{{ STARTLOG }}'")),
                ('show_in_timetable', models.BooleanField(default=True)),
                ('name_in_timetable', models.CharField(blank=True, max_length=30)),
                ('scheduled_start_time', models.DateTimeField()),
                ('scheduled_end_time', models.DateTimeField()),
                ('actual_start_time', models.DateTimeField(blank=True, null=True)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='streams', to='tamtour_startlistmanager.ytstreamgroup')),
            ],
            options={
                'verbose_name': 'YT Stream',
                'verbose_name_plural': 'YT Streams',
            },
        ),
        migrations.CreateModel(
            name='YTStreamStartTimeLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField()),
                ('content', models.CharField(max_length=50)),
                ('stream', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='start_time_logs', to='tamtour_startlistmanager.ytstream')),
            ],
            options={
                'verbose_name': 'YT Startzeit-Logeintrag',
                'verbose_name_plural': 'YT Startzeit-Logeinträge',
            },
        ),
    ]