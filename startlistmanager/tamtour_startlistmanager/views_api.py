import json

from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .decorators import api_view
from .models import Startliste, YTStream, YTStreamStartTimeLog


@require_GET
@api_view()
def get_start_lists(request):
    return JsonResponse({
        "lists": list(map(
            lambda startliste: startliste.as_dict(),
            Startliste.objects.filter(visible=True)
        ))
    }, headers={
        "Access-Control-Allow-Origin": "*",
    })


@require_GET
@api_view()
def get_broadcasts(request):
    return JsonResponse({
        "broadcasts": list(map(
            lambda stream: stream.as_dict(),
            YTStream.objects.filter()
        ))
    }, headers={
        "Access-Control-Allow-Origin": "*",
    })


@require_POST
@csrf_exempt
@api_view()
def log_start_time(request):
    try:
        data = json.loads(request.body)
        content = data['content']
        stream_id = data['stream_id']
    except (KeyError, json.JSONDecodeError):
        return HttpResponseBadRequest()

    try:
        stream = YTStream.objects.get(pk=stream_id)
    except YTStream.DoesNotExist:
        return HttpResponseNotFound()

    YTStreamStartTimeLog.objects.create(stream=stream, content=content)
    return JsonResponse({
        "success": True
    }, headers={
        "Access-Control-Allow-Origin": "*",
    })
