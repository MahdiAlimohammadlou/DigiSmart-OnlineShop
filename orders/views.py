from django.shortcuts import render
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from .cart_manager import CartManager
from .serializers import UserCartSerializer
import json

# Create your views here.
#render views
class CartView(View):
    def get(self, request):
        return render(request, 'cart.html')

class CartEmptyView(View):
    def get(self, request):
        return render(request, 'cart-empty.html')


#api views
class CartManagerView(APIView):
    def __init__(self):
        self.cart_manager = CartManager()

    def post(self, request):
        username = request.data.get('username')
        cart = request.data.get('cart')
        self.cart_manager.add_to_cart(username, cart)
        return Response({'message': 'Product added to cart successfully'})

    def get(self, request, username):
        user_cart = self.cart_manager.get_cart(username)
        serializer = UserCartSerializer(user_cart, many=True)
        return Response(serializer.data)