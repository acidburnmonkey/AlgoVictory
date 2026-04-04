from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler import util


from sports.jobs import fetch_mma_schedules


def my_first_job():
    print("job is running!")


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")

    scheduler.add_job(
        fetch_mma_schedules,
        trigger=IntervalTrigger(days=20),
        id="fetch_mma_schedules",
        replace_existing=True,
    )

    scheduler.start()
