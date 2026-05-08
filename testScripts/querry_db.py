from pprint import pprint

from django.utils import timezone

from api.models import User

query = User.objects.filter(premium=True)


pprint(query)
