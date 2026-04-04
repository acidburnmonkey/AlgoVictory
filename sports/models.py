from django.db import models


class UpcomingEventsModel(models.Model):
    id: int
    active = models.BooleanField()
    dateTime = models.DateTimeField()
    day = models.DateTimeField()
    eventId = models.IntegerField(unique=True)
    leagueId = models.IntegerField()
    name = models.TextField()
    season = models.IntegerField()
    shortName = models.TextField()
    status = models.TextField()


class FighterModel(models.Model):
    fighter_id = models.BigIntegerField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)


class FightModel(models.Model):
    fight_id = models.IntegerField(unique=True)
    event = models.ForeignKey(
        UpcomingEventsModel,
        to_field="eventId",
        on_delete=models.CASCADE,
        related_name="fights",
    )
    weight_class = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=50, blank=True)
    fighters = models.ManyToManyField(
        FighterModel,
        through="FightFighterModel",
        related_name="fights",
    )


class FightFighterModel(models.Model):
    fight = models.ForeignKey(FightModel, on_delete=models.CASCADE)
    fighter = models.ForeignKey(FighterModel, on_delete=models.CASCADE)
    winner = models.BooleanField(null=True, blank=True)
    moneyline = models.IntegerField(null=True, blank=True)
    pre_fight_wins = models.IntegerField(null=True, blank=True)
    pre_fight_losses = models.IntegerField(null=True, blank=True)
    pre_fight_draws = models.IntegerField(null=True, blank=True)
    pre_fight_no_contests = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ("fight", "fighter")
