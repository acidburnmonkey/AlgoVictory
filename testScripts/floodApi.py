from pprint import pprint

import requests


def flood(endpoint='/'):
    url = f'http://127.0.0.1:8000/{endpoint}'

    while True:
        try:
            res = requests.get(url)
            pprint(res.json())
        except Exception as e:
            pprint(e)


if __name__ == '__main__':
    flood('sports/show-events/')
