from rest_framework import serializers
from api.dev import get_logger
from .models import UpcomingEventsModel

logger = get_logger(__name__)


class UpcomingEventsSerializer(serializers.ModelSerializer):
    dateTime = serializers.DateTimeField(format='%B %d, %Y')
    day = serializers.DateTimeField(format='%B %d, %Y')

    class Meta:  # pyright: ignore
        model = UpcomingEventsModel
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
