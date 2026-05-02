import os
from datetime import datetime, timedelta

import requests
from dotenv import load_dotenv


def fetch_schedules_test() -> list | None:

    load_dotenv()
    today = datetime.now()

    try:
        url = f'https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/{datetime.now().year}'
        res = requests.get(url, params={'key': os.getenv('SPORTS_API_KEY')})

        if res.status_code != 200:
            raise ValueError

    except (Exception, ValueError) as e:
        print("error", e)
        return

    response_data: list = res.json()
    filered_events: list = []

    for event in response_data:
        print('event:', event)
        if event.get('DateTime') is None:
            continue
        elif datetime.fromisoformat(event.get('DateTime', '')) > today and 'Fight Night' not in event.get('Name', ''):
            filered_events.append(event)

    print("filered_events: ", filered_events)


if __name__ == "__main__":
    fetch_schedules_test()
