from rest_framework import serializers
from api.dev import get_logger
from .models import UpcomingEvents
from datetime import datetime
# from typing import TypedDict

logger = get_logger(__name__)


class UpcomingEventsSerializer(serializers.ModelSerializer):
    dateTime = serializers.DateTimeField()
    day = serializers.DateTimeField()

    class Meta:  # pyright: ignore
        model = UpcomingEvents
        fields = [
            'active',
            'dateTime',
            'day',
            'eventId',
            'leagueId',
            'name',
            'season',
            'shortName',
            'status',
        ]
