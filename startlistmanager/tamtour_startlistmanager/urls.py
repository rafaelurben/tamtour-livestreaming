from django.urls import path

from . import views_api

#######################

app_name = 'tamtour_startlistmanager'
urlpatterns = [
    path('get-start-lists', views_api.get_start_lists),
    path('get-broadcasts', views_api.get_broadcasts),
    path('log-start-time', views_api.log_start_time),
]
