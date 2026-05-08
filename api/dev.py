import logging
import os

from dotenv import load_dotenv

load_dotenv()

if os.getenv('production'):
    REACT_PORT = os.getenv('REACT_PORT')
    API_PORT = os.getenv('API_PORT')
    FRONTEND_URL = os.getenv('FRONTEND_URL')
    SERVER_URL = os.getenv('SERVER_URL')
else:
    REACT_PORT = 5173
    API_PORT = 8000
    FRONTEND_URL = 'http://127.0.0.1:5173'
    SERVER_URL = 'http://127.0.0.1:8000'


STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
SPORTS_API_KEY = os.getenv("SPORTS_API_KEY")


def get_logger(name: str) -> logging.Logger:
    formatter = " %(levelname)s | %(funcName)s| %(message)s"
    level = logging.INFO if os.getenv('production') else logging.DEBUG
    logging.basicConfig(format=formatter, level=level)
    return logging.getLogger(name)
