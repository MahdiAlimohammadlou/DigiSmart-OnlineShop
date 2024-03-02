from django.shortcuts import render
from django.views import View
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, redirect
from .models import Product, Category, Brand
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer
from django.db.models import Q
from django.utils.translation import gettext as _
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


# Create your views here.
#render views
class HomeView(View):
    def get(self, request):
        return render(request, 'index.html')

class ProductsView(View):
    def get(self, request):
        return render(request, 'products.html')

class ProductsSearchView(View):
    def post(self, request):
        search_input = request.POST.get("search-input", None)
        search_type = request.POST.get("search-type", None)
        if search_input is not None and search_input is not None:
            return redirect(f"/products/?{search_type}={search_input}")

class ProductView(View):
    def get(self, request):
        return render(request, 'product.html')

#api views
class ProductViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Product.objects.all()

        title = request.query_params.get('title', None)
        if title:
            queryset = queryset.filter(Q(title__icontains=title) | Q(title__icontains=_(title)))

        category = request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(Q(category__title__icontains=category) | Q(category__title__icontains=_(category)))

        brand = request.query_params.get('brand', None)
        if brand:
            queryset = queryset.filter(Q(brand__title__icontains=brand) | Q(brand__title__icontains=_(brand)))

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Product.objects.all()
        product = get_object_or_404(queryset, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Category.objects.all()

        # Filter categories based on title, if provided in query parameters
        title = request.query_params.get('title', None)
        if title:
            queryset = queryset.filter(Q(title__icontains=title) | Q(title__icontains=_(title)))

        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Category.objects.all()
        category = get_object_or_404(queryset, pk=pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

class BrandViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Brand.objects.all()
        serializer = BrandSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Brand.objects.all()
        brand = get_object_or_404(queryset, pk=pk)
        serializer = BrandSerializer(brand)
        return Response(serializer.data)


