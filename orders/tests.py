from django.test import TestCase
from accounts.models import User
from product.models import Product, Category, Brand
from django.utils import timezone
from jdatetime import datetime as jdatetime
from .models import Order, OrderItem, Transaction

class OrderModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            phone_number='1234567890',
            full_name='John Doe',
            is_active=True,
            is_admin=False
        )
        self.order = Order.objects.create(user=self.user, state='test_state', city='test_city', plate=12345, zip_code='12345', detail_address='Test Address', order_date=timezone.now(), total_price=100, order_status='pending')

    def test_order_creation(self):
        self.assertEqual(self.order.user, self.user)
        self.assertEqual(self.order.state, 'test_state')
        self.assertEqual(self.order.city, 'test_city')
        self.assertEqual(self.order.plate, 12345)
        self.assertEqual(self.order.zip_code, '12345')
        self.assertEqual(self.order.detail_address, 'Test Address')
        self.assertEqual(self.order.total_price, 100)
        self.assertEqual(self.order.order_status, 'pending')

    # def test_order_date_shamsi(self):
    #     shamsi_date = jdatetime.fromgregorian(datetime=self.order.order_date).strftime('%Y/%m/%d %H:%M:%S')
    #     self.assertEqual(self.order.order_date_shamsi, shamsi_date)


class TransactionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            phone_number='1234567890',
            full_name='John Doe',
            is_active=True,
            is_admin=False
        )
        self.order = Order.objects.create(user=self.user, state='test_state', city='test_city', plate=12345, zip_code='12345', detail_address='Test Address', order_date=timezone.now(), total_price=100, order_status='pending')
        self.transaction = Transaction.objects.create(order=self.order, transaction_date=timezone.now(), amount=50, description='Test Transaction')

    def test_transaction_creation(self):
        self.assertEqual(self.transaction.order, self.order)
        self.assertEqual(self.transaction.amount, 50)
        self.assertEqual(self.transaction.description, 'Test Transaction')

    # def test_transaction_date_shamsi(self):
    #     shamsi_date = jdatetime.fromgregorian(datetime=self.transaction.transaction_date).strftime('%Y/%m/%d %H:%M:%S')
    #     self.assertEqual(self.transaction.transaction_date_shamsi, shamsi_date)


class OrderItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            phone_number='1234567890',
            full_name='John Doe',
            is_active=True,
            is_admin=False
        )
        category = Category.objects.create(title='Test Category', description='This is a test category')
        brand = Brand.objects.create(title='Test Brand', description='This is a test brand')
        self.product = Product.objects.create(title='Test Product', description='This is a test product', category=category, brand=brand, price=10.0, inventory=100)
        self.order = Order.objects.create(user=self.user, state='test_state', city='test_city', plate=12345, zip_code='12345', detail_address='Test Address', order_date=timezone.now(), total_price=100, order_status='pending')
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=2, total_price=200)

    def test_order_item_creation(self):
        self.assertEqual(self.order_item.order, self.order)
        self.assertEqual(self.order_item.product, self.product)
        self.assertEqual(self.order_item.quantity, 2)
        self.assertEqual(self.order_item.total_price, 200)
