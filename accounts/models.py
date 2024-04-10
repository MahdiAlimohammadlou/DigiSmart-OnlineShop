from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager

from core.models import AbstractBaseModel

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model representing a user account."""

    phone_number = models.CharField(max_length=11, unique=True)
    email = models.EmailField(max_length=255, unique=True, null = True, blank = True)
    full_name = models.CharField(max_length=100, null = True, blank = True)
    is_active = models.BooleanField(default = False)
    is_admin = models.BooleanField(default=False)
    registration_time = models.DateTimeField(null = True, blank = True)

    objects = UserManager()

    USERNAME_FIELD = "phone_number"

    # def has_perm(self, perm, obj = None):
    #     return True

    # def has_module_perms(self, app_label):
    #     return True

    def __str__(self):
        return self.phone_number

    @property
    def is_staff(self):
        return self.is_admin


class Address(AbstractBaseModel):
    """Model representing a user's address."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipient = models.CharField(max_length = 50)
    phone_number = models.CharField(max_length=11)
    state = models.CharField(max_length = 50)
    city = models.CharField(max_length = 50)
    plate = models.PositiveSmallIntegerField()
    zip_code = models.CharField(max_length = 10)
    detail_address = models.TextField()

    def __str__(self):
        return f"{self.state}, {self.city}, {self.plate}, {self.zip_code}"
    
    