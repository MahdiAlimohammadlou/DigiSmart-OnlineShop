from rest_framework import serializers

class UserCartSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    image = serializers.CharField()
    numPrice = serializers.DecimalField(max_digits=10, decimal_places=2)
    strPrice = serializers.CharField()
    quantity = serializers.IntegerField()
    totalPrice = serializers.DecimalField(max_digits=10, decimal_places=2)