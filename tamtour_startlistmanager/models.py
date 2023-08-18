from django.db import models
from django.utils import timezone

from datetime import time

# Create your models here.


class WettspielKategorie(models.Model):
    titel = models.CharField(max_length=50)
    kurzform = models.CharField(max_length=10)

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
    name = models.CharField(max_length=100, verbose_name="Name(n)")
    verein = models.CharField(max_length=50, verbose_name="Verein")

    is_soloduo = models.BooleanField(default=False, verbose_name="SoloDuo?")
    soloduoname = models.CharField(max_length=50, blank=True, default="", verbose_name="SoloDuo Gruppenname")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    def __str__(self):
        return f"{self.name} ({self.get_subtitle()})"

    def get_subtitle(self):
        if self.is_soloduo:
            return f'{self.soloduoname} - {self.verein}'
        return self.verein

    class Meta:
        verbose_name = "Wettspieler / Gruppe"
        verbose_name_plural = "Wettspieler / Gruppen"
        ordering = ("name", "verein")

class Komposition(models.Model):
    klakomtitel = models.CharField(max_length=50, unique=True)

    titel = models.CharField(max_length=50)
    komponist = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    def __str__(self):
        return f"{self.titel} ({self.komponist})"

    class Meta:
        verbose_name = "Komposition"
        verbose_name_plural = "Kompositionen"
        ordering = ("titel", "komponist")

class StartlistenManager(models.Manager):
    def get_current(self):
        return (
            super()
            .get_queryset()
            .filter(datum__gte=timezone.now() - timezone.timedelta(days=7))
        )


class Startliste(models.Model):
    titel = models.CharField(max_length=50)
    beschreibung = models.TextField(default="", blank=True)
    datum = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = StartlistenManager()

    def __str__(self):
        return f"{self.titel} ({self.datum})"

    def duplicate(self, addminutes=0, removecompositions=False):
        new = Startliste.objects.create(
            titel=f"{self.titel} (Kopie)",
            beschreibung=self.beschreibung,
            datum=self.datum,
        )

        for item in self.items.all():
            item.copyto(new, addminutes=addminutes, removecomposition=removecompositions)

        return new

    def as_dict(self):
        # pylint: disable=no-member
        return {
            "name": self.titel,
            "description": self.beschreibung,
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
        Startliste, on_delete=models.CASCADE, related_name="items", verbose_name="Startliste"
    )
    kategorie = models.ForeignKey(WettspielKategorie, on_delete=models.CASCADE)
    startnummer = models.IntegerField()
    wettspieler = models.ForeignKey(Wettspieler, blank=True, null=True, default=None, on_delete=models.CASCADE, verbose_name="Wettspieler / Gruppe")
    komposition = models.ForeignKey(Komposition, blank=True, null=True, default=None, on_delete=models.CASCADE)
    zeit = models.TimeField()

    objects = models.Manager()

    def __str__(self):
        return f"Eintrag #{self.pk}"

    def as_dict(self):
        # pylint: disable=no-member
        return {
            "kategorie": self.kategorie.titel,
            "kategorie_kurz": self.kategorie.kurzform,
            "startnummer": self.startnummer,
            "name": f"{self.wettspieler.name}",
            "verein": self.wettspieler.get_subtitle(),
            "vortrag": f"{self.komposition.titel} - {self.komposition.komponist}" if self.komposition else "",
            "zeit": self.zeit.strftime("%H:%M"),
        }

    def copyto(self, new, addminutes=0, removecomposition=False):
        oldtime = self.zeit
        newtime = time(minute=(oldtime.minute + addminutes) % 60,
                       hour=(oldtime.hour + ((oldtime.minute + addminutes) // 60)) % 24)

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
