from pprint import pprint


from sports.models import FighterModel, AisResponseModel, UpcomingEventsModel


event_id = UpcomingEventsModel.objects.values_list('eventId', flat=True).first()
query = AisResponseModel.objects.get(event_id=event_id)

pprint(f"Type: {type(query)}")
pprint(query)
