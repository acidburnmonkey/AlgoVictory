import os
import logging
from dotenv import load_dotenv

load_dotenv()

if os.getenv('production'):
    REACT_PORT = os.getenv('REACT_PORT')
    API_PORT = os.getenv('API_PORT')
    FRONTEND_URL = os.getenv('FRONTEND_URL')
else:
    REACT_PORT = 5173
    API_PORT = 8000
    FRONTEND_URL = 'http://127.0.0.1:5173'


def get_logger(name: str) -> logging.Logger:
    formatter = " %(levelname)s | %(funcName)s| %(message)s"
    logging.basicConfig(format=formatter, level=logging.DEBUG)
    return logging.getLogger(name)
