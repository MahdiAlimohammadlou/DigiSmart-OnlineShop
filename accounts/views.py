from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, redirect
from .models import User
from rest_framework.decorators import api_view
from rest_framework import status
import requests
import json
import redis
import string
import random
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

#api view
@api_view(['POST'])
def generate_and_store_otp(request):
    if request.method == 'POST':
        phone_number = request.data.get('phone_number')
        otp_code = ''.join(random.choices(string.digits, k=5))
        r = redis.Redis(host='localhost', port=6379, db=0)
        r.setex(phone_number, 180, otp_code)
        return Response({'status': 'successful'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def verify_otp(request):
    if request.method == 'POST':
        phone_number = request.data.get('phone_number')
        entered_otp = request.data.get('entered_otp')
        r = redis.Redis(host='localhost', port=6379, db=0)
        stored_otp = r.get(phone_number)
        if stored_otp and stored_otp.decode('utf-8') == entered_otp:
            selected_user = User.objects.get(phone_number = phone_number)
            is_new_user = False
            if User.is_active == False:
                selected_user.is_active = True
                selected_user.save()
                is_new_user = True

        #Login user
        user_tokens = get_tokens_for_user(selected_user)

        return Response({'message': 'OTP verification successful',
                        'is_new_user' : is_new_user,
                        "refresh" : user_tokens["access"],
                        "access" : user_tokens["refresh"]
                        },
                        status=status.HTTP_200_OK)
        

@api_view(['GET'])
def check_user_existence(request, phone_number):
    try:
        user = User.objects.get(phone_number=phone_number)
        return Response({'exists': True}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'exists': False}, status=status.HTTP_200_OK)

def send_otp(phone_number, otp):
    pass


# Create your views here.
#render views

class VerifyView(View):
    def get(self, request):
        return render(request, 'verify-phone-number.html')


class RegisterView(View):

    def get(self, request):
        return render(request, 'register.html')
    
    def post(self, request):
        phone_number = request.POST.get("phone-account")
        password = request.POST.get("password-account")
        password2 = request.POST.get("re-password-account")

        if not (phone_number and password and password2):
            return HttpResponseBadRequest("Missing required fields")

        create_user_url = 'http://127.0.0.1:8000/auth/users/'
        data = {
            'phone_number': phone_number,
            'password': password,
            're-password': password2
        }
        json_data = json.dumps(data)

        try:
            response = requests.post(create_user_url, data=json_data, headers={'Content-Type': 'application/json'})
            response.raise_for_status()
            return redirect(f"/account/verify-phone-number/?phone_number={phone_number}")
        except requests.exceptions.RequestException as e:
            print('Error:', e)
            return HttpResponseServerError("An error occurred while processing your request")



class LoginView(View):
    def get(self, request):
        return render(request, 'login.html')


class WelcomeView(View):
    def get(self, request):
        return render(request, 'welcome.html')

# class PasView(View):
#     def post(self, request):
#         search_input = request.POST.get("search-input", None)
#         search_type = request.POST.get("search-type", None)
#         if search_input is not None and search_input is not None:
#             return redirect(f"/products/?{search_type}={search_input}")

# class ProductView(View):
#     def get(self, request):
#         return render(request, 'product.html')


