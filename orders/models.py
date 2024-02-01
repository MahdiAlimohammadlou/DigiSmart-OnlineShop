from django.db import models
from accounts.models import User
from product.models import Product
from core.models import AbstractBaseModel

# Create your models here.
class Order(AbstractBaseModel):
    """A model representing an order with user, address, date, price, and delivery status."""

    DELIVERY_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    ]

    user = models.ForeignKey(User, on_delete = models.CASCADE)
    state = models.CharField(max_length = 50)
    city = models.CharField(max_length = 50)
    plate = models.PositiveSmallIntegerField()
    zip_code = models.CharField(max_length = 10)
    detail_address = models.TextField()
    order_date = models.DateTimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.BooleanField(default=False, verbose_name='Payment Status')
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='pending')

    @property
    def order_date_shamsi(self):
        """ Returns the order date of the discount in Shamsi (Persian) calendar format. """
        shamsi_datetime = jdatetime.fromgregorian(datetime=self.order_date)
        return shamsi_datetime.strftime('%Y/%m/%d %H:%M:%S')

    def __str__(self):
        return f"Order: {self.id}, Payment Status: {self.payment_status}, Delivery Status: {self.delivery_status}"


class Transaction(AbstractBaseModel):
    """A model representing a transaction related to an order."""
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    transaction_date = models.DateTimeField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    @property
    def transaction_date_shamsi(self):
        """ Returns the transaction date of the discount in Shamsi (Persian) calendar format. """
        shamsi_datetime = jdatetime.fromgregorian(datetime=self.transaction_date)
        return shamsi_datetime.strftime('%Y/%m/%d %H:%M:%S')

    def __str__(self):
        return f"Transaction #{self.id} - Order: {self.order.id} - Amount: {self.amount}"


class OrderItem(AbstractBaseModel):
    """A model representing an item within an order."""
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order Item - Product: {self.product.title} - Quantity: {self.quantity} - Total Price: {self.total_price}"


