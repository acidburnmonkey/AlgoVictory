from datetime import datetime

import requests
from django_apscheduler import util
from dotenv import load_dotenv

from api.dev import SPORTS_API_KEY, get_logger

from .interfaces import TypeScheduleResponse
from .models import FighterModel
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
        logger.error("error", e)
        return

    response_data: list[TypeScheduleResponse] = res.json()
    filered_events: list[TypeScheduleResponse] = []

    for event in response_data:
        if datetime.fromisoformat(event.get('DateTime', '')) > today and 'Fight Night' not in event.get('Name', ''):
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


# get Stats
def save_fighter(data: dict):
    career = data.get('CareerStats') or {}
    FighterModel.objects.update_or_create(
        fighter_id=data['FighterId'],
        defaults={
            'first_name': data['FirstName'],
            'last_name': data['LastName'],
            'nickname': data.get('Nickname'),
            'weight_class': data.get('WeightClass', ''),
            'birth_date': data.get('BirthDate'),
            'height': data.get('Height'),
            'weight': data.get('Weight'),
            'reach': data.get('Reach'),
            'wins': data.get('Wins', 0),
            'losses': data.get('Losses', 0),
            'draws': data.get('Draws', 0),
            'no_contests': data.get('NoContests', 0),
            'technical_knockouts': data.get('TechnicalKnockouts', 0),
            'technical_knockout_losses': data.get('TechnicalKnockoutLosses', 0),
            'submissions': data.get('Submissions', 0),
            'submission_losses': data.get('SubmissionLosses', 0),
            'title_wins': data.get('TitleWins', 0),
            'title_losses': data.get('TitleLosses', 0),
            'title_draws': data.get('TitleDraws', 0),
            'sig_strikes_landed_per_minute': career.get('SigStrikesLandedPerMinute', 0),
            'sig_strike_accuracy': career.get('SigStrikeAccuracy', 0),
            'takedown_average': career.get('TakedownAverage', 0),
            'submission_average': career.get('SubmissionAverage', 0),
            'knockout_percentage': career.get('KnockoutPercentage', 0),
            'technical_knockout_percentage': career.get('TechnicalKnockoutPercentage', 0),
            'decision_percentage': career.get('DecisionPercentage', 0),
        },
    )


@util.close_old_connections
def get_fighter_stats():

    event_id = 903

    # Inner F
    def get_figters_id(event_id: int) -> tuple[int, int] | None:
        try:
            url = f'https://api.sportsdata.io/v3/mma/scores/json/Event/{event_id}'
            res = requests.get(url, params={'key': SPORTS_API_KEY})
            res.raise_for_status()

            fight_chunk = res.json()
            f1 = fight_chunk['Fights'][0].get('Fighters')[0].get('FighterId')
            f2 = fight_chunk['Fights'][0].get('Fighters')[1].get('FighterId')

        except requests.exceptions.HTTPError as e:
            logger.error("HTTP error", e)
            return
        return (f1, f2)

    # END

    ids = get_figters_id(event_id)
    logger.debug("got fighter ids:", ids)

    if not ids:
        return

    for fighter_id in ids:
        try:
            url = f'https://api.sportsdata.io/v3/mma/scores/json/Fighter/{fighter_id}'
            res = requests.get(url, params={'key': SPORTS_API_KEY})
            res.raise_for_status()

        except requests.exceptions.HTTPError as e:
            logger.error("HTTP error", e)
            continue

        logger.info("saving fighter stats , response ok")
        save_fighter(res.json())
