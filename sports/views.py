from dotenv import load_dotenv
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.dev import get_logger
from api.models import User
from sports.models import AisResponseModel, FightModel, UpcomingEventsModel
from sports.serializers import AisResponseSerializer, CardSerializer, UpcomingEventsSerializer

load_dotenv()
logger = get_logger(__name__)


class PremiumUser(permissions.BasePermission):
    message = "Only preium users can access this"

    def has_permission(self, request: Request, view: APIView) -> bool:
        puser = User.objects.filter(premium=True, username=request.user).first()

        return puser is not None


class ShowAllEventsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UpcomingEventsSerializer

    def get_queryset(self):
        return UpcomingEventsModel.objects.all()


class FightCardView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CardSerializer

    def get_queryset(self):
        upcoming_now = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
        return FightModel.objects.prefetch_related('fightfightermodel_set__fighter').filter(event__eventId=upcoming_now)


class AiAnalysisView(generics.RetrieveAPIView):
    permission_classes = [PremiumUser]
    serializer_class = AisResponseSerializer

    def get_object(self) -> AisResponseModel:
        event_id: int | None = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
        obj = AisResponseModel.objects.filter(event_id=event_id).first()
        if obj is None:
            raise NotFound("AI analysis not available yet.")
        return obj
