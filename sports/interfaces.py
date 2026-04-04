from typing import TypedDict


class TypeScheduleResponse(TypedDict):
    EventId: int
    LeagueId: int
    Name: str
    ShortName: str
    Season: int
    Day: str
    DateTime: str
    Status: str
    Active: bool


class TypeUfcCareerStats(TypedDict):
    FighterId: int
    FirstName: str
    LastName: str
    SigStrikesLandedPerMinute: float
    SigStrikeAccuracy: float
    TakedownAverage: float
    SubmissionAverage: float
    KnockoutPercentage: float
    TechnicalKnockoutPercentage: float
    DecisionPercentage: float


class FighterType(TypedDict):
    FighterId: int
    FirstName: str
    LastName: str
    Nickname: str | None
    WeightClass: str
    BirthDate: str
    Height: float
    Weight: float
    Reach: float
    Wins: int
    Losses: int
    Draws: int
    NoContests: int
    TechnicalKnockouts: int
    TechnicalKnockoutLosses: int
    Submissions: int
    SubmissionLosses: int
    TitleWins: int
    TitleLosses: int
    TitleDraws: int
    CareerStats: TypeUfcCareerStats
