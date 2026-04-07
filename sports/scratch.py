from sports.models import UpcomingEventsModel


def get_event_ids() -> list[int]:
    ids: list[int] = list(UpcomingEventsModel.objects.values_list("eventId", flat=True))
    return ids
