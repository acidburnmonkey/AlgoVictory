from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from django_apscheduler.jobstores import DjangoJobStore

from sports.jobs import fetch_mma_schedules, get_fighter_stats, set_fighter_image, get_top_date, archive_event
from datetime import date, timedelta


scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), "default")


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


# scheduler general
def start():

    scheduler.add_job(
        fetch_mma_schedules,
        trigger=IntervalTrigger(days=20),
        id="fetch_mma_schedules",
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

    scheduler.start()

    fetch_mma_schedules()
    get_fighter_stats()
    set_fighter_image()
    schedule_archive()
