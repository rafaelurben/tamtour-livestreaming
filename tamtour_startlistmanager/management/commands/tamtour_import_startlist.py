"""
Import TamTour startlist from a table

Note: This script is interactive!
"""

import re
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from tamtour_startlistmanager.models import Startliste, StartlistenEintrag, Komposition, Wettspieler, WettspielKategorie

categorycache = {}
compositioncache = {}

class Command(BaseCommand):
    help = "Import TamTour startlists from tables."

    def add_arguments(self, parser):
        ...

    def _print(self, msg, ending="\n"):
        self.stdout.write(msg, ending=ending)

    def _success(self, msg, ending="\n"):
        self.stdout.write(self.style.SUCCESS(msg), ending=ending) # pylint: disable=no-member

    def _error(self, msg, ending="\n"):
        self.stderr.write(self.style.ERROR(msg), ending=ending) # pylint: disable=no-member

    def _input_table(self, colcount):
        index = 0
        rows = []
        while True:
            row = input(f"Row {index}: ")
            if row == "":
                self._print("\n")
                break

            data = row.split("\t")
            if len(data) != colcount:
                self._error(f"Row must have exactly {colcount} columns!")
                continue
            rows.append(data)
            index += 1
        return rows

    def _get_category(self, category_short):
        if category_short not in categorycache:
            try:
                categorycache[category_short] = WettspielKategorie.objects.get(kurzform=category_short)
            except WettspielKategorie.DoesNotExist:
                self._error("Category not found: %s" % category_short)
                categorycache[category_short] = None
        return categorycache[category_short]

    def _get_composition(self, composition_name):
        if composition_name not in compositioncache:
            try:
                compositioncache[composition_name] = Komposition.objects.get(klakomtitel=composition_name)
            except Komposition.DoesNotExist:
                self._error("Composition not found: %s" % composition_name)
                compositioncache[composition_name] = None
        return compositioncache[composition_name]

    def _parse_startcat(self, text, default_category=None):
        """Parses start number and category from text"""

        startnum = 0
        category = None

        try:
            startnum = int(re.findall(r"\d+", text)[0])
        except IndexError:
            self._error("Start number not found: %s" % text)
        if default_category is not None:
            category = default_category
        else:
            try:
                catname = re.findall(r"[a-zA-Z]+", text)[0]
                category = self._get_category(catname)
            except IndexError:
                self._error("Category not found: %s" % text)

        return startnum, category

    def handle(self, *args, **options):
        """Run the command"""

        self._print("\n===== TamTour Startlist Importer =====\n\n")

        # Options

        default_category_short = input("Default category short name (leave empty to get from table): ").strip()
        default_category = None
        if default_category_short:
            default_category = self._get_category(default_category_short)
            if default_category:
                self._success(f"Default category set: {default_category}")
        else:
            self._success("No default category set. Expecting table to contain category short names.")

        multicount = input("How many start times in one table? [1 or 2]: ").strip()
        multicount = int(multicount) if multicount.isdigit() else 1
        self._success(f"Expecting {multicount} start times per row. (= {3+multicount} columns)")

        self._print("\n")

        # Input main table

        self._print("Please enter table data:")
        self._print("[How to] Open Excel -> Data -> Get Data -> From File -> From PDF -> [select] -> Load -> [copy table]")
        self._print("[Example] MT1\tName\tVerein" + '\t1230'*multicount + "\n")

        rawdata = self._input_table(3+multicount)

        parseddata = []
        for mc in range(multicount):
            parseddata.append([])
        nameindex = {}

        for rowindex, row in enumerate(rawdata):
            name = row[1]
            club = row[2]

            startnum, category = self._parse_startcat(row[0], default_category=default_category)

            person, created = Wettspieler.objects.get_or_create(name=name, verein=club)
            if created:
                self._success("[CREATED]: " + str(person))

            for mc in range(multicount):
                starttime = row[3+mc]
                starttime = f"{starttime[:-2].zfill(2)}:{starttime[-2:]}"

                parseddata[mc].append(StartlistenEintrag(
                    kategorie=category,
                    startnummer=startnum,
                    wettspieler=person,
                    zeit=starttime,
                ))
                nameindex[name] = rowindex

        # Get composition data

        add_compositions = input("\nAdd compositions? (y/n): ")
        if add_compositions == "y":
            startindex = int(input("Composition start index [0,1,2]: "))
            self._print("Please enter composition data (copied from Excel - Get Data -> From File -> From PDF)")
            self._print("Row example: Rafael Urben\tObelix/Skywalker/Inspiration\n")

            for _, name, _, compositions in self._input_table(4):
                name = name.strip()

                if name not in nameindex:
                    self._error("Name not found: %s" % name)
                    continue
                rowindex = nameindex[name]

                compositions = compositions.split("/")
                
                for mc in range(multicount):
                    composition = compositions[startindex+mc].strip()
                    composition = self._get_composition(composition)
                    parseddata[mc][rowindex].komposition = composition

        # Create startlists

        self._success("\nData ready!\n")

        for mc in range(multicount):
            self._print(f"Startlist {mc+1}:")

            startlist = Startliste.objects.create(
                titel=input("=> Title: "),
                beschreibung=input("=> Description: "),
                datum=date.today()+timedelta(days=14),
            )
            for entry in parseddata[mc]:
                entry.startliste = startlist
            startlist.items.bulk_create(parseddata[mc])

            self._success(f"Startlist {mc+1} created!\n")

        self._success("Done! https://app.rafaelurben.ch/admin/tamtour_startlistmanager/startliste/")
