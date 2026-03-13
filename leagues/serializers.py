from rest_framework import serializers
from .models import Event, Fight


class FightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fight
        fields = ['external_id', 'fighter1', 'fighter2', 'weightclass', 'raw']


class EventSerializer(serializers.ModelSerializer):
    fights = FightSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['external_id', 'name', 'date', 'raw', 'fights']
