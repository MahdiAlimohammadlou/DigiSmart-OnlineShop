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
    #HTML urls
    # path('', HomeView.as_view(), name = 'home'),
    # path('products/', ProductsView.as_view(), name = 'products'),
    # path('product/', ProductView.as_view(), name = 'product'),

    #API urls
    path('products-search/', ProductsSearchAPIView.as_view(), name = 'products_search'),
    path('discount-codes/', DiscountCodeAPIView.as_view(), name='discount-codes'),
    path('', include(router.urls)),
]
