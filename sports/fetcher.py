# from api.dev import SPORTS_API_KEY
import os
from pprint import pprint
from datetime import datetime
from .interfaces import TypeScheduleResponse

import requests
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("SPORTS_API_KEY")


def fetch_schedules() -> list[TypeScheduleResponse] | None:

    today = datetime.now()

    try:
        url = f'https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/{datetime.now().year}'
        res = requests.get(url, params={'key': key})

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


# needs event id
def get_figters_id(id: int) -> tuple[int, int] | None:

    try:
        url = f'https://api.sportsdata.io/v3/mma/scores/json/Event/{id}'
        res = requests.get(url, params={'key': key})

        if res.status_code != 200:
            raise ValueError

        fight_chunk = res.json()

        # pprint(fight_chunk['Fights'][0].get('Fighters'))

        f1 = fight_chunk['Fights'][0].get('Fighters')[0].get('FighterId')
        f2 = fight_chunk['Fights'][0].get('Fighters')[1].get('FighterId')

    except (Exception, ValueError) as e:
        print("error", e)
        return

    return (f1, f2)


if __name__ == '__main__':
    get_figters_id(903)
