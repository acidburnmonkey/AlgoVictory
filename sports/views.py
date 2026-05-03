from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.views import APIView

from api.dev import get_logger
from sports.models import AisResponseModel, FightModel, UpcomingEventsModel
from sports.serializers import AisResponseSerializer, CardSerializer, UpcomingEventsSerializer

load_dotenv()

logger = get_logger(__name__)


class ShowAllEventsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UpcomingEventsSerializer
    queryset = UpcomingEventsModel.objects.all()


class TestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> None:
        return


class FightCardView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CardSerializer
    upcoming_now: int | None = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
    queryset = FightModel.objects.prefetch_related('fightfightermodel_set__fighter').filter(event__eventId=upcoming_now)


class AiAnalysisView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = AisResponseSerializer

    def get_object(self) -> AisResponseModel:
        event_id: int | None = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
        return AisResponseModel.objects.get(event_id=event_id)
