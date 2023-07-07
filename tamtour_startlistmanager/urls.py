from django.urls import path

from . import views

#######################

app_name = 'tamtour_startlistmanager'
urlpatterns = [
    path('startlists.json', views.startlists_json),
]
