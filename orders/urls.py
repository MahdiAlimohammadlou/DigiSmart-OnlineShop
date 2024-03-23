from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CartView,
    CartEmptyView,
    CartManagerView,
)


# router = DefaultRouter()
# router.register(r'products', ProductViewSet, basename='product')
# router.register(r'categories', CategoryViewSet, basename='category')
# router.register(r'brands', BrandViewSet, basename='brand')

app_name = 'order'
urlpatterns = [
    path('cart/', CartView.as_view(), name = 'cart'),
    path('cart-empty/', CartEmptyView.as_view(), name = 'cart-empty'),
    path('cart-manager/', CartManagerView.as_view()),
    path('cart-manager/<str:username>/', CartManagerView.as_view()),
    # path('api/', include(router.urls)),
]