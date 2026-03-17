from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    id: int  # type: ignore
    email = models.EmailField(unique=True)
    premium = models.BooleanField(default=False)
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_expires = models.DateTimeField(null=True, blank=True)
