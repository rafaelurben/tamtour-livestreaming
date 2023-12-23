from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages
from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from django.urls import reverse_lazy, reverse
from django.views.decorators.http import require_GET

from .models import Startliste

# Create your views here.

@require_GET
def startlists_json(request):
    return JsonResponse({
        "lists": list(map(
            lambda startliste: startliste.as_dict(),
            Startliste.objects.filter(visible=True)
        ))
    }, headers={
        "Access-Control-Allow-Origin": "*",
    })

@login_required(login_url=reverse_lazy("admin:login"))
@permission_required(["tamtour_startlistmanager.add_startliste", "tamtour_startlistmanager.view_startliste"], raise_exception=True)
def startliste_duplizieren(request, object_id):
    if not request.method == "POST":
        messages.warning(request, "Bitte fülle folgendes Formular aus und klicke auf 'DUPLIZIEREN'!")
        return redirect(reverse("admin:tamtour_startlistmanager_startliste_change", args=[object_id])+"?showduplicateform=1")

    try:
        addminutes = int(request.POST.get("addminutes", 0))
    except ValueError:
        addminutes = 0
    removecompositions = bool(request.POST.get("removecompositions", False))

    try:
        old = Startliste.objects.get(pk=object_id)
        new = old.duplicate(addminutes=addminutes,
                            removecompositions=removecompositions)

        messages.success(request, f"Startliste {old.titel} wurde erfolgreich dupliziert. Dies ist die neue Startliste.")
        return redirect(reverse("admin:tamtour_startlistmanager_startliste_change", args=[new.pk]))
    except Startliste.DoesNotExist:
        return Http404()

@login_required(login_url=reverse_lazy("admin:login"))
@permission_required(["tamtour_startlistmanager.view_startliste"], raise_exception=True)
def startliste_drucken(request, object_id):
    try:
        startliste = Startliste.objects.prefetch_related("items__komposition", "items__wettspieler", "items__kategorie").get(pk=object_id)

        return render(request, "tamtour_startlistmanager/print.html", {
            "startliste": startliste,
        })
    except Startliste.DoesNotExist:
        return Http404()
