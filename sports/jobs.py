from datetime import datetime

import requests
from django_apscheduler import util
from dotenv import load_dotenv

from api.dev import SPORTS_API_KEY, get_logger

from .interfaces import TypeScheduleResponse
from sports.models import FightFighterModel, FightModel, FighterModel, UpcomingEventsModel
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


@util.close_old_connections
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


def get_fighter_stats():

    # Inner F returns 2 fighter ids from event
    def get_figters_ids(event_id: int) -> tuple[int, int] | None:
        try:
            url = f'https://api.sportsdata.io/v3/mma/scores/json/Event/{event_id}'
            res = requests.get(url, params={'key': SPORTS_API_KEY})
            res.raise_for_status()

            fight_chunk = res.json()
            f1 = fight_chunk['Fights'][0].get('Fighters')[0].get('FighterId')
            f2 = fight_chunk['Fights'][0].get('Fighters')[1].get('FighterId')

        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error {e}")
            return
        return (f1, f2)

    # END

    # Inner F -> return all event ids
    @util.close_old_connections
    def get_event_ids() -> list[int]:
        ids: list[int] = list(UpcomingEventsModel.objects.values_list("eventId", flat=True))
        return ids

    # End

    all_events = get_event_ids()
    fighter_ids: list[int] = []

    for event_id in all_events:
        result = get_figters_ids(event_id)

        if result is not None:
            fighter_ids.extend(result)
        logger.debug(f"got fighter ids: {fighter_ids}")

        if not fighter_ids:
            logger.error("no fighter ids returned")
            return

    for fighter_id in fighter_ids:
        try:
            url = f'https://api.sportsdata.io/v3/mma/scores/json/Fighter/{fighter_id}'
            res = requests.get(url, params={'key': SPORTS_API_KEY})
            res.raise_for_status()

        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error {e}")
            continue

        logger.info("saving fighter stats , response ok")
        save_fighter(res.json())

    # Link each event's 2 fighters to their FightModel
    for event_id in all_events:
        result = get_figters_ids(event_id)
        if result is None:
            continue

        f1, f2 = result

        try:
            url = f'https://api.sportsdata.io/v3/mma/scores/json/Event/{event_id}'
            res = requests.get(url, params={'key': SPORTS_API_KEY})
            res.raise_for_status()
            main_fight = res.json()['Fights'][0]
        except (requests.exceptions.HTTPError, IndexError, KeyError) as e:
            logger.error(f"error fetching fight meta for event {event_id}: {e}")
            continue

        logger.info(f"main_fight: {main_fight}")
        fight_id = main_fight.get('FightId')
        if not fight_id:
            continue

        try:
            event_obj = UpcomingEventsModel.objects.get(eventId=event_id)
        except UpcomingEventsModel.DoesNotExist:
            logger.error(f"Event {event_id} not in DB")
            continue

        fight_obj, _ = FightModel.objects.update_or_create(
            fight_id=fight_id,
            defaults={
                'event': event_obj,
                'weight_class': main_fight.get('WeightClass', ''),
                'status': main_fight.get('Status', ''),
            },
        )

        for fd in main_fight.get('Fighters', [])[:2]:
            fighter_id = fd.get('FighterId')
            if fighter_id not in (f1, f2):
                continue
            try:
                fighter_obj = FighterModel.objects.get(fighter_id=fighter_id)
            except FighterModel.DoesNotExist:
                logger.error(f"Fighter {fighter_id} not in DB")
                continue

            FightFighterModel.objects.update_or_create(
                fight=fight_obj,
                fighter=fighter_obj,
                defaults={
                    'moneyline': fd.get('Moneyline'),
                    'pre_fight_wins': fd.get('PreFightWins'),
                    'pre_fight_losses': fd.get('PreFightLosses'),
                    'pre_fight_draws': fd.get('PreFightDraws'),
                    'pre_fight_no_contests': fd.get('PreFightNoContests'),
                },
            )
        logger.info(f"linked fighters {f1}, {f2} to fight {fight_id} (event {event_id})")
