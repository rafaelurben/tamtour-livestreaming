from django.apps import AppConfig


class StartlistmanagerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tamtour_startlistmanager'

    verbose_name = "TamTour Startlisten-Manager"

    def ready(self):
        # Validate configuration at startup
        from .conf import app_settings  # Import triggers validation
        print("[Startlistmanager] App settings initialized:", app_settings)
