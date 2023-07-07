from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Startliste

# Create your views here.

@require_GET
def startlists_json(request):
    return JsonResponse({
        "lists": list(map(
            lambda startliste: startliste.as_dict(),
            Startliste.objects.get_current()
        ))
    }, headers={
        "Access-Control-Allow-Origin": "*",
    })
