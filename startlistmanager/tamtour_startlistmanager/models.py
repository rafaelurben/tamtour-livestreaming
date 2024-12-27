from datetime import time

from django.db import models
from .enums import Kompositionstyp

import uuid


# Create your models here.


class WettspielKategorie(models.Model):
    titel = models.CharField(max_length=50)
    kurzform = models.CharField(max_length=10)

    default_composition_type = models.CharField(choices=Kompositionstyp, default=Kompositionstyp.TAMBOUR, max_length=5,
                                                verbose_name="Kompositionstyp")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    def __str__(self):
        return f"{self.titel} ({self.kurzform})"

    class Meta:
        verbose_name = "Wettspiel-Kategorie"
        verbose_name_plural = "Wettspiel-Kategorien"
        ordering = ("titel",)


class Wettspieler(models.Model):
    name = models.CharField(max_length=50, verbose_name="(Gruppen-)Name")
    verein = models.CharField(max_length=50, verbose_name="Verein")

    is_group = models.BooleanField(default=False, verbose_name="Gruppe?")
    group_members = models.CharField(
        max_length=200, blank=True, default="", verbose_name="Gruppenmitglieder"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    def __str__(self):
        if self.is_group:
            return f"{self.name} ({self.verein}) - {self.group_members}"
        return f"{self.name} ({self.verein})"

    class Meta:
        verbose_name = "Wettspieler / Gruppe"
        verbose_name_plural = "Wettspieler / Gruppen"
        ordering = ("name", "verein")


class Komposition(models.Model):
    typ = models.CharField(choices=Kompositionstyp, default=Kompositionstyp.TAMBOUR, max_length=5)

    klakomtitel = models.CharField(max_length=50)

    titel = models.CharField(max_length=50)
    komponist = models.CharField(max_length=75)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    def __str__(self):
        return f"[{self.typ}] {self.titel} ({self.komponist})"

    class Meta:
        verbose_name = "Komposition"
        verbose_name_plural = "Kompositionen"
        ordering = ("titel", "komponist")

        unique_together = [("typ", "klakomtitel")]


class Startliste(models.Model):
    titel = models.CharField(max_length=50)
    beschreibung = models.TextField(default="", blank=True, help_text="Wird auf Startliste gedruckt")
    datum = models.DateField()

    overlay_title = models.CharField(max_length=30, default="", blank=True, verbose_name=
    "Overlay-Titel", help_text="In Startlisten-Overlay verwendet")

    visible = models.BooleanField(
        default=True,
        verbose_name="In Schnittstelle sichtbar?",
        help_text="Soll diese Startliste in der JSON-Schnittstelle verfügbar und "
                  "somit im Overlay-Control-Panel sichtbar sein? "
                  "(Die JSON-Schnittstelle ist ohne Authentifizierung zugänglich!)",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    def __str__(self):
        return f"{self.titel} ({self.datum})"

    def duplicate(self, addminutes=0, removecompositions=False):
        new = Startliste.objects.create(
            titel=f"{self.titel} (Kopie)",
            beschreibung=self.beschreibung,
            datum=self.datum,
        )

        for item in self.items.all():
            item.copyto(
                new, addminutes=addminutes, removecomposition=removecompositions
            )

        return new

    def as_dict(self):
        # pylint: disable=no-member
        return {
            "name": self.titel,
            "description": self.beschreibung,
            "overlay_title": self.overlay_title,
            "items": list(
                map(
                    lambda item: item.as_dict(),
                    self.items.all()
                    .order_by("zeit")
                    .select_related("kategorie", "wettspieler", "komposition"),
                )
            ),
        }

    class Meta:
        verbose_name = "Startliste"
        verbose_name_plural = "Startlisten"
        ordering = ("-datum", "titel")


class StartlistenEintrag(models.Model):
    startliste = models.ForeignKey(
        Startliste,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Startliste",
    )
    kategorie = models.ForeignKey(WettspielKategorie, on_delete=models.CASCADE)
    startnummer = models.IntegerField()
    wettspieler = models.ForeignKey(
        Wettspieler,
        blank=True,
        null=True,
        default=None,
        on_delete=models.CASCADE,
        verbose_name="Wettspieler / Gruppe",
    )
    komposition = models.ForeignKey(
        Komposition, blank=True, null=True, default=None, on_delete=models.CASCADE
    )
    zeit = models.TimeField()

    objects = models.Manager()

    def __str__(self):
        return f"Eintrag #{self.pk}"

    def as_dict(self):
        # pylint: disable=no-member
        return {
            "category": self.kategorie.titel,
            "category_short": self.kategorie.kurzform,
            "start_num": self.startnummer,
            "is_group": self.wettspieler.is_group
            if self.wettspieler else False,
            "group_members": self.wettspieler.group_members
            if self.wettspieler and self.wettspieler.is_group else "",
            "name": self.wettspieler.name
            if self.wettspieler else "",
            "club": self.wettspieler.verein
            if self.wettspieler else "",
            "presentation": f"{self.komposition.titel} - {self.komposition.komponist}"
            if self.komposition else "",
            "time": self.zeit.strftime("%H:%M"),
        }

    def copyto(self, new, addminutes=0, removecomposition=False):
        oldtime = self.zeit
        newtime = time(
            minute=(oldtime.minute + addminutes) % 60,
            hour=(oldtime.hour + ((oldtime.minute + addminutes) // 60)) % 24,
        )

        new.items.create(
            kategorie=self.kategorie,
            startnummer=self.startnummer,
            wettspieler=self.wettspieler,
            komposition=self.komposition if not removecomposition else None,
            zeit=newtime,
        )

    class Meta:
        verbose_name = "Startlisten-Eintrag"
        verbose_name_plural = "Startlisten-Einträge"
        ordering = ("zeit",)


# API models

class ApiKey(models.Model):
    name = models.CharField(max_length=50)
    valid_until = models.DateTimeField()
    key = models.UUIDField(default=uuid.uuid4, unique=True)

    objects = models.Manager()

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = 'API-Key'
        verbose_name_plural = 'API-Keys'


# YT API integration models

PLACEHOLDER_SUPPORTED_TEXT = "Unterstützt Platzhalter '{{ TIMETABLE }}' und '{{ STARTLOG }}'"


class YTAccount(models.Model):
    name = models.CharField(max_length=50)
    yt_account_id = models.CharField(max_length=12, blank=True, default="")

    credentials = models.JSONField(default=dict, blank=True)

    objects = models.Manager()

    def __str__(self):
        return f'{self.name} ({self.yt_account_id})'

    class Meta:
        verbose_name = 'YT Account'
        verbose_name_plural = 'YT Accounts'


class YTStreamGroup(models.Model):
    account = models.ForeignKey(YTAccount, on_delete=models.SET_NULL, null=True, related_name="stream_groups")

    name = models.CharField(max_length=50)
    stream_description_preset = models.TextField(blank=True, default="",
                                                 help_text=PLACEHOLDER_SUPPORTED_TEXT)
    yt_playlist_id = models.CharField(max_length=12, blank=True, default="")

    objects = models.Manager()

    def __str__(self):
        return str(self.name)

    def get_timetable(self, current_stream_pk=None):
        """Get the part of the description that contains a list of all streams in this group. This method assumes that
        all streams happen on the same day."""

        lines = []

        for stream in self.streams.filter(group=self, show_in_timetable=True):
            _time = stream.scheduled_start_time.strftime("%H%M")
            if stream.pk == current_stream_pk:
                lines.append(f'- {_time} Uhr: *{stream.name_in_timetable}* ⬅️')
            else:
                line = f'- {_time} Uhr: {stream.name_in_timetable}'
                if stream.yt_id:
                    line += f' (https://youtube.com/watch?v={stream.yt_id})'
                lines.append(line)

        return "\n".join(lines)

    class Meta:
        verbose_name = 'YT Streamgruppe'
        verbose_name_plural = 'YT Streamgruppen'


class YTStream(models.Model):
    group = models.ForeignKey(YTStreamGroup, on_delete=models.CASCADE, related_name='streams')

    yt_title = models.CharField(max_length=80)
    yt_id = models.CharField(max_length=12, blank=True, default="")
    description_head = models.TextField(blank=True, default="",
                                        help_text=PLACEHOLDER_SUPPORTED_TEXT)
    description_foot = models.TextField(blank=True, default="",
                                        help_text=PLACEHOLDER_SUPPORTED_TEXT)
    show_in_timetable = models.BooleanField(default=True)
    name_in_timetable = models.CharField(max_length=30, blank=True)

    scheduled_start_time = models.DateTimeField()
    scheduled_end_time = models.DateTimeField()
    actual_start_time = models.DateTimeField(blank=True, null=True)

    objects = models.Manager()

    def __str__(self):
        return f'{self.yt_title} ({self.yt_id})'

    def get_start_log(self):
        """Get the part of the description with clickable timestamps."""

        if not self.actual_start_time:
            return "[Es wurden noch keine Zeiten erfasst.]"

        lines = ['00:00 Streamstart']

        for log_elem in self.start_time_logs.filter(stream=self):
            diff = log_elem.timestamp - self.actual_start_time
            minutes = int(diff.seconds / 60)
            seconds = diff.seconds % 60
            lines.append(f'{minutes:02}:{seconds:02} {log_elem.content}')

        return "\n".join(lines)

    def get_stream_description(self):
        description = ""
        if self.description_head:
            description += self.description_head + "\n\n"
        description += self.group.stream_description_preset
        if self.description_foot:
            description += "\n\n" + self.description_foot

        if '{{ TIMETABLE }}' in description:
            description = description.replace('{{ TIMETABLE }}', self.group.get_timetable(self.pk))
        if '{{ STARTLOG }}' in description:
            description = description.replace('{{ STARTLOG }}', self.get_start_log())

        return description

    def get_api_snippet(self):
        """Get the "snippet" block for API requests."""
        return {
            'title': self.yt_title,
            'description': self.get_stream_description(),
            'scheduledStartTime': self.scheduled_start_time.isoformat(),
            'scheduledEndTime': self.scheduled_end_time.isoformat(),
        }

    class Meta:
        verbose_name = 'YT Stream'
        verbose_name_plural = 'YT Streams'


class YTStreamStartTimeLog(models.Model):
    stream = models.ForeignKey(YTStream, on_delete=models.CASCADE, related_name='start_time_logs')

    timestamp = models.DateTimeField()
    content = models.CharField(max_length=50)

    objects = models.Manager()

    def __str__(self):
        return str(self.content)

    class Meta:
        verbose_name = 'YT Startzeit-Logeintrag'
        verbose_name_plural = 'YT Startzeit-Logeinträge'
