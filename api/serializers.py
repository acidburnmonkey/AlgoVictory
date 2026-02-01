from django.contrib.auth import get_user_model
from rest_framework import serializers
from api.models import Note

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:  # pyright: ignore
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)  # pyright: ignore
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:  # pyright: ignore
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}
