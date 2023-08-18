# Generated by Django 4.2.3 on 2023-08-18 22:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Komposition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('klakomtitel', models.CharField(max_length=50, unique=True)),
                ('titel', models.CharField(max_length=50)),
                ('komponist', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Komposition',
                'verbose_name_plural': 'Kompositionen',
                'ordering': ('titel', 'komponist'),
            },
        ),
        migrations.CreateModel(
            name='Startliste',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titel', models.CharField(max_length=50)),
                ('beschreibung', models.TextField(blank=True, default='')),
                ('datum', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Startliste',
                'verbose_name_plural': 'Startlisten',
                'ordering': ('-datum', 'titel'),
            },
        ),
        migrations.CreateModel(
            name='Wettspieler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Name(n)')),
                ('verein', models.CharField(max_length=50, verbose_name='Verein')),
                ('is_soloduo', models.BooleanField(default=False, verbose_name='SoloDuo?')),
                ('soloduoname', models.CharField(blank=True, default='', max_length=50, verbose_name='SoloDuo Gruppenname')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Wettspieler / Gruppe',
                'verbose_name_plural': 'Wettspieler / Gruppen',
                'ordering': ('name', 'verein'),
            },
        ),
        migrations.CreateModel(
            name='WettspielKategorie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titel', models.CharField(max_length=50)),
                ('kurzform', models.CharField(max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Wettspiel-Kategorie',
                'verbose_name_plural': 'Wettspiel-Kategorien',
                'ordering': ('titel',),
            },
        ),
        migrations.CreateModel(
            name='StartlistenEintrag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startnummer', models.IntegerField()),
                ('zeit', models.TimeField()),
                ('kategorie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tamtour_startlistmanager.wettspielkategorie')),
                ('komposition', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='tamtour_startlistmanager.komposition')),
                ('startliste', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='tamtour_startlistmanager.startliste', verbose_name='Startliste')),
                ('wettspieler', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='tamtour_startlistmanager.wettspieler', verbose_name='Wettspieler / Gruppe')),
            ],
            options={
                'verbose_name': 'Startlisten-Eintrag',
                'verbose_name_plural': 'Startlisten-Einträge',
                'ordering': ('zeit',),
            },
        ),
    ]
