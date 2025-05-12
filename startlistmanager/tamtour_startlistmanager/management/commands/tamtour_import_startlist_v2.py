"""
Import TamTour startlist from a table

Note: This script is interactive!
"""

from datetime import date

from django.core.management.base import CommandError
from tamtour_startlistmanager.management.commands._base import CustomCommandBase
from tamtour_startlistmanager.models import Startliste, StartlistenEintrag, Komposition, Wettspieler, WettspielKategorie

category_cache = {}
composition_cache = {}


class Command(CustomCommandBase):
    help = "Import a TamTour startlist from a table (interactive) - v2 (uses new single table format)"

    def add_arguments(self, parser):
        parser.add_argument("-g", "--group-mode", dest="group_mode", action="store_true",
                            help="Group mode? If enabled, the table must include participants in an additional column!")

    def _get_category(self, category_short):
        if category_short not in category_cache:
            try:
                category_cache[category_short] = WettspielKategorie.objects.get(kurzform=category_short)
            except WettspielKategorie.DoesNotExist:
                raise CommandError(f"[Error] Category not found: {category_short}")
        return category_cache[category_short]

    def _get_composition(self, composition_type, composition_name):
        if composition_type not in composition_cache:
            composition_cache[composition_type] = {}
        if composition_name not in composition_cache[composition_type]:
            try:
                composition_cache[composition_type][composition_name] = Komposition.objects.get(
                    typ=composition_type,
                    klakomtitel=composition_name
                )
            except Komposition.DoesNotExist:
                self._error(f"Composition not found: {composition_name} (type: {composition_type})")
                correct_name = input("Enter correct name: ")
                correct_comp = self._get_composition(composition_type, correct_name)
                composition_cache[composition_type][composition_name] = correct_comp
        return composition_cache[composition_type][composition_name]

    def handle(self, *args, **options):
        """Run the command"""

        self._print("\n===== TamTour Startlist Importer (V2) =====\n\n")

        # Options

        group_mode = options["group_mode"]
        self._success(f"[Options] Group mode: {'enabled' if group_mode else 'disabled'}")

        # Step 1: Import instructions

        self._print("\n[Step 1] Import names and start times\n\n")
        self._print("[How to] Clean the table in excel and paste it here\n\n")
        _example_row = "[Example row] \t[0] MT\t[1] 2\t[2] HMM\t[3] Verein"
        _example_row += "\t[4] " + ("Gruppenname" if group_mode else "NAME Vorname")
        _example_row += "\t[5] Komposition"
        if group_mode:
            _example_row += f"\t[6] P:NAME Vorname, T:NAME Vorname"
        self._print(_example_row + "\n\n")

        # Step 1: Input table

        rawdata = self._input_table(7 if group_mode else 6)

        self._print("\n[Step 1] Completed.")

        # Step 2: Parse data

        self._print("\n[Step 2] Now parsing data...")

        parsed_entries = []

        for rowindex, row in enumerate(rawdata):
            category = self._get_category(row[0].strip())
            start_num = int(row[1].strip())
            start_time_raw = row[2].strip()
            club = row[3].strip()
            name = row[4].strip()
            composition_name_raw = row[5].strip()
            group_members = row[6].strip() if group_mode else ""

            start_time = f"{start_time_raw[:-2].zfill(2)}:{start_time_raw[-2:]}"

            person_or_group = None
            if name:
                person_or_group, created = Wettspieler.objects.get_or_create(name=name, verein=club,
                                                                             is_group=group_mode,
                                                                             group_members=group_members)
                if created:
                    self._success("[Person/Group created]: " + str(person_or_group))

            composition = None
            if composition_name_raw:
                composition_type = category.default_composition_type
                composition = self._get_composition(composition_type, composition_name_raw)

            parsed_entries.append(StartlistenEintrag(
                kategorie=category,
                startnummer=start_num,
                wettspieler=person_or_group,
                zeit=start_time,
                komposition=composition,
            ))

        self._print("\n[Step 2] Completed.")

        # Step 2: Create the actual start lists

        self._print("\n[Step 3] Save the imported start lists")

        startlist = Startliste.objects.create(
            titel=input("=> Title: "),
            beschreibung=input("=> Description: "),
            datum=date.today(),
            visible=False
        )
        for entry in parsed_entries:
            entry.startliste = startlist
        startlist.items.bulk_create(parsed_entries)

        self._success(f"Startlist created!\n")

        self._success("\nDone! Visit /admin/tamtour_startlistmanager/startliste/")
