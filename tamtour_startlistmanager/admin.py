from django.contrib import admin
from django.db import models
from django import forms

from .models import WettspielKategorie, Wettspieler, Komposition, Startliste, StartlistenEintrag

# Register your models here.

@admin.register(WettspielKategorie)
class WettspielKategorieAdmin(admin.ModelAdmin):
    list_display = ("titel", "kurzform")
    search_fields = ("titel", "kurzform")

@admin.register(Wettspieler)
class WettspielerAdmin(admin.ModelAdmin):
    list_display = ("name", "verein", "is_group", "gruppenname")
    list_filter = ("is_group", "verein")
    search_fields = ("name", "verein", "gruppenname")

    fieldsets = [
        (None, {"fields": ["name", "verein"]}),
        ("Gruppe", {"fields": ["is_group", "gruppenname"]})
    ]

@admin.register(Komposition)
class KompositionenAdmin(admin.ModelAdmin):
    list_display = ("titel", "komponist")
    search_fields = ("titel", "komponist")

class StartlistenAdminStartlistenEintragInline(admin.TabularInline):
    model = StartlistenEintrag
    extra = 0

    fields = ("zeit", "kategorie", "startnummer", "wettspieler", "komposition")
    autocomplete_fields = ("kategorie", "wettspieler", "komposition")

    formfield_overrides = {
        models.TimeField: {"widget": forms.TimeInput(format='%H:%M')},
    }

    # Custom queryst

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('kategorie', 'wettspieler', 'komposition')

    class Media:
        css = { "all" : ("css/hide_admin_original.css",) }

@admin.register(Startliste)
class StartlistenAdmin(admin.ModelAdmin):
    list_display = ("titel", "beschreibung", "datum")

    inlines = (StartlistenAdminStartlistenEintragInline,)