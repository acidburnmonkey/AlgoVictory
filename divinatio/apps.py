import os

from django.apps import AppConfig


class AlgoVictoryConfig(AppConfig):
    name = 'divinatio'

    def ready(self):
        from . import runapscheduler

        if os.environ.get('RUN_MAIN') == 'true' or os.environ.get('production'):
            runapscheduler.start()
