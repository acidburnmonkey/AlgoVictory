import os

from django.contrib.auth import get_user_model
from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from api.serializers import UserSerializer, UserInfoSerializer
from rest_framework.response import Response

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


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data)
