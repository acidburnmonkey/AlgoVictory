from rest_framework import serializers

from api.dev import get_logger

from .models import FighterModel, FightFighterModel, FightModel, UpcomingEventsModel

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


class FighterSerializer(serializers.ModelSerializer):
    class Meta:  # pyright: ignore
        model = FighterModel
        fields = "__all__"


class FightFighterSerializer(serializers.ModelSerializer):
    fighter = FighterSerializer()

    class Meta:  # pyright: ignore
        model = FightFighterModel
        fields = ['fighter']


class CardSerializer(serializers.ModelSerializer):
    fighters = FightFighterSerializer(source='fightfightermodel_set', many=True)

    class Meta:  # pyright: ignore
        model = FightModel
        fields = ['fight_id', 'weight_class', 'status', 'event', 'fighters']
