from rest_framework import serializers

from api.dev import get_logger
from sports.models import AisResponseModel, FighterModel, FightFighterModel, FightModel, UpcomingEventsModel

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
    day = serializers.SerializerMethodField()
    event_short_name = serializers.SerializerMethodField()

    def get_day(self, obj):
        return obj.event.day.strftime('%B %d, %Y') if obj.event.day else None

    def get_event_short_name(self, obj):
        return obj.event.shortName

    class Meta:  # pyright: ignore
        model = FightModel
        fields = ['fight_id', 'weight_class', 'status', 'event', 'day', 'event_short_name', 'fighters']


class AisResponseSerializer(serializers.ModelSerializer):
    event_short_name = serializers.SerializerMethodField()

    def get_event_short_name(self, obj):
        return obj.event.shortName

    class Meta:  # pyright: ignore
        model = AisResponseModel
        fields = '__all__'
