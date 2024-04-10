from rest_framework import serializers
from .models import Order, Transaction, OrderItem

class UserCartSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    image = serializers.CharField()
    numPrice = serializers.DecimalField(max_digits=13, decimal_places=2)
    strPrice = serializers.CharField()
    quantity = serializers.IntegerField()
    totalPrice = serializers.DecimalField(max_digits=13, decimal_places=2)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id", "order", "product",
            "quantity", "total_price"
        ] 

class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id", "user", "recipient", "phone_number", "state",
            "city", "plate", "discount_amount",
            "zip_code", "detail_address",
            "order_date", "total_price", "formatted_order_date",
            "order_status", "order_items"
        ]

    def get_order_items(self, obj):
        order_items_queryset = OrderItem.objects.filter(order=obj)
        order_items_serializer = OrderItemSerializer(instance=order_items_queryset, many=True)
        return order_items_serializer.data



class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id", "ref_id", "order", "transaction_date", "amount",
             "description", "is_success"
        ]