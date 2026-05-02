import unicodedata

import requests


# Decompose characters (e.g., í → i + combining accent)
def to_ascii(text):
    nfkd = unicodedata.normalize('NFKD', text)
    return ''.join(c for c in nfkd if not unicodedata.combining(c))


def get_octagon_image(raw: str) -> str | None:
    name = to_ascii(raw).lower().replace(' ', '-')

    url = f'https://api.octagon-api.com/fighter/{name}'
    response = requests.get(url, timeout=60)

    if response.ok:
        imgUrl = response.json().get('imgUrl')
        return imgUrl

    return None


if __name__ == '__main__':
    get_octagon_image('Jiří Procházka')
