import json
from django.core.management.base import BaseCommand
from django.conf import settings
import requests
from leagues.services import fetch_and_store_schedule


class Command(BaseCommand):
    help = 'Fetch UFC schedule from SportsData and store events/fights in the DB'

    def add_arguments(self, parser):
        parser.add_argument('--season', type=str, default='2026')

    def handle(self, *args, **options):
        season = options['season']
        self.stdout.write(f'Fetching schedule for season {season}...')

        try:
            created, updated = fetch_and_store_schedule(season=season)
        except Exception as e:
            self.stderr.write(f'Error fetching schedule: {e}')
            return

        self.stdout.write(self.style.SUCCESS(f'Events created: {created}, updated: {updated}'))
