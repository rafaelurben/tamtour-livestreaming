"""
Import TamTour startlist from a table

Note: This script is interactive!
"""

import re
from datetime import date, timedelta

from django.apps import apps

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = ("Import a TamTour startlist from a table.")

    def add_arguments(self, parser):
        parser.add_argument('--title', help="Startlist title", type=str)
        parser.add_argument('--description', help="Startlist description", type=str)

    def handle(self, *args, **options):
        Startliste = apps.get_model("tamtour_startlistmanager", "Startliste")
        StartlistenEintrag = apps.get_model(
            "tamtour_startlistmanager", "StartlistenEintrag")
        Komposition = apps.get_model("tamtour_startlistmanager", "Komposition")
        Wettspieler = apps.get_model("tamtour_startlistmanager", "Wettspieler")
        WettspielKategorie = apps.get_model("tamtour_startlistmanager", "WettspielKategorie")

        # Input table row by row (until empty row)

        self.stdout.write(self.style.SUCCESS("Please enter table data (copied from Excel after importing PDF via data)"))
        self.stdout.write(self.style.SUCCESS("Row example: MT1 \\t Name \\t Verein \\t 1230\n"))

        rawdata = []
        while True:
            row = input("Row: ")
            if row == "":
                self.stdout.write(self.style.SUCCESS("\n"))
                break

            data = row.split("\t")
            if len(data) != 4:
                self.stdout.write(self.style.ERROR("Row must have 4 columns exactly!"))
                continue
            rawdata.append(data)

        # Parse table data

        categorycache = {}
        parseddata_by_name = {}

        for row in rawdata:
            catname_startnum, name, club, starttime = row

            catname = re.findall(r"[a-zA-Z]+", catname_startnum)[0]
            startnum = int(re.findall(r"\d+", catname_startnum)[0])
            starttime = f"{starttime[:-2].zfill(2)}:{starttime[-2:]}"

            if catname not in categorycache:
                try:
                    categorycache[catname] = WettspielKategorie.objects.get(kurzform=catname)
                except WettspielKategorie.DoesNotExist:
                    self.stdout.write(self.style.ERROR("Category not found: %s" % catname))
                    categorycache[catname] = None

            category = categorycache[catname]
            person, created = Wettspieler.objects.get_or_create(name=name, verein=club)
            if created:
                self.stdout.write(self.style.SUCCESS("[CREATED]: " + str(person)))

            parseddata_by_name[name] = {
                "kategorie": category,
                "startnummer": startnum,
                "wettspieler": person,
                "zeit": starttime,
            }

        # Get composition data

        add_compositions = input("\nAdd compositions? (y/n): ")
        if add_compositions == "y":
            index = int(input("Composition index (0-2): "))
            self.stdout.write(self.style.SUCCESS("Please enter composition data (copied from Excel after importing PDF via data)"))
            self.stdout.write(self.style.SUCCESS("Row example: Name \\t Compositions\n"))

            while True:
                row = input("Row: ")
                if row == "":
                    break

                name, composition = row.split("\t")
                name = name.strip()
                composition = composition.split("/")[index].strip()

                if name not in parseddata_by_name:
                    self.stdout.write(self.style.ERROR("Name not found: %s" % name))
                    continue

                try:
                    comp = Komposition.objects.get(klakomtitel=composition)
                    parseddata_by_name[name]["komposition"] = comp
                except Komposition.DoesNotExist:
                    self.stdout.write(self.style.ERROR("Composition not found: %s" % composition))

        # Create startlist

        input("\nPress enter to create startlist...")

        startlist = Startliste.objects.create(
            titel=options.get("title", None) or input("Startlist title: "),
            beschreibung=options.get("description", None) or input("Startlist description: "),
            datum=date.today()+timedelta(days=14),
        )

        for item in parseddata_by_name.values():
            StartlistenEintrag.objects.create(startliste=startlist, **item)

        self.stdout.write(self.style.SUCCESS("Startlist created!"))
