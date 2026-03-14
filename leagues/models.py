from django.db import models


# Create your models here.
class Event(models.Model):
    """Represents a sports event (e.g. UFC event) fetched from SportsData.io."""

    external_id = models.BigIntegerField(unique=True)
    name = models.CharField(max_length=255, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    raw = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'name']

    def __str__(self):
        return f"Event {self.external_id} - {self.name}"


class Fight(models.Model):
    """Represents an individual fight/match within an Event.

    We store basic fields when available and keep raw JSON for full data.
    """

    external_id = models.BigIntegerField(unique=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='fights')
    fighter1 = models.CharField(max_length=255, blank=True)
    fighter2 = models.CharField(max_length=255, blank=True)
    weightclass = models.CharField(max_length=128, blank=True)
    raw = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Fight {self.external_id}: {self.fighter1} vs {self.fighter2}"
