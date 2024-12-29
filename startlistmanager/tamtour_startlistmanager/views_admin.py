from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.http import Http404
from django.shortcuts import render, redirect
from django.urls import reverse

from .models import Startliste, YTAccount, YTStreamGroup, YTStream
from .youtube import YouTubeOAuth, YouTubeAPI


# Admin views

@permission_required(["tamtour_startlistmanager.change_ytaccount"], raise_exception=True)
def ytaccount_oauth_start(request, object_id):
    try:
        account = YTAccount.objects.get(pk=object_id)
        return YouTubeOAuth.redirect_to_authorization_url(request, account)
    except YTAccount.DoesNotExist:
        return Http404()


@permission_required(["tamtour_startlistmanager.change_ytaccount"], raise_exception=True)
def ytaccount_oauth_callback(request):
    if 'error' in request.GET:
        messages.error(request, "Authentifizierung fehlgeschlagen: " + request.GET['error'])
    elif 'code' in request.GET:
        account = YouTubeOAuth.handle_callback(request)
        messages.success(request, "Authentifizierung erfolgreich!")
        return redirect(reverse('admin:tamtour_startlistmanager_ytaccount_change', args=(account.pk,)))
    return redirect(reverse('admin:tamtour_startlistmanager_ytaccount_changelist'))


@permission_required(["tamtour_startlistmanager.change_ytstreamgroup"], raise_exception=True)
def ytstreamgroup_push_to_api(request, object_id):
    try:
        group = YTStreamGroup.objects.select_related('account').get(pk=object_id)
        api = YouTubeAPI(group.account)
        try:
            # Round 1: Create streams that do not exist yet
            for stream in group.streams.filter(yt_id=""):
                api.create_broadcast_from_obj(stream)
                messages.success(request, f"Broadcast '{stream.yt_id}' erstellt!")
                if group.yt_playlist_id:
                    api.add_broadcast_to_playlist(stream, group.yt_playlist_id)
                    messages.success(request, f"Broadcast '{stream.yt_id}' zu Playlist hinzugefügt!")
            # Round 2: Update all streams with updated timetables
            for stream in group.streams.all():
                api.update_broadcast_from_obj(stream)
                messages.success(request, f"Broadcast '{stream.yt_id}' aktualisiert!")
        except Exception as e:
            messages.error(request, str(e))
        return redirect(reverse('admin:tamtour_startlistmanager_ytstreamgroup_change', args=(group.pk,)))
    except YTStreamGroup.DoesNotExist:
        return Http404()


@permission_required(["tamtour_startlistmanager.change_ytstream"], raise_exception=True)
def ytstream_push_to_api(request, object_id):
    try:
        stream = YTStream.objects.select_related('group', 'group__account').get(pk=object_id)
        api = YouTubeAPI(stream.group.account)
        try:
            if stream.yt_id:
                api.update_broadcast_from_obj(stream)
                messages.success(request, "Broadcast aktualisiert!")
            else:
                api.create_broadcast_from_obj(stream)
                messages.success(request, "Broadcast erstellt!")
                if stream.group.yt_playlist_id:
                    api.add_broadcast_to_playlist(stream, stream.group.yt_playlist_id)
                    messages.success(request, f"Broadcast zu Playlist hinzugefügt!")
        except Exception as e:
            messages.error(request, str(e))
        return redirect(reverse('admin:tamtour_startlistmanager_ytstream_change', args=(stream.pk,)))
    except YTStream.DoesNotExist:
        return Http404()


@permission_required(["tamtour_startlistmanager.add_startliste", "tamtour_startlistmanager.view_startliste"],
                     raise_exception=True)
def startliste_duplizieren(request, object_id):
    if not request.method == "POST":
        messages.warning(request, "Bitte fülle folgendes Formular aus und klicke auf 'DUPLIZIEREN'!")
        return redirect(
            reverse("admin:tamtour_startlistmanager_startliste_change", args=[object_id]) + "?showduplicateform=1")

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


@permission_required(["tamtour_startlistmanager.view_startliste"], raise_exception=True)
def startliste_drucken(request, object_id):
    try:
        startliste = Startliste.objects.prefetch_related("items__komposition", "items__wettspieler",
                                                         "items__kategorie").get(pk=object_id)

        return render(request, "tamtour_startlistmanager/print.html", {
            "startliste": startliste,
        })
    except Startliste.DoesNotExist:
        return Http404()
