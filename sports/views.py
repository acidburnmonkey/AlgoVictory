from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.dev import get_logger
from sports.models import UpcomingEventsModel
from sports.serializers import UpcomingEventsSerializer


load_dotenv()

logger = get_logger(__name__)

# event = UpcomingEventsModel.objects.get(event_id=286)
# fighters = Fighter.objects.filter(fights__event=event).distinct()


class ShowAllEventsView(generics.ListAPIView):
    serializer_class = UpcomingEventsSerializer
    queryset = UpcomingEventsModel.objects.all()
    permission_classes = [AllowAny]
