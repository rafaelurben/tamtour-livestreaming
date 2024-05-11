"""
Import compositions from a table

Note: This script is interactive!
"""

from django.apps import apps
from django.db import IntegrityError

from tamtour_startlistmanager.management.commands._base import CustomCommandBase


class Command(CustomCommandBase):
    help = "Import compositions from tables"

    def add_arguments(self, parser):
        parser.add_argument("type", type=str, choices=("T", "P", "SD"),
                            help="Composition type")

    def handle(self, *args, **options):
        """Run the command"""

        Komposition = apps.get_model("tamtour_startlistmanager", "Komposition")

        self._print("\n===== TamTour Composition Importer =====\n\n")
        self._print("[Example row] \t[0] Herr Irgendöppis, dr\t[1] Häfeli Alex\n\n")

        kompositionen = self._input_table(2)

        for titel_original, komponist in kompositionen:
            if "," in titel_original:
                _name, _prefix = titel_original.split(",")
                _prefix = _prefix.strip()
                titel = f"{_prefix} {_name}"
            else:
                titel = titel_original

            try:
                elem, created = Komposition.objects.get_or_create(
                    typ=options["type"],
                    klakomtitel=titel_original,
                    titel=titel,
                    komponist=komponist
                )
                if created:
                    self.stdout.write(self.style.SUCCESS("[CREATED]: " + str(elem)))
                else:
                    self.stdout.write(self.style.WARNING("[SKIPPED]: " + str(elem)))
            except IntegrityError:
                self.stdout.write(self.style.ERROR("[ERROR]: Already exists with same type & name: " + titel_original))
