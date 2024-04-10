from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    VerifyView,
    check_user_existence,
    generate_and_store_otp,
    verify_otp,
    OtpLoginView,
    WelcomeView,
    AddressView,
    AddressEditView,
    AddressViewSet
)

app_name = 'accounts'

router = DefaultRouter()
router.register(r'address', AddressViewSet, basename='address')


urlpatterns = [
    #HTML urls
    path('register/', RegisterView.as_view(), name = 'register'),
    path('login/', LoginView.as_view(), name = 'login'),
    path('verify-phone-number/', VerifyView.as_view(), name='verify'),
    path('welcome/', WelcomeView.as_view(), name='welcome'),
    path('otp-login/', OtpLoginView.as_view()),
    path('profile-address/', AddressView.as_view()),
    path('profile-address-edit/', AddressEditView.as_view()),
    #API urls
    path('check-user-existence/<str:phone_number>/', check_user_existence, name = 'check_user_existence'),
    path('generate-otp/', generate_and_store_otp, name='generate_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('api/', include(router.urls)),
    # path('password-change/', ProductView.as_view(), name = 'product'),
]