from typing import TypedDict


class TypeScheduleResponse(TypedDict):
    event_id: int
    league_id: int
    name: str
    short_name: str
    season: int
    day: str
    date_time: str
    status: str
    active: bool


class TypeUfcCareerStats(TypedDict):
    fighter_id: int
    first_name: str
    last_name: str
    sig_strikes_landed_per_minute: float
    sig_strike_accuracy: float
    takedown_average: float
    submission_average: float
    knockout_percentage: float
    technical_knockout_percentage: float
    decision_percentage: float


class FighterType(TypedDict):
    fighter_id: int
    first_name: str
    last_name: str
    nickname: str | None
    weight_class: str
    birth_date: str
    height: float
    weight: float
    reach: float
    wins: int
    losses: int
    draws: int
    no_contests: int
    technical_knockouts: int
    technical_knockout_losses: int
    submissions: int
    submission_losses: int
    title_wins: int
    title_losses: int
    title_draws: int
    sig_strikes_landed_per_minute: float
    sig_strike_accuracy: float
    takedown_average: float
    submission_average: float
    knockout_percentage: float
    technical_knockout_percentage: float
    decision_percentage: float
    imageURL: str | None
    career_stats: TypeUfcCareerStats


class FightFighterType(TypedDict):
    fighter: FighterType


class FightCardType(TypedDict):
    fight_id: int
    weight_class: str
    status: str
    event: int
    day: str | None
    fighters: list[FightFighterType]
