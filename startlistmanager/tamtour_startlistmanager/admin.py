from django.contrib import admin, messages
from django.contrib.admin import display
from django.db import models
from django.http import Http404
from django.shortcuts import redirect
from django.urls import path, reverse
from django import forms
from django.utils.html import format_html

from .models import WettspielKategorie, Wettspieler, Komposition, Startliste, StartlistenEintrag, ApiKey, YTAccount, \
    YTStreamGroup, YTStream, YTStreamStartTimeLog
from .views import startliste_duplizieren, startliste_drucken
from .youtube import YouTubeOAuth, YouTubeAPI


# Register your models here.

@admin.register(WettspielKategorie)
class WettspielKategorieAdmin(admin.ModelAdmin):
    list_display = ("pk", "titel", "kurzform", "default_composition_type")
    list_editable = ("titel", "kurzform", "default_composition_type")
    search_fields = ("titel", "kurzform")
    list_filter = ("default_composition_type",)


@admin.register(Wettspieler)
class WettspielerAdmin(admin.ModelAdmin):
    list_display = ("pk", "name", "verein", "is_group", "group_members")
    list_editable = ("name", "verein", "is_group", "group_members")
    list_filter = ("is_group", "verein")
    search_fields = ("name", "verein", "group_members")

    fieldsets = [
        (None, {"fields": ["name", "verein"]}),
        ("Gruppe", {"fields": ["is_group", "group_members"]})
    ]


@admin.register(Komposition)
class KompositionenAdmin(admin.ModelAdmin):
    list_display = ("pk", "klakomtitel", "titel", "komponist", "typ")
    list_editable = ("klakomtitel", "titel", "komponist", "typ")
    list_filter = ("typ",)
    search_fields = ("klakomtitel", "titel", "komponist")


class StartlistenAdminStartlistenEintragInline(admin.TabularInline):
    model = StartlistenEintrag
    extra = 0

    fields = ("zeit", "kategorie", "startnummer", "wettspieler", "komposition")
    autocomplete_fields = ("kategorie", "wettspieler", "komposition")

    formfield_overrides = {
        models.TimeField: {"widget": forms.TimeInput(format='%H:%M', attrs={"style": "width: 3rem;"})},
    }

    # Custom queryst

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('kategorie', 'wettspieler', 'komposition')

    class Media:
        css = {"all": ("admin/css/hide_admin_original.css",)}


@admin.register(Startliste)
class StartlistenAdmin(admin.ModelAdmin):
    list_display = ("titel", "visible", "overlay_title", "beschreibung", "print_link")
    list_editable = ("overlay_title", "visible")

    inlines = (StartlistenAdminStartlistenEintragInline,)

    def get_urls(self):
        info = self.model._meta.app_label, self.model._meta.model_name

        urls = super().get_urls()

        my_urls = [
            path('<path:object_id>/duplicate/', self.admin_site.admin_view(startliste_duplizieren),
                 name='%s_%s_duplizieren' % info),
            path('<path:object_id>/print/', self.admin_site.admin_view(startliste_drucken),
                 name='%s_%s_drucken' % info),
        ]
        return my_urls + urls

    @display(description="Drucken")
    def print_link(self, obj: Startliste):
        info = self.model._meta.app_label, self.model._meta.model_name
        url = reverse(
            "admin:%s_%s_drucken" % info, args=[obj.pk]
        )
        return format_html('<a href="{}" target="_blank" title="Startliste drucken">🖨</a>️', url)


# API models

@admin.register(ApiKey)
class ApiKeyAdmin(admin.ModelAdmin):
    list_display = ['name', 'valid_until']
    search_fields = ['name', 'valid_until', 'key']
    readonly_fields = ['key']
    fieldsets = [
        (None, {"fields": ["name", "valid_until"]}),
        ("Token", {"fields": ["key"], "classes": ["collapse"]})
    ]


# YT API integration models

@admin.register(YTAccount)
class YTAccountAdmin(admin.ModelAdmin):
    list_display = ['name', 'yt_account_name', 'yt_account_id']
    fieldsets = [
        (None, {"fields": ["name"]}),
        ("YouTube data", {"fields": ["yt_account_id", "yt_account_name"]}),
        ("Credentials", {"fields": ["credentials"], "classes": ["collapse"]})
    ]
    readonly_fields = ['yt_account_id', 'yt_account_name', 'credentials']

    def get_urls(self):
        info = self.model._meta.app_label, self.model._meta.model_name

        urls = super().get_urls()

        my_urls = [
            path('oauth-callback', self.admin_site.admin_view(self.oauth_callback),
                 name='%s_%s_oauth_callback' % info),
            path('<path:object_id>/oauth-start/', self.admin_site.admin_view(self.oauth_start),
                 name='%s_%s_oauth_start' % info),
        ]
        return my_urls + urls

    def oauth_start(self, request, object_id):
        try:
            account = YTAccount.objects.get(pk=object_id)
            return YouTubeOAuth.redirect_to_authorization_url(request, account)
        except YTAccount.DoesNotExist:
            return Http404()

    def oauth_callback(self, request):
        if 'error' in request.GET:
            messages.error(request, "Authentifizierung fehlgeschlagen: " + request.GET['error'])
        elif 'code' in request.GET:
            account = YouTubeOAuth.handle_callback(request)
            messages.success(request, "Authentifizierung erfolgreich!")
            return redirect(reverse('admin:tamtour_startlistmanager_ytaccount_change', args=(account.pk,)))
        return redirect(reverse('admin:tamtour_startlistmanager_ytaccount_changelist'))


class YTStreamGroupAdminStreamInline(admin.StackedInline):
    model = YTStream
    extra = 0
    fields = [('name_in_timetable', 'show_in_timetable'), ('yt_title', 'yt_id'),
              ('description_head', 'description_foot'),
              ('scheduled_start_time', 'scheduled_end_time')]
    show_change_link = True


@admin.register(YTStreamGroup)
class YTStreamGroupAdmin(admin.ModelAdmin):
    inlines = [YTStreamGroupAdminStreamInline]

    def get_urls(self):
        info = self.model._meta.app_label, self.model._meta.model_name

        urls = super().get_urls()

        my_urls = [
            path('<path:object_id>/push-api/', self.admin_site.admin_view(self.push_to_api),
                 name='%s_%s_push_api' % info),
        ]
        return my_urls + urls

    def push_to_api(self, request, object_id):
        try:
            group = YTStreamGroup.objects.select_related('account').get(pk=object_id)
            api = YouTubeAPI(group.account)
            try:
                # Round 1: Create streams that do not exist yet
                for stream in group.streams.filter(yt_id=""):
                    api.create_broadcast_from_obj(stream)
                    messages.success(request, f"Broadcast '{stream.yt_id}' erstellt!")
                    if group.yt_playlist_id:
                        api.add_broadcast_to_playlist(stream, group.yt_playlist_id)
                        messages.success(request, f"Broadcast '{stream.yt_id}' zu Playlist hinzugefügt!")
                # Round 2: Update all streams with updated timetables
                for stream in group.streams.all():
                    api.update_broadcast_from_obj(stream)
                    messages.success(request, f"Broadcast '{stream.yt_id}' aktualisiert!")
            except Exception as e:
                messages.error(request, str(e))
            return redirect(reverse('admin:tamtour_startlistmanager_ytstreamgroup_change', args=(group.pk,)))
        except YTStreamGroup.DoesNotExist:
            return Http404()


class YTStreamAdminStartTimeLogInline(admin.TabularInline):
    model = YTStreamStartTimeLog
    extra = 0
    fields = ['timestamp', 'content']


@admin.register(YTStream)
class YTStreamAdmin(admin.ModelAdmin):
    inlines = [YTStreamAdminStartTimeLogInline]
    list_display = ['yt_title', 'yt_id', 'scheduled_start_time', 'scheduled_end_time']
    search_fields = ['yt_title', 'yt_id']

    fieldsets = [
        (None, {"fields": ["group"]}),
        ("Info", {"fields": ["yt_title", "description_head", "description_foot"]}),
        ("Zeitplan", {"fields": ["show_in_timetable", "name_in_timetable"]}),
        ("Geplante Zeiten", {"fields": ["scheduled_start_time", "scheduled_end_time"]}),
        ("YT Daten", {"fields": ["yt_id", "actual_start_time"]}),
        ("Berechnet", {"fields": ["get_stream_description"]})
    ]
    readonly_fields = ['get_stream_description']

    def get_urls(self):
        info = self.model._meta.app_label, self.model._meta.model_name

        urls = super().get_urls()

        my_urls = [
            path('<path:object_id>/push-api/', self.admin_site.admin_view(self.push_to_api),
                 name='%s_%s_push_api' % info),
        ]
        return my_urls + urls

    def push_to_api(self, request, object_id):
        try:
            stream = YTStream.objects.select_related('group', 'group__account').get(pk=object_id)
            api = YouTubeAPI(stream.group.account)
            try:
                if stream.yt_id:
                    api.update_broadcast_from_obj(stream)
                    messages.success(request, "Broadcast aktualisiert!")
                else:
                    api.create_broadcast_from_obj(stream)
                    messages.success(request, "Broadcast erstellt!")
                    if stream.group.yt_playlist_id:
                        api.add_broadcast_to_playlist(stream, stream.group.yt_playlist_id)
                        messages.success(request, f"Broadcast zu Playlist hinzugefügt!")
            except Exception as e:
                messages.error(request, str(e))
            return redirect(reverse('admin:tamtour_startlistmanager_ytstream_change', args=(stream.pk,)))
        except YTStream.DoesNotExist:
            return Http404()
