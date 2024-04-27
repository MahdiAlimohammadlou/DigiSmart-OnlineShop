from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CartView, CartEmptyView, CartManagerView,
    CheckoutView, OrderViewSet, TransactionViewSet,
    OrderItemViewSet, SendRequestZarinAPIView, VerifyZarinpalAPIView,
    CheckoutSuccesssView, CheckoutFaildView
)

app_name = 'order'

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'orderitems', OrderItemViewSet, basename='orderitem')

app_name = 'order'
urlpatterns = [
    #HTML urls
    # path('cart/', CartView.as_view(), name = 'cart'),
    # path('cart-empty/', CartEmptyView.as_view(), name = 'cart-empty'),
    # path('checkout/', CheckoutView.as_view()),
    # path('success-checkout/', CheckoutSuccesssView.as_view(), name="success_checkout"),
    # path('faild-checkout/', CheckoutFaildView.as_view(), name="faild_checkout"),
    #API urls
    path('cart-manager/', CartManagerView.as_view()),
    path('cart-manager/<str:username>/', CartManagerView.as_view()),
    path('', include(router.urls)),
    path('send-to-zarinpal/', SendRequestZarinAPIView.as_view(), name='send_to_zarinpal'),
    path('verify-zarinpal/<int:order_id>', VerifyZarinpalAPIView.as_view(), name='verify_zarinpal'),
]