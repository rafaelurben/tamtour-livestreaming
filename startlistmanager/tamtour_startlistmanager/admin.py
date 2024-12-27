from django.contrib import admin
from django.contrib.admin import display
from django.db import models
from django.urls import path, reverse
from django import forms
from django.utils.html import format_html

from .models import WettspielKategorie, Wettspieler, Komposition, Startliste, StartlistenEintrag, ApiKey, YTAccount, \
    YTStreamGroup, YTStream, YTStreamStartTimeLog
from .views import startliste_duplizieren, startliste_drucken


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
    list_display = ['name', 'yt_account_id']
    fieldsets = [
        (None, {"fields": ["name", "yt_account_id"]}),
        ("Credentials", {"fields": ["credentials"], "classes": ["collapse"]})
    ]


class YTStreamGroupAdminStreamInline(admin.StackedInline):
    model = YTStream
    extra = 0
    fields = [('name_in_timetable', 'show_in_timetable'), ('yt_title', 'yt_id'), ('description_head', 'description_foot'),
              ('scheduled_start_time', 'scheduled_end_time')]
    show_change_link = True


@admin.register(YTStreamGroup)
class YTStreamGroupAdmin(admin.ModelAdmin):
    inlines = [YTStreamGroupAdminStreamInline]


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
