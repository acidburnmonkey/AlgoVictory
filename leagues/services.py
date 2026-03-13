import requests
from django.conf import settings
from datetime import datetime
from typing import Tuple

from .models import Event, Fight


def parse_date(date_value):
    if not date_value:
        return None
    if isinstance(date_value, datetime):
        return date_value
    try:
        # let fromisoformat handle many cases (Z removed)
        return datetime.fromisoformat(str(date_value).replace('Z', ''))
    except Exception:
        return None


def fetch_and_store_schedule(season: str = '2026') -> Tuple[int, int]:
    """Fetch schedule from SportsData.io and store/update Events and Fights.

    Returns (created_events, updated_events).
    """
    api_key = getattr(settings, 'SPORTS_API_KEY', None)
    url = f'https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/{season}'

    headers = {}
    if api_key:
        headers['Ocp-Apim-Subscription-Key'] = str(api_key)

    resp = requests.get(url, headers=headers, timeout=20)
    resp.raise_for_status()
    data = resp.json()

    if not isinstance(data, list):
        raise ValueError('Unexpected response format; expected a list')

    created = 0
    updated = 0

    for item in data:
        external_id = item.get('EventId') or item.get('ID') or item.get('Id') or item.get('id')
        if external_id is None:
            continue

        name = item.get('Name') or item.get('Event') or item.get('Title') or item.get('name') or ''
        date = parse_date(item.get('Date') or item.get('EventDate') or item.get('StartTime') or item.get('date'))

        ev, created_flag = Event.objects.update_or_create(
            external_id=external_id,
            defaults={'name': name, 'date': date, 'raw': item},
        )

        if created_flag:
            created += 1
        else:
            updated += 1

        # Parse fights if available in known locations
        fights_list = item.get('Matchups') or item.get('Fights') or item.get('EventFightList') or item.get('MatchupsList') or []
        if isinstance(fights_list, dict):
            # sometimes API returns an object with key 'Matchups'
            fights_list = list(fights_list.values())

        if isinstance(fights_list, list):
            for f in fights_list:
                fight_id = f.get('FightId') or f.get('MatchupId') or f.get('ID') or f.get('Id') or f.get('id')
                fighter1 = None
                fighter2 = None

                # Common sub-keys
                fighter1 = f.get('Fighter1') or f.get('FighterA') or f.get('Home') or f.get('RedCorner')
                fighter2 = f.get('Fighter2') or f.get('FighterB') or f.get('Away') or f.get('BlueCorner')

                # If nested objects provided, attempt to extract name fields
                if isinstance(fighter1, dict):
                    fighter1 = fighter1.get('Name') or fighter1.get('FullName') or fighter1.get('DisplayName')
                if isinstance(fighter2, dict):
                    fighter2 = fighter2.get('Name') or fighter2.get('FullName') or fighter2.get('DisplayName')

                weight = f.get('WeightClass') or f.get('Weight') or f.get('weightclass') or ''

                if fight_id is None:
                    # try to synthesize a fight id from event+fighters for uniqueness
                    fight_key = f"{ev.external_id}:{fighter1}:{fighter2}"
                    fight_id = abs(hash(fight_key)) % (10 ** 12)

                Fight.objects.update_or_create(
                    external_id=fight_id,
                    defaults={
                        'event': ev,
                        'fighter1': fighter1 or '',
                        'fighter2': fighter2 or '',
                        'weightclass': weight or '',
                        'raw': f,
                    },
                )

    return created, updated
