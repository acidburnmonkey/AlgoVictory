from pprint import pprint

from sports.models import FightModel, UpcomingEventsModel
from sports.serializers import CardSerializer


def get_fight_card():
    upcoming_now = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
    queryset = FightModel.objects.prefetch_related('fightfightermodel_set__fighter').filter(event__eventId=upcoming_now)
    data = CardSerializer(queryset, many=True).data
    pprint(data)


get_fight_card()
