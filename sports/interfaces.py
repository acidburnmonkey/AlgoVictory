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
