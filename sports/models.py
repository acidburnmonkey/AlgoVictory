from django.db import models


class EventBaseModel(models.Model):
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

    class Meta:
        abstract = True


class UpcomingEventsModel(EventBaseModel):
    pass


class PastEventsModel(EventBaseModel):
    pass


class FighterModel(models.Model):
    fighter_id = models.BigIntegerField(primary_key=True, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    nickname = models.CharField(max_length=100, null=True, blank=True)
    weight_class = models.CharField(max_length=50, blank=True)
    birth_date = models.DateTimeField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    reach = models.FloatField(null=True, blank=True)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    no_contests = models.IntegerField(default=0)
    technical_knockouts = models.IntegerField(default=0)
    technical_knockout_losses = models.IntegerField(default=0)
    submissions = models.IntegerField(default=0)
    submission_losses = models.IntegerField(default=0)
    title_wins = models.IntegerField(default=0)
    title_losses = models.IntegerField(default=0)
    title_draws = models.IntegerField(default=0)
    sig_strikes_landed_per_minute = models.FloatField(default=0)
    sig_strike_accuracy = models.FloatField(default=0)
    takedown_average = models.FloatField(default=0)
    submission_average = models.FloatField(default=0)
    knockout_percentage = models.FloatField(default=0)
    technical_knockout_percentage = models.FloatField(default=0)
    decision_percentage = models.FloatField(default=0)
    imageURL = models.URLField(unique=True, blank=True, null=True)


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


class AisResponseModel(models.Model):
    chatter = models.JSONField()
    event = models.ForeignKey(
        UpcomingEventsModel,
        to_field="eventId",
        on_delete=models.CASCADE,
        related_name="ai_analysis",
    )
