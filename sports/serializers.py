from rest_framework import serializers
from api.dev import get_logger
from .models import UpcomingEvents
from datetime import datetime
# from typing import TypedDict

logger = get_logger(__name__)


class UpcomingEventsSerializer(serializers.ModelSerializer):
    dateTime = serializers.DateTimeField(format='%B %d, %Y')
    day = serializers.DateTimeField(format='%B %d, %Y')

    class Meta:  # pyright: ignore
        model = UpcomingEvents
        fields = [
            'id',
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
