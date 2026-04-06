from typing import TypedDict

from allauth.socialaccount.models import SocialAccount
from django.utils.http import base36_to_int
from rest_framework import serializers

from .dev import get_logger
from .models import User

logger = get_logger(__name__)


class TypeUserPasswordReset(TypedDict, total=False):
    password: str
    uid: str
    key: str
    user_id: int


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
    payment_date = serializers.SerializerMethodField()
    payment_expires = serializers.SerializerMethodField()

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

    def get_avatar(self, obj: User) -> str | None:
        social_account = SocialAccount.objects.filter(user=obj).first()

        if social_account and social_account.extra_data:
            if social_account.provider == 'google':
                return social_account.extra_data.get('picture')
            elif social_account.provider == 'twitter':
                url = social_account.extra_data.get('profile_image_url_https')
                return url.replace('_normal', '') if url else None

        return None

    def get_provider(self, obj: User) -> str | None:
        social_account = SocialAccount.objects.filter(user=obj).first()

        return social_account.provider if social_account else 'local'

    def get_payment_date(self, obj: User) -> str | None:

        if obj.payment_date:
            return obj.payment_date.strftime("%I:%M%p %b %d, %Y")
        return

    def get_payment_expires(self, obj: User) -> str | None:

        if obj.payment_expires:
            return obj.payment_expires.strftime("%I:%M%p %b %d, %Y")
        return


class EmailSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str) -> str:
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
    key = serializers.CharField(write_only=True)

    def validate(self, atrs: TypeUserPasswordReset) -> TypeUserPasswordReset:  # type: ignore[override]

        uid = atrs.get('uid', '')
        password: str = atrs.get('password', '')

        try:
            user_id = base36_to_int(uid)
            atrs['user_id'] = user_id

        except ValueError:
            logger.error(f'bad uid passed , {uid}')
            raise serializers.ValidationError('Bad uid value passed')

        if len(password) <= 3:
            raise serializers.ValidationError('password too short')

        return atrs
