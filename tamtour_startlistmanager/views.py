from django.http import JsonResponse

from .models import Startliste

# Create your views here.

def startlists_json(request):
    return JsonResponse({
        "lists": list(map(
            lambda startliste: startliste.as_dict(),
            Startliste.objects.get_current()
        ))
    })
