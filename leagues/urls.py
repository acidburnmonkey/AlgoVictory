from django.urls import path
from .views import get_leagues

urlpatterns = [
    path("leagues/", get_leagues, name="get_leagues"),
]