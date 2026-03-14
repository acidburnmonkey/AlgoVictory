from django.urls import path
from .views import get_leagues, events_list, event_detail
from .views import refresh_schedule

urlpatterns = [
    path("leagues/", get_leagues, name="get_leagues"),
    path("events/", events_list, name="events-list"),
    path("events/<int:external_id>/", event_detail, name="event-detail"),
    path("events/refresh/", refresh_schedule, name="events-refresh"),
]
