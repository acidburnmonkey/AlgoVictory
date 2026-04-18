from dotenv import load_dotenv
from django.db.models import QuerySet
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.dev import get_logger
from sports.models import FightModel, FighterModel, UpcomingEventsModel
from sports.serializers import CardSerializer, FighterSerializer, UpcomingEventsSerializer

load_dotenv()

logger = get_logger(__name__)


class ShowAllEventsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UpcomingEventsSerializer
    queryset = UpcomingEventsModel.objects.all()


class TestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        fighters: QuerySet[FighterModel] = FighterModel.objects.filter(imageURL__isnull=True)
        thing = fighters.values('first_name', flat=True)
        for f in thing:
            print(f)

        return Response({'thing': thing, 'fighters': FighterSerializer(fighters, many=True).data})


class FightCardView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CardSerializer
    upcoming_now = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
    queryset = FightModel.objects.prefetch_related('fightfightermodel_set__fighter').filter(event__eventId=upcoming_now)
