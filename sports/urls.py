from django.urls import path

from sports.views import AiAnalysisView, FightCardView, ShowAllEventsView, TestView

urlpatterns = [
    path('show-events/', ShowAllEventsView.as_view(), name='list all events'),
    path('test/', TestView.as_view(), name='Test view'),
    path('fight-card/', FightCardView.as_view(), name='Upcoming card'),
    path('ai/', AiAnalysisView.as_view(), name='AI analysis on card'),
]
