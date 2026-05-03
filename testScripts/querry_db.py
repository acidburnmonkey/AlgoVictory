from pprint import pprint

from sports.models import UpcomingEventsModel, AisResponseModel


event_id = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
AisResponseModel.objects.update_or_create(event_id=event_id, defaults={"chatter": "{test1:test1}"})
