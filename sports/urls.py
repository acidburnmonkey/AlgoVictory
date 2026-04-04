from django.urls import path

from sports.views import ShowAllEventsView

urlpatterns = [
    path('show-events/', ShowAllEventsView.as_view(), name='list all events'),
]
