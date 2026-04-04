from django.apps import AppConfig
import os


class AlgoVictoryConfig(AppConfig):
    name = 'divinatio'

    def ready(self):
        from . import runapscheduler

        if os.environ.get('RUN_MAIN') == 'true':
            runapscheduler.start()
