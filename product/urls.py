from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HomeView, ProductsView, ProductView, ProductViewSet, CategoryViewSet, BrandViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'brands', BrandViewSet, basename='brand')

app_name = 'product'
urlpatterns = [
    path('', HomeView.as_view(), name = 'home'),
    path('products/', ProductsView.as_view(), name = 'products'),
    path('product/', ProductView.as_view(), name = 'product'),
    path('api/', include(router.urls)),
]
