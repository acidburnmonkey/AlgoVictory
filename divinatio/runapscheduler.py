from datetime import date, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.interval import IntervalTrigger
from django.utils import timezone
from django_apscheduler import util
from django_apscheduler.jobstores import DjangoJobStore

from api.dev import get_logger
from api.models import User
from sports.ais import send_card_to_groq
from sports.jobs import archive_event, fetch_mma_schedules, get_fighter_stats, get_top_date, set_fighter_image

scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), "default")

logger = get_logger('__name__')


def schedule_archive():
    """Schedules archive_event only if not already scheduled for the correct date."""

    when = get_top_date()
    if not when:
        return

    target: date = when + timedelta(days=1)

    existing = scheduler.get_job("archive_event")
    if existing and existing.next_run_time and existing.next_run_time.date() == target:
        return

    scheduler.add_job(
        archive_event,
        trigger=DateTrigger(run_date=target),
        id="archive_event",
        replace_existing=True,
        misfire_grace_time=None,
    )


@util.close_old_connections
def expire_meberships():

    query = User.objects.filter(premium=True)

    for user in query:
        if user.payment_date:
            if user.payment_expires < timezone.now():
                logger.info(f"expiring for user {user.id}")
                user.payment_date = None
                user.payment_expires = None
                user.premium = False
                user.save()


def first_run():
    fetch_mma_schedules()
    get_fighter_stats()
    set_fighter_image()
    send_card_to_groq()
    schedule_archive()
    expire_meberships()


# scheduler general
def start():

    scheduler.add_job(
        fetch_mma_schedules,
        trigger=IntervalTrigger(days=20),
        id="fetch_mma_schedules",
        replace_existing=True,
    )

    scheduler.add_job(
        send_card_to_groq,
        trigger=IntervalTrigger(days=20),
        id="send card to groq AI",
        replace_existing=True,
    )

    scheduler.add_job(
        get_fighter_stats,
        trigger=IntervalTrigger(days=15),
        id="update fighter stats",
        replace_existing=True,
    )

    scheduler.add_job(
        set_fighter_image,
        trigger=IntervalTrigger(days=15),
        id="get fighter image link",
        replace_existing=True,
    )

    scheduler.add_job(
        schedule_archive,
        trigger=IntervalTrigger(days=1),
        id="schedule_archive",
        replace_existing=True,
    )

    scheduler.add_job(
        expire_meberships,
        trigger=IntervalTrigger(days=1),
        id="check if mebership expired",
        replace_existing=True,
    )

    scheduler.start()
    # first_run()
