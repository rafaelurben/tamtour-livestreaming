from django.core.management.base import BaseCommand, CommandError


class CustomCommandBase(BaseCommand):
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
