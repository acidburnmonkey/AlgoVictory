import os
from pprint import pprint

import requests
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("SPORTS_API_KEY")


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
