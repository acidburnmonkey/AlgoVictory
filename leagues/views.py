from django.shortcuts import render
import requests
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from .models import Event
from .serializers import EventSerializer


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

    #return data to frontend
        return JsonResponse(data, safe=False)
    
    except requests.exceptions.RequestException as e:
        print("ERROR:", e)
        return JsonResponse(
            {
                "external_status": response.status_code if 'response' in locals() else None,
                "external_response": response.text if 'response' in locals() else str(e)
            }, status=500)
    


@api_view(['GET'])
@permission_classes([AllowAny])
def events_list(request):
    """Return stored events from the database."""
    external_id = request.GET.get('external_id')
    from django.core.paginator import Paginator
    from django.utils import timezone

    qs = Event.objects.all()

    # filter by external_id if provided
    if external_id:
        qs = qs.filter(external_id=external_id)

    # upcoming filter: ?upcoming=true
    upcoming = request.GET.get('upcoming')
    if upcoming and upcoming.lower() in ('1', 'true', 'yes'):
        now = timezone.now()
        qs = qs.filter(date__gte=now)

    # pagination: ?page=1&page_size=20
    try:
        page = int(request.GET.get('page', 1))
    except ValueError:
        page = 1
    try:
        page_size = int(request.GET.get('page_size', 50))
    except ValueError:
        page_size = 50

    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)

    serializer = EventSerializer(page_obj.object_list, many=True)
    return Response({
        'data': serializer.data,
        'pagination': {
            'page': page_obj.number,
            'page_size': page_size,
            'pages': paginator.num_pages,
            'total': paginator.count,
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def event_detail(request, external_id: int):
    try:
        ev = Event.objects.get(external_id=external_id)
    except Event.DoesNotExist:
        return Response({'error': 'not_found'}, status=404)
    serializer = EventSerializer(ev)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def refresh_schedule(request):
    """Trigger a schedule fetch (uses server-side API key). Admin-only."""
    season = request.data.get('season', '2026')
    try:
        from .services import fetch_and_store_schedule

        created, updated = fetch_and_store_schedule(season=season)
        return Response({'created': created, 'updated': updated})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

