"""
Import TamTour startlist from a table

Note: This script is interactive!
"""

import re
from datetime import date

from django.core.management.base import BaseCommand, CommandError

from tamtour_startlistmanager.models import Startliste, StartlistenEintrag, Komposition, Wettspieler, WettspielKategorie

category_cache = {}
composition_cache = {}


class Command(BaseCommand):
    help = "Import a TamTour startlist from tables (interactive)"

    def add_arguments(self, parser):
        parser.add_argument("multi_count", type=int, choices=(1, 2, 3),
                            help="Number of start times / compositions in the table(s)")
        parser.add_argument("-g", "--group-mode", dest="group_mode", action="store_true",
                            help="Group mode? If enabled, the table must include participants in an additional column!")
        parser.add_argument("-c", "--default-category", dest="default_category_short",
                            type=str, default=None,
                            help="Default category short name", metavar="CAT_SHORT")
        parser.add_argument("-o", "--composition-offset", dest="composition_offset",
                            type=int, default=0, choices=(0, 1, 2),
                            help="Composition offset in composition import", metavar="COMPOSITION_OFFSET")

    def _print(self, msg, ending="\n"):
        self.stdout.write(msg, ending=ending)

    def _success(self, msg, ending="\n"):
        self.stdout.write(self.style.SUCCESS(msg), ending=ending)  # pylint: disable=no-member

    def _error(self, msg, ending="\n"):
        self.stderr.write(self.style.ERROR(msg), ending=ending)  # pylint: disable=no-member

    def _input_table(self, colcount):
        self._print("[Table] Paste a table with %d columns" % colcount)
        index = 0
        rows = []
        while True:
            row = input(f"[Row {index}] \t")
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
        if category_short not in category_cache:
            try:
                category_cache[category_short] = WettspielKategorie.objects.get(kurzform=category_short)
            except WettspielKategorie.DoesNotExist:
                self._error(f"[Error] Category not found: {category_short}")
                category_cache[category_short] = None
        return category_cache[category_short]

    def _get_composition(self, composition_name):
        if composition_name not in composition_cache:
            try:
                composition_cache[composition_name] = Komposition.objects.get(klakomtitel=composition_name)
            except Komposition.DoesNotExist:
                self._error(f"Composition not found: {composition_name}")
                correct_name = input("Enter correct name: ")
                correct_comp = self._get_composition(correct_name)
                composition_cache[composition_name] = correct_comp
        return composition_cache[composition_name]

    def _parse_start_cat(self, text, default_category=None):
        """Parses start number and category from text"""

        start_num = 0
        category = None

        try:
            start_num = int(re.findall(r"\d+", text)[0])
        except IndexError:
            self._error(f"Not able to extract start number: {text}")

        if default_category is not None:
            return start_num, default_category

        try:
            cat_name = re.findall(r"[a-zA-Z]+", text)[0]
            category = self._get_category(cat_name)
        except IndexError:
            self._error(f"Not able to extract category: {text}")

        return start_num, category

    def handle(self, *args, **options):
        """Run the command"""

        self._print("\n===== TamTour Startlist Importer =====\n\n")

        # Options

        default_category = None
        if options["default_category_short"] is not None:
            default_category = self._get_category(options["default_category_short"].strip())
            if default_category:
                self._success(f"[Options] Default category set: {default_category}")
            else:
                raise CommandError(f"Default category not found: {options['default_category_short']} Does it exist?")
        else:
            self._success("[Options] Default category NOT set. Expecting table to contain category short names.")

        multi_count = options["multi_count"]
        self._success(f"[Options] Multi count: Expecting {multi_count} start times per row.")

        group_mode = options["group_mode"]
        self._success(f"[Options] Group mode: {'enabled' if group_mode else 'disabled'}")

        composition_offset = options["composition_offset"]

        # Step 1: Import instructions

        self._print("\n[Step 1] Import names and start times\n\n")
        self._print("[How to] Open Excel -> Data -> Get Data -> From File -> From PDF -> [select] -> Load")
        self._print("[How to] Clean the table, remove empty columns, copy it and paste it here\n\n")
        _example_row = "[Example row] \t[0] " + ("32" if default_category else "MT32")
        _example_row += "\t[1] " + ("Gruppenname" if group_mode else "NAME Vorname")
        _example_row += "\t[2] Verein"
        for i in range(multi_count):
            _example_row += f"\t[{3 + i}] HHMM"
        if group_mode:
            _example_row += f"\t[{3 + multi_count}] P:NAME Vorname, T:NAME Vorname"
        self._print(_example_row + "\n\n")

        # Step 1: Input

        rawdata = self._input_table(4 + multi_count if group_mode else 3 + multi_count)

        parsed_data = []
        for mc in range(multi_count):
            parsed_data.append([])
        name_row_index = {}  # { name: row number }

        for rowindex, row in enumerate(rawdata):
            start_num, category = self._parse_start_cat(row[0], default_category=default_category)
            name = row[1]
            club = row[2] or " "
            members = row[3 + multi_count] if group_mode else ""

            person = None
            if name:
                person, created = Wettspieler.objects.get_or_create(name=name, verein=club, is_group=group_mode,
                                                                    group_members=members)
                if created:
                    self._success("[Person created]: " + str(person))

            for mc in range(multi_count):
                start_time_raw = row[3 + mc]
                start_time = f"{start_time_raw[:-2].zfill(2)}:{start_time_raw[-2:]}"

                parsed_data[mc].append(StartlistenEintrag(
                    kategorie=category,
                    startnummer=start_num,
                    wettspieler=person,
                    zeit=start_time,
                ))
                name_row_index[name] = rowindex

        # Step 2: Add compositions data

        add_compositions = input("\n[Step 2] Add compositions? (y/n): ")
        if add_compositions == "y":
            self._print("\n")
            self._print("[How to] The compositions should be in a single column, separated by a slash (/)")
            self._print("[How to] The compositions will be mapped to the start times in their respective order\n\n")
            self._print("[Example row] [0]?? \t[1] Rafael Urben\t[2] ??\t[3] Obelix/Skywalker/Inspiration\n\n")

            self._print("[Options] Composition offset is set to %d" % composition_offset)
            self._print(
                "Expecting at least %d slash-separated compositions per row!\n\n" % (composition_offset + multi_count)
            )

            for _, name, _, compositions in self._input_table(4):
                name = name.strip()

                if name not in name_row_index:
                    self._error("Name not found: %s" % name)
                    continue
                rowindex = name_row_index[name]

                compositions = compositions.split("/")

                for mc in range(multi_count):
                    composition = compositions[composition_offset + mc].strip()
                    composition = self._get_composition(composition)
                    parsed_data[mc][rowindex].komposition = composition

        # Step 3: Create the actual start lists

        self._print("\n[Step 3] Save the imported start lists")

        for mc in range(multi_count):
            self._print(f"\nStartlist {mc + 1} of {multi_count}:")

            startlist = Startliste.objects.create(
                titel=input("=> Title: "),
                beschreibung=input("=> Description: "),
                datum=date.today(),
                visible=False
            )
            for entry in parsed_data[mc]:
                entry.startliste = startlist
            startlist.items.bulk_create(parsed_data[mc])

            self._success(f"Startlist {mc + 1} created!\n")

        self._success("\nDone! Visit /admin/tamtour_startlistmanager/startliste/")
