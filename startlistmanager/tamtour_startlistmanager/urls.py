from django.urls import path

from . import views_api

#######################

app_name = 'tamtour_startlistmanager'
urlpatterns = [
    path('startlists.json', views_api.startlists_json),
]
