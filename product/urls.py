from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HomeView,ProductsView,ProductView,ProductsSearchAPIView,ProductViewSet,
    CategoryViewSet,DiscountCodeAPIView,BrandViewSet,
)

app_name = 'product'

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'brands', BrandViewSet, basename='brand')

urlpatterns = [
    path('', HomeView.as_view(), name = 'home'),
    path('products/', ProductsView.as_view(), name = 'products'),
    path('products-search/', ProductsSearchAPIView.as_view(), name = 'products_search'),
    path('product/', ProductView.as_view(), name = 'product'),
    path('discount-codes/', DiscountCodeAPIView.as_view(), name='discount-codes'),
    path('api/', include(router.urls)),
]
