from django.contrib import admin
from django.db import models
from django.urls import path
from django import forms

from .models import WettspielKategorie, Wettspieler, Komposition, Startliste, StartlistenEintrag
from .views import startliste_duplizieren, startliste_drucken


# Register your models here.

@admin.register(WettspielKategorie)
class WettspielKategorieAdmin(admin.ModelAdmin):
    list_display = ("pk", "titel", "kurzform", "default_composition_type")
    list_editable = ("titel", "kurzform", "default_composition_type")
    search_fields = ("titel", "kurzform")
    list_filter = ("default_composition_type", )


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
    list_display = ("pk", "klakomtitel", "titel", "komponist")
    list_editable = ("klakomtitel", "titel", "komponist")
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
    list_display = ("titel", "beschreibung", "datum", "visible")

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
