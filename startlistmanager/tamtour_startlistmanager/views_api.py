from django.http import JsonResponse
from django.views.decorators.http import require_GET

from startlistmanager.tamtour_startlistmanager.models import Startliste


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
