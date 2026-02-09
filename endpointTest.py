import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwNTE1NDAxLCJpYXQiOjE3NzA1MTM2MDEsImp0aSI6Ijk2MWMyMGNkOWM5ODQyYzg5NzAyMWNmYTZjZDUxNTJlIiwidXNlcl9pZCI6IjUifQ._HvMmVWSSlzGse8uHlJQYpdp6AS4xD-REWaVvzBBHug'

headers = {'Authorization': f'Bearer {token}'}

res = requests.get('http://127.0.0.1:8000/api/user-info/', headers=headers)


print("Response : ", res)
print("##" * 44)
print("Payload :", res.json())
