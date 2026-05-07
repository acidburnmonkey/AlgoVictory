import requests


def main():
    token = ''

    headers = {'Authorization': f'Bearer {token}'}

    res = requests.get('http://127.0.0.1:8000/api/user-info/', headers=headers)

    print("Response : ", res)
    print("##" * 44)
    print("Payload :", res.json())


if __name__ == '__main__':
    main()
