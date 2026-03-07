from django.shortcuts import render
import requests
from django.conf import settings
from django.http import JsonResponse


# Create your views here.
def get_leagues(request):

    print("MMA_API_KEY:", bool(getattr(settings, "MMA_API_KEY", None)))

    url = "https://api.balldontlie.io/mma/v1/leagues"

    # send api key
    headers = {
        "Authorization": settings.MMA_API_KEY.strip(),
    }

    try:
        # call external api
        response = requests.get(url, headers=headers)
        # throw 400/500
        response.raise_for_status()
        # jsonify
        data = response.json()

        print("RESPONSE:", response.status_code)
        print("RESPONSE TEXT:", response.text)

        # return data to frontend
        return JsonResponse(data, safe=False)

    except requests.exceptions.RequestException as e:
        print("ERROR:", e)
        return JsonResponse(
            {
                "external_status": response.status_code if 'response' in locals() else None,
                "external_response": response.text if 'response' in locals() else str(e),
            },
            status=500,
        )
