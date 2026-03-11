from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from allauth.socialaccount.models import SocialAccount
from .dev import get_logger

User = get_user_model()

logger = get_logger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:  # pyright: ignore
        model = User
        fields = [
            'id',
            'username',
            'password',
            'email',
        ]
        extra_kwargs = {
            'password': {
                'write_only': True,
            }
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)  # pyright: ignore
        return user


class UserInfoSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    provider = serializers.SerializerMethodField()

    class Meta:  # pyright: ignore
        model = User

        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'provider',
            'avatar',
            'premium',
            'payment_date',
            'payment_expires',
        ]

    def get_avatar(self, obj):
        social_account = SocialAccount.objects.filter(user=obj).first()

        if social_account and social_account.extra_data:
            if social_account.provider == 'google':
                return social_account.extra_data.get('picture')
            elif social_account.provider == 'twitter_oauth2':
                return social_account.extra_data.get('profile_image_url')

        return None

    def get_provider(self, obj):
        social_account = SocialAccount.objects.filter(user=obj).first()

        return social_account.provider if social_account else 'local'


class EmailSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str):
        value = value.strip().lower()

        try:
            User.objects.get(email=value)

        except User.DoesNotExist:
            raise serializers.ValidationError("No account found with this email.")

        logger.debug("validated password reset email")
        return value


class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, trim_whitespace=True)
    uid = serializers.CharField()

    def validate(self, atrs: dict):  # type: ignore[override]

        uid = atrs.get('uid', '')
        password: str = atrs.get('password', '')

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            atrs['user_id'] = user_id

        except ValueError:
            logger.error(f'bad uid passed , {uid}')
            raise serializers.ValidationError('Bad uid value passed')

        if len(password) <= 5 or password.isalpha():
            raise serializers.ValidationError('password too short')

        return atrs
