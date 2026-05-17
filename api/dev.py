import logging
import os

from dotenv import load_dotenv

load_dotenv()

if os.getenv('production'):
    FRONTEND_URL = os.getenv('FRONTEND_URL')
else:
    FRONTEND_URL = 'http://127.0.0.1:5173'


STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
SPORTS_API_KEY = os.getenv("SPORTS_API_KEY")


def get_logger(name: str) -> logging.Logger:
    formatter = " %(levelname)s | %(funcName)s| %(message)s"
    level = logging.INFO if os.getenv('production') else logging.DEBUG
    logging.basicConfig(format=formatter, level=level)
    return logging.getLogger(name)
