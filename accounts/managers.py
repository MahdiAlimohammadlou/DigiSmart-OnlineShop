from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, phone_number, password):
        if not phone_number:
            raise ValueError("user must have phone number")
        
        user = self.model(phone_number = phone_number)
        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_superuser(self, phone_number, password):
        user = self.create_user(phone_number, password)
        user.is_admin = True
        user.is_superuser = True
        user.is_active = True
        user.save(using = self._db)
        return user

# class UserManager(BaseUserManager):
#     def create_user(self, phone_number, email, password=None, **extra_fields):
#         if not phone_number and not email:
#             raise ValueError(_('The phone number or email field must be set'))
#         user = self.model(phone_number=phone_number, email=self.normalize_email(email), **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, phone_number, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_active', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(phone_number, email, password, **extra_fields)