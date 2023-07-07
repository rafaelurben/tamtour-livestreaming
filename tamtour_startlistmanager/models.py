from django.db import models
from django.utils import timezone

# Create your models here.


class WettspielKategorie(models.Model):
    titel = models.CharField(max_length=50)
    kurzform = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.titel} ({self.kurzform})"

    class Meta:
        verbose_name = "Wettspiel-Kategorie"
        verbose_name_plural = "Wettspiel-Kategorien"
        ordering = ("titel",)

class Wettspieler(models.Model):
    is_group = models.BooleanField(default=False, verbose_name="Gruppe?")
    name = models.CharField(max_length=100, verbose_name="Name(n)")
    gruppenname = models.CharField(max_length=50, blank=True, default="", verbose_name="Gruppenname")
    verein = models.CharField(max_length=50, verbose_name="Verein")

    def __str__(self):
        return f"{self.name} ({self.get_subtitle()})"

    def get_subtitle(self):
        if self.is_group:
            return f'{self.gruppenname} - {self.verein}'
        return self.verein

    class Meta:
        verbose_name = "Wettspieler / Gruppe"
        verbose_name_plural = "Wettspieler / Gruppen"
        ordering = ("name", "verein")

class Komposition(models.Model):
    titel = models.CharField(max_length=50)
    komponist = models.CharField(max_length=50)

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

    objects = StartlistenManager()

    def __str__(self):
        return f"{self.titel} ({self.datum})"

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
    wettspieler = models.ForeignKey(Wettspieler, on_delete=models.CASCADE)
    komposition = models.ForeignKey(Komposition, on_delete=models.CASCADE)
    zeit = models.TimeField()

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
            "vortrag": f"{self.komposition.titel} - {self.komposition.komponist}",
            "zeit": self.zeit.strftime("%H:%M"),
        }

    class Meta:
        verbose_name = "Startlisten-Eintrag"
        verbose_name_plural = "Startlisten-Einträge"
        ordering = ("zeit",)
