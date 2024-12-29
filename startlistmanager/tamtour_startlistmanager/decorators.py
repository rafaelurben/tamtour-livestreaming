import uuid
from functools import wraps

from django.http import JsonResponse, HttpResponse
from django.utils import timezone

from .models import ApiKey

NO_PERMISSION_APIKEY = JsonResponse(
    {
        "error": "no-permission",
        "message": "You don't have permission to access this endpoint because your API key is invalid or expired!",
    },
    status=403,
)

NO_PERMISSION_SESSION = JsonResponse(
    {
        "error": "no-permission",
        "message": "You don't have permission to access this endpoint! (authentication method: session)",
    },
    status=403,
)

NOT_AUTHENTICATED = JsonResponse(
    {
        "error": "not-authenticated",
        "message": "You must authenticate yourself to use this endpoint!",
    },
    status=401,
)


def _is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False


def api_view():
    """Decorator: Protect an api view from unauthorized access."""

    def decorator(function):
        @wraps(function)
        def wrap(request, *args, **kwargs):
            apikey = request.GET.get("apikey", None)

            if apikey:
                if (_is_valid_uuid(apikey) and ApiKey.objects.filter(key=apikey,
                                                                     valid_until__gt=timezone.now()).exists()):
                    return function(request, *args, **kwargs)

                return NO_PERMISSION_APIKEY

            if request.user.is_authenticated:
                if request.user.has_module_perms('tamtour_startlistmanager'):
                    return function(request, *args, **kwargs)

                return NO_PERMISSION_SESSION

            return NOT_AUTHENTICATED

        return wrap

    return decorator


def cors_allowed(origin='*', allow_headers='content-type', allow_methods='GET,POST'):
    def decorator(function):
        @wraps(function)
        def wrap(request, *args, **kwargs):
            headers = {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Headers": allow_headers,
                "Access-Control-Allow-Methods": allow_methods,
            }

            if request.method == "OPTIONS":
                return HttpResponse(headers=headers)

            response = function(request, *args, **kwargs)
            for key, value in headers.items():
                response.headers[key] = value
            return response

        return wrap

    return decorator
