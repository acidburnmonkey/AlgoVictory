from django.urls import path

from sports.views import ShowAllEventsView, TestView

urlpatterns = [
    path('show-events/', ShowAllEventsView.as_view(), name='list all events'),
    path('test/', TestView.as_view(), name='Test view'),
]
