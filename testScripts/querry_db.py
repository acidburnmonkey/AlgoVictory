from pprint import pprint


from sports.models import *
from api.models import *

query = User.objects.filter(premium=True, username='mal0').first()

pprint(f"Type: {type(query)}")

pprint(query)
pprint(query is None)
