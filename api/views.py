import logging
import os

from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.utils.http import urlencode
from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.account.forms import ResetPasswordForm
from .dev import API_PORT, get_logger
from .serializers import UserInfoSerializer, UserSerializer

User = get_user_model()
load_dotenv()

REDIRECT_URI = f'http://127.0.0.1:{API_PORT}/google/redirect'

logger = get_logger(__name__)


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

    def get(self, request: Request) -> Response:
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data)
