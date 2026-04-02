from django.urls import path

from sports.views import ShowAllEventsView, trigger_fetcher

urlpatterns = [
    path('trigger/', trigger_fetcher.as_view(), name='trigger-fetch'),
    path('show-events/', ShowAllEventsView.as_view(), name='list all events'),
]
