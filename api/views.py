from allauth.account.app_settings import PASSWORD_RESET_TOKEN_GENERATOR
from allauth.account.forms import ResetPasswordForm
from django.shortcuts import redirect
from django.utils.http import urlencode
from dotenv import load_dotenv
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from api.dev import API_PORT, FRONTEND_URL, get_logger
from api.models import User
from api.serializers import EmailSendSerializer, SetPasswordSerializer, UserInfoSerializer, UserSerializer

load_dotenv()

REDIRECT_URI = f'http://127.0.0.1:{API_PORT}/google/redirect'

logger = get_logger(__name__)


class CreateUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'register'
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SocialToken(APIView):
    """Exchanging allauth session tokens for JWT"""

    permission_classes = [IsAuthenticated]

    def get(self, request):

        token = RefreshToken.for_user(request.user)

        params = urlencode(
            {
                'access': str(token.access_token),
                'refresh': str(token),
            }
        )

        logger.debug("Exchanging JWT tokens")

        return redirect(f'{FRONTEND_URL}/home?{params}')


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UserInfoSerializer(request.user)
        logger.debug(f"UserInfoView :{serializer.data}")

        return Response(serializer.data)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'

    serializer_class = EmailSendSerializer

    def post(self, request: Request) -> Response:

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)  # catch err auto handled

        mail = serializer.validated_data.get('email')
        logger.info(mail)

        allauth_form = ResetPasswordForm(data={'email': mail})
        if allauth_form.is_valid():
            allauth_form.save(request)

        return Response({'message': 'Passord reset sent'})


class SetNewPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'

    serializer_class = SetPasswordSerializer

    # gets uid, key, password
    def post(self, request: Request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        password = serializer.validated_data.get('password')
        user = User.objects.get(pk=serializer.validated_data.get('user_id'))
        logger.debug(f'changing password for user {user}')

        logger.debug(f"request.key : {request.data.get('key')}")

        if PASSWORD_RESET_TOKEN_GENERATOR().check_token(user, request.data.get('key')):
            user.set_password(password)
            user.save()
            return Response({'ok': 'password changed'}, status=200)

        return Response({'error': 'token expired'}, status=400)
