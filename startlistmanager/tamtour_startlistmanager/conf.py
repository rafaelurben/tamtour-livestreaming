from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

SETTINGS_KEY = 'TAMTOUR_STARTLISTMANAGER'


class AppSettings:
    OAUTH_GOOGLE_KEY: str
    OAUTH_GOOGLE_SECRET: str

    REQUIRED_SETTINGS = ['OAUTH_GOOGLE_KEY', 'OAUTH_GOOGLE_SECRET']

    def __init__(self):
        user_settings = getattr(settings, SETTINGS_KEY, None)

        if user_settings is None or not isinstance(user_settings, dict):
            raise ImproperlyConfigured(f"The settings key {SETTINGS_KEY} must be present and be a dict.")

        for key in self.REQUIRED_SETTINGS:
            if key not in user_settings:
                raise ImproperlyConfigured(f"The key '{key}' must be set in the {SETTINGS_KEY} settings key.")
            setattr(self, key, user_settings[key])


app_settings = AppSettings()
