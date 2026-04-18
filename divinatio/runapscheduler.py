from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django_apscheduler.jobstores import DjangoJobStore

from sports.jobs import fetch_mma_schedules, get_fighter_stats, set_fighter_image


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")

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

    scheduler.start()
