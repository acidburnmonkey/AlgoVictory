from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.dev import get_logger
from sports.models import FightModel, UpcomingEventsModel
from sports.serializers import CardSerializer, UpcomingEventsSerializer

load_dotenv()

logger = get_logger(__name__)

# event = UpcomingEventsModel.objects.get(event_id=286)
# fighters = Fighter.objects.filter(fights__event=event).distinct()


class ShowAllEventsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UpcomingEventsSerializer
    queryset = UpcomingEventsModel.objects.all()


class TestView(APIView):
    permission_classes = [AllowAny]
    pass


class FightCardView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CardSerializer
    upcoming_now = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
    queryset = FightModel.objects.prefetch_related('fightfightermodel_set__fighter').filter(event__eventId=upcoming_now)
