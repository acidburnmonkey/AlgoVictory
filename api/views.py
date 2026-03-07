import logging
import os

from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.utils.http import urlencode
from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from api.serializers import UserInfoSerializer, UserSerializer

User = get_user_model()

load_dotenv()
if os.getenv('production'):
    REACT_PORT = os.getenv('REACT_PORT')
    API_PORT = os.getenv('API_PORT')
    WEBSITE = 'changeme'
    REDIRECT_URI = 'changeme'
else:
    REACT_PORT = 5173
    API_PORT = 8000
    REDIRECT_URI = f'http://127.0.0.1:{API_PORT}/google/redirect'

logger = logging.getLogger(__name__)
level = logging.DEBUG
formatter = " %(levelname)s | %(funcName)s| %(message)s"
logging.basicConfig(format=formatter, level=level)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # AllowAny: allows everyone to see view


class SocialToken(APIView):
    """Exchanging allauth session tokens for JWT"""

    permission_classes = [IsAuthenticated]

    def get(self, request):

        token = RefreshToken.for_user(request.user)

        frontend_url = os.getenv('FRONTEND_URL')

        logger.debug(frontend_url)

        params = urlencode(
            {
                'access': str(token.access_token),
                'refresh': str(token),
            }
        )

        logger.debug(params)

        return redirect(f'{frontend_url}/home?{params}')


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data)
