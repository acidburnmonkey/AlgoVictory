import json
import re

from groq import Groq

from api.dev import get_logger
from sports.interfaces import FightCardType
from sports.models import AisResponseModel, FightModel, UpcomingEventsModel
from sports.serializers import CardSerializer

logger = get_logger(__name__)


def parse_model_response(text: str) -> dict:
    # strip <think>...</think> blocks (qwen reasoning models)
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    # strip markdown code fences
    text = re.sub(r"```(?:json)?\s*", "", text)
    text = text.replace("```", "")
    return json.loads(text.strip())


def get_fight_card() -> list[FightCardType]:
    upcoming_now: int | None = UpcomingEventsModel.objects.order_by('dateTime').values_list('eventId', flat=True).first()
    queryset = FightModel.objects.prefetch_related('fightfightermodel_set__fighter').filter(event__eventId=upcoming_now)
    data: list[FightCardType] = CardSerializer(queryset, many=True).data
    return data


def send_card_to_groq() -> None:
    client = Groq()

    instructions = """" you are an expert in sports analytics , you will be provided a json fight_card with 2 fighters for an upcoming fight and
    their stats , compare them and and make a prediction on who the winner will be ,
    reply back with the format in json
            analysis:{
                fighter_1: { name,
                    Advantages: analyze,
                    Disadvantages: analyze,
                    Performance Index: number from 1 to 100},
                fighter_2: { name,
                    Advantages: analyze,
                    Disadvantages: analyze,
                    Performance Index: number from 1 to 100},
                winer:{name: fighter name , factor: knockout , points, comment:'your short comment summarizing your analysis'} }"""

    fight_card: list[FightCardType] = get_fight_card()
    if fight_card is None:
        logger.error("get_fight_card() retuened None")
        return

    models: list[str] = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "qwen/qwen3-32b",
    ]

    prompt: str = f"{instructions}, this is the fight card {fight_card} only reply back with the json I asked"

    results: dict[str, dict] = {}
    for model in models:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        raw: str = response.choices[0].message.content
        logger.debug(f"\n--- {model} ---")
        logger.debug(raw)
        try:
            results[model] = parse_model_response(raw)
        except json.JSONDecodeError as e:
            logger.error(f"  [parse error] {e}")
            results[model] = {"raw": raw}

    event_id: int | None = UpcomingEventsModel.objects.order_by('dateTime').values_list('eventId', flat=True).first()

    AisResponseModel.objects.update_or_create(event_id=event_id, defaults={"chatter": results})
    logger.info('Added chatter to Ai row')
