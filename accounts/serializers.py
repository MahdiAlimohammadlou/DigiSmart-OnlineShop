from djoser.serializers import (
    UserSerializer as BaseUserSerializer,
    UserCreateSerializer as BaseUserCreateSerializer
)
from rest_framework.serializers import ModelSerializer
from .models import Address

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'phone_number', "password"]


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'phone_number', "email", "full_name"]

class AddressSerializer(ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id", "user", "recipient",
            "phone_number", "state",
            "city", "plate",
            "zip_code", "detail_address"
        ]


