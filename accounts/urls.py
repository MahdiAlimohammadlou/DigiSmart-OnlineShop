from django.urls import path, include
from .views import (
    RegisterView,
    LoginView,
    VerifyView,
    check_user_existence,
    generate_and_store_otp,
    verify_otp,
    WelcomeView
)

app_name = 'accounts'
urlpatterns = [
    #HTML urls
    path('register/', RegisterView.as_view(), name = 'register'),
    path('login/', LoginView.as_view(), name = 'login'),
    path('verify-phone-number/', VerifyView.as_view(), name='verify'),
    path('welcome/', WelcomeView.as_view(), name='welcome'),
    #API urls
    path('check-user-existence/<str:phone_number>/', check_user_existence, name = 'check_user_existence'),
    path('generate-otp/', generate_and_store_otp, name='generate_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    # path('password-change/', ProductView.as_view(), name = 'product'),
    # path('password-forgot/', include(router.urls)),
]