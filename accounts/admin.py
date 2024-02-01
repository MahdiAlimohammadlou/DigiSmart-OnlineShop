from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from .forms import UserCreationForm, UserChangeForm
from .models import User, OtpCode


# Register your models here.

@admin.register(OtpCode)
class OtpCodeAdmin(admin.ModelAdmin):
    list_display = ("phone_number", "code", "created_at")


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ("email", "phone_number", "is_admin")
    list_filter = ("is_admin",)

    fieldsets = (
        (None, {"fields":("email","phone_number", "full_name", "password")}),
        ("permisions", {"fields" : ("is_active", "is_admin", "is_superuser", "last_login", "groups")})
    )

    add_fieldsets = (
        (None, {"fields" : ("phone_number", "email", "full_name", "password1", "password2")}),
    )

    search_fields = ("email", "full_name")
    ordering = ("full_name",)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)