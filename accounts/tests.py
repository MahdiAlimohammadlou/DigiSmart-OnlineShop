from django.test import TestCase
from django.utils import timezone
from .models import User, OtpCode, Address

class UserModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            "email": "test@example.com",
            "phone_number": "1234567890",
            "full_name": "Test User",
        }

    def test_create_user(self):
        user = User.objects.create(**self.user_data)
        self.assertEqual(user.email, self.user_data["email"])
        self.assertEqual(user.phone_number, self.user_data["phone_number"])
        self.assertEqual(user.full_name, self.user_data["full_name"])

    def test_user_defaults(self):
        user = User.objects.create(**self.user_data)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_admin)


class OtpCodeModelTest(TestCase):
    def setUp(self):
        self.otp_data = {
            "phone_number": "1234567890",
            "code": 1234,
        }

    def test_create_otp_code(self):
        otp = OtpCode.objects.create(**self.otp_data)
        self.assertEqual(otp.phone_number, self.otp_data["phone_number"])
        self.assertEqual(otp.code, self.otp_data["code"])


class AddressModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(email="test@example.com", phone_number="1234567890", full_name="Test User")
        self.address_data = {
            "user": self.user,
            "state": "Tehran",
            "city": "Tehran",
            "plate": 12345,
            "zip_code": "1234567890",
            "detail_address": "123 Test St.",
        }

    def test_create_address(self):
        address = Address.objects.create(**self.address_data)
        self.assertEqual(address.user, self.user)
        self.assertEqual(address.state, self.address_data["state"])
        self.assertEqual(address.city, self.address_data["city"])
        self.assertEqual(address.plate, self.address_data["plate"])
        self.assertEqual(address.zip_code, self.address_data["zip_code"])
        self.assertEqual(address.detail_address, self.address_data["detail_address"])


