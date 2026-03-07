import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxMTI2MjI2LCJpYXQiOjE3NzExMjQ0MjYsImp0aSI6ImNjZDdmYzQwMTZhNDQ3MTBiMmNiODAxNTAzZTU5ZDEyIiwidXNlcl9pZCI6IjUifQ.wqCv_D2Kd77wZAB33pEWRlJoBMlL8yB_uyIQ3-q9Ew4'

headers = {'Authorization': f'Bearer {token}'}

res = requests.get('http://127.0.0.1:8000/api/user-info/', headers=headers)


print("Response : ", res)
print("##" * 44)
print("Payload :", res.json())
