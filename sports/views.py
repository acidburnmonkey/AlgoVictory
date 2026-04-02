from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.dev import get_logger
from sports.interfaces import TypeScheduleResponse
from sports.models import UpcomingEvents
from sports.serializers import UpcomingEventsSerializer

from .fetcher import fetch_schedules

load_dotenv()

logger = get_logger(__name__)


# temp needs to be moved to scheduler
class trigger_fetcher(APIView):
    serializer_class = UpcomingEventsSerializer
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:

        events: list[TypeScheduleResponse] | None = fetch_schedules()

        if not events:
            return Response({'error': 'Failed to fetch events'}, status=400)

        saved = []
        errors = []

        for event in events:
            data = {
                'active': event.get('Active'),
                'dateTime': event.get('DateTime'),
                'day': event.get('Day'),
                'eventId': event.get('EventId'),
                'leagueId': event.get('LeagueId'),
                'name': event.get('Name'),
                'season': event.get('Season'),
                'shortName': event.get('ShortName'),
                'status': event.get('Status'),
            }

            serializer = self.serializer_class(data=data)

            if serializer.is_valid():
                serializer.save()
                saved.append(serializer.data)
                logger.info(f'saved ok : {data}')

            elif serializer.errors.get('eventId'):
                pass

            else:
                errors.append(serializer.errors)
                logger.error(f'error : {serializer.errors}')

        if not saved:
            return Response({'errors': errors}, status=412)

        return Response({'saved': len(saved), 'errors': errors}, status=201)


class ShowAllEventsView(generics.ListAPIView):
    serializer_class = UpcomingEventsSerializer
    queryset = UpcomingEvents.objects.all()
    permission_classes = [AllowAny]
