from django.db import models
from accounts.models import User
from product.models import Product
from core.models import AbstractBaseModel
from django.utils import timezone
from jdatetime import datetime as jdatetime 

# Create your models here.
class Order(AbstractBaseModel):
    """A model representing an order with user, address, date, price, and delivery status."""

    ORDER_STATUS_CHOICES = [
        {'value': 'pending', 'display': 'Pending'},
        {'value': 'shipped', 'display': 'Shipped'},
        {'value': 'delivered', 'display': 'Delivered'},
        {'value': 'unsuccessful', 'display': 'Unsuccessful'},
    ]


    user = models.ForeignKey(User, on_delete = models.SET_NULL, null = True, blank = True)
    recipient = models.CharField(max_length = 50) 
    phone_number = models.CharField(max_length=11)
    state = models.CharField(max_length = 50)
    city = models.CharField(max_length = 50)
    plate = models.PositiveSmallIntegerField()
    zip_code = models.CharField(max_length = 10)
    detail_address = models.TextField()
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=13, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=13, decimal_places=2, null = True, blank = True)
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')

    @property
    def formatted_order_date(self):
        shamsi_date = jdatetime.fromgregorian(datetime=self.order_date)
        return shamsi_date.strftime("%Y/%m/%d")

    def __str__(self):
        return f"Order: {self.id}, Delivery Status: {self.order_status}"


class Transaction(AbstractBaseModel):
    """A model representing a transaction related to an order."""
    ref_id = models.IntegerField(null = True, blank = True)
    order = models.ForeignKey('Order', related_name='transactions', on_delete=models.SET_NULL, null = True, blank = True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=13, decimal_places=2,)
    description = models.TextField(null = True, blank = True)
    is_success = models.BooleanField(default=False)

    @property
    def formatted_transaction_date(self):
        shamsi_date = jdatetime.fromgregorian(datetime=self.transaction_date)
        return shamsi_date.strftime("%Y/%m/%d")

    class Meta:
        ordering = ['-transaction_date']

    def __str__(self):
        return f'Transaction ID: {self.pk} - Amount: {self.amount} - Success: {self.is_success}'


class OrderItem(AbstractBaseModel):
    """A model representing an item within an order."""
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=13, decimal_places=2)

    def __str__(self):
        return f"Order Item - Product: {self.product.title} - Quantity: {self.quantity} - Total Price: {self.total_price}"