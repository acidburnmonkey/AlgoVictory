import os
from pprint import pprint

import requests
from dotenv import load_dotenv

load_dotenv()


def get_figters_ids(event_id: int):
    try:
        url = f'https://api.sportsdata.io/v3/mma/scores/json/Event/{event_id}'
        res = requests.get(url, params={'key': os.getenv('SPORTS_API_KEY')})
        res.raise_for_status()

        fight_chunk = res.json()

        f1 = fight_chunk['Fights'][0].get('Fighters')[0].get('FighterId')
        f2 = fight_chunk['Fights'][0].get('Fighters')[1].get('FighterId')

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error {e}")
        return
    except IndexError:
        print("no Fighters yet")
        return

    print(f1, f2)


if __name__ == '__main__':
    get_figters_ids(910)
