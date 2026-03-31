from django.db import models


class UpcomingEvents(models.Model):
    id: int
    active = models.BooleanField()
    dateTime = models.DateTimeField()
    day = models.DateTimeField()
    eventId = models.IntegerField()
    leagueId = models.IntegerField()
    name = models.TextField()
    season = models.IntegerField()
    shortName = models.TextField()
    status = models.TextField()
