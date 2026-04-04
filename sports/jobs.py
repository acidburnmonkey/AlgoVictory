from datetime import datetime
import requests
from django_apscheduler import util
from dotenv import load_dotenv

from api.dev import SPORTS_API_KEY, get_logger

from .interfaces import TypeScheduleResponse
from .serializers import UpcomingEventsSerializer

load_dotenv()
logger = get_logger(__name__)


def fetch_schedules() -> list[TypeScheduleResponse] | None:

    today = datetime.now()

    try:
        url = f'https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/{datetime.now().year}'
        res = requests.get(url, params={'key': SPORTS_API_KEY})

        if res.status_code != 200:
            raise ValueError

    except (Exception, ValueError) as e:
        print("error", e)
        return

    response_data: list[TypeScheduleResponse] = res.json()
    filered_events: list[TypeScheduleResponse] = []

    for event in response_data:
        if datetime.fromisoformat(event.get('DateTime')) > today and 'Fight Night' not in event.get('Name'):
            filered_events.append(event)

    return filered_events


@util.close_old_connections
def fetch_mma_schedules() -> None:
    serializer_class = UpcomingEventsSerializer
    events: list[TypeScheduleResponse] | None = fetch_schedules()

    if not events:
        return

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

        serializer = serializer_class(data=data)

        if serializer.is_valid():
            serializer.save()
            saved.append(serializer.data)
            logger.info(f'saved ok : {data}')

        elif serializer.errors.get('eventId'):
            pass

        else:
            errors.append(serializer.errors)
            logger.error(f'error : {serializer.errors}')
