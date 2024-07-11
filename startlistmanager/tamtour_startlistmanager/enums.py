from django.db import models


class Kompositionstyp(models.TextChoices):
    TAMBOUR = "T", "Tambour"
    PFEIFER = "P", "Pfeifer"
    SOLO_DUO = "SD", "Solo Duo (Piccolo / Tambour)"
