# from api.dev import SPORTS_API_KEY
import os
import pprint
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


if __name__ == '__main__':
    fetch_schedules()
