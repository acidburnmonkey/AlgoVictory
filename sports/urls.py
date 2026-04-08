from django.urls import path

from sports.views import FightCardView, ShowAllEventsView, TestView

urlpatterns = [
    path('show-events/', ShowAllEventsView.as_view(), name='list all events'),
    path('test/', TestView.as_view(), name='Test view'),
    path('fight-card/', FightCardView.as_view(), name='Upcoming card'),
]
