from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from .cart_manager import CartManager
from .models import Order, OrderItem, Transaction
from product.models import DiscountCode
from .serializers import (UserCartSerializer, OrderSerializer,
                        OrderItemSerializer, TransactionSerializer)
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from core.views import BaseViewSet
from django.conf import settings
from zeep import Client
import json
from rest_framework.serializers import ValidationError
from .tasks import send_email_task

# Create your views here.
#render views
class CartView(View):
    def get(self, request):
        return render(request, 'cart.html')

class CartEmptyView(View):
    def get(self, request):
        return render(request, 'cart-empty.html')

class CheckoutView(View):
    def get(self, request):
        return render(request, 'checkout.html')

class CheckoutSuccesssView(View):
    def get(self, request):
        return render(request, 'checkout-complate-buy.html')

class CheckoutFaildView(View):
    def get(self, request):
        return render(request, 'checkout-no-complate-buy.html')


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
        serializer = UserCartSerializer(user_cart, many = True)
        return Response(serializer.data)

    def delete(self, request, username):
        self.cart_manager.delete_cart(username)
        return Response({'message': 'Cart deleted successfully'})


class OrderViewSet(BaseViewSet):
    model = Order
    serializer_class = OrderSerializer


class TransactionViewSet(BaseViewSet):
    model = Transaction
    serializer_class = TransactionSerializer


class OrderItemViewSet(BaseViewSet):
    model = OrderItem
    serializer_class = OrderItemSerializer


#Zarinpal views
# client = Client('https://sandbox.zarinpal.com/pg/services/WebGate/wsdl')

# class SendRequestZarinAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         data = request.data
#         user = request.user
#         request.session["phone_number"] = user.phone_number
#         if "discount_code" in data:
#             request.session["discount_code"] = data.get("discount_code")
#         request.session["order_items"] = json.loads(data.get("order_items"))
#         order = Order.soft_objects.get(id = int(data.get("order_id")))
#         amount = order.total_price
        
#         if amount != None and len(str(amount))>0 :
#             if amount<10000 :
#                 return Response({'details': 'The minimum charge should be 2000 TOMAN'})
#             description = "خرید از دیجی اسمارت"
#             email = user.email
#             request.session["user_email"] = email
#             mobile = user.phone_number
#             protocol = 'https://' if request.is_secure() else 'http://'
#             domain = request.get_host()
#             CallbackURL = f"{protocol}{domain}/api/order/verify-zarinpal/{order.id}"
#             result = client.service.PaymentRequest(settings.MERCHANT, amount, description, email, mobile, CallbackURL)
#             if result.Status == 100:
#                 transaction = Transaction(order = order , amount = amount , description = description)
#                 transaction.save()
#                 request.session["transaction_id"] = transaction.id
#                 return Response({'zarinUrl': 'https://sandbox.zarinpal.com/pg/StartPay/' + str(result.Authority)},
#                                 status=200)
#             else:
#                 return Response({'Error code: ' : str(result.Status)},status=400)
#         else:
#             return Response({'details': 'Invalid input value'})


# class VerifyZarinpalAPIView(APIView):

#     def get(self, request, order_id, *args, **kwargs):
#         order = Order.soft_objects.get(id=order_id)
#         transaction = Transaction.soft_objects.get(id=request.session["transaction_id"])
#         if request.GET.get('Status') == 'OK':
#             result = client.service.PaymentVerification(settings.MERCHANT, request.GET['Authority'], order.total_price)
#             transaction.ref_id = result.RefID
#             if result.Status in [100, 101]:
#                 process_order(request, order, transaction)
#                 send_email_task("ثیت سفارش", f"سفارش شما با کد پیگیری {transaction.ref_id} ثبت شد.",
#                                      [request.session["user_email"]])
#                 del request.session["user_email"]
#                 return redirect(f'/order/success-checkout?ref_id={transaction.ref_id}&order_id={order.id}')
#             else:
#                 process_failure(request, order, transaction)
#                 send_email_task("ثبت سفارش نا موفق", "ثبت سفارش شما با خطا مواجه گردید.", [request.session["user_email"]])
#                 return redirect(f'/order/success-checkout?ref_id={transaction.ref_id}&order_id={order.id}')
#         else:
#             process_failure(request, order, transaction)
#             send_email_task("ثیت سفارش نا موفق", "ثبت سفارش شما با خطا مواجه گردید.", [request.session["user_email"]])
#             return redirect(f'/order/faild-checkout?order_id={order.id}')

# def process_order(request, order, transaction):
#     if "discount_code" in request.session:
#         code = request.session["discount_code"]
#         DiscountCode.objects.get(code=code).delete()
#         del request.session["discount_code"]

#     order_items = request.session.get("order_items", [])
#     for item_data in order_items:
#         item_data["order"] = order.id
#         order_item_serializer = OrderItemSerializer(data=item_data)
#         if order_item_serializer.is_valid():
#             order_item_serializer.save()
#         else:
#             raise ValidationError("Invalid data provided.")

#     del request.session["order_items"]

#     cart_manager = CartManager()
#     cart_manager.delete_cart(str(request.session["phone_number"]))
#     del request.session["phone_number"]

#     transaction.is_success = True
#     transaction.save()
#     del request.session["transaction_id"]

# def process_failure(request, order, transaction):
#     order.order_status = "نا موفق"
#     order.save()
#     transaction.save()
#     del request.session["transaction_id"]
