from django.shortcuts import render
from django.views import View
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, redirect
from .models import Product, Category, Brand, DiscountCode
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer, DiscountCodeSerializer
from django.db.models import Q
from django.utils.translation import gettext as _
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from django.http import JsonResponse


# Create your views here.
#render views
class HomeView(View):
    def get(self, request):
        return render(request, 'index.html')

class ProductsView(View):
    def get(self, request):
        return render(request, 'products.html')

class ProductView(View):
    def get(self, request):
        return render(request, 'product.html')

#api views

class ProductsSearchAPIView(APIView):
    def post(self, request):
        search_input = request.data.get("search-input")
        search_type = request.data.get("search-type")
        
        if search_input is not None and search_type is not None:
            redirect_url = f"/products/?{search_type}={search_input}"
            return Response({"redirect_url": redirect_url})
        else:
            return Response({"error": "Missing search-input or search-type parameters"}, status=status.HTTP_400_BAD_REQUEST)


class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Product.soft_objects.filter(inventory__gte=1)

        title = request.query_params.get('title', None)
        if title:
            queryset = queryset.filter(Q(title__icontains=title) | Q(title__icontains=_(title)))

        category = request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(Q(category__title__icontains=category) | Q(category__title__icontains=_(category)))

        brand = request.query_params.get('brand', None)
        if brand:
            queryset = queryset.filter(Q(brand__title__icontains=brand) | Q(brand__title__icontains=_(brand)))

        paginator = ProductPagination()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = ProductSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Product.soft_objects.filter(inventory__gte=1)
        product = get_object_or_404(queryset, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Category.soft_objects.all()

        # Filter categories based on title, if provided in query parameters
        title = request.query_params.get('title', None)
        if title:
            queryset = queryset.filter(Q(title__icontains=title) | Q(title__icontains=_(title)))

        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Category.soft_objects.all()
        category = get_object_or_404(queryset, pk=pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

class BrandViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Brand.soft_objects.all()
        serializer = BrandSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Brand.soft_objects.all()
        brand = get_object_or_404(queryset, pk=pk)
        serializer = BrandSerializer(brand)
        return Response(serializer.data)



class DiscountCodeAPIView(APIView):
    def delete(self, request, format=None):
        code = request.data.get('code')
        try:
            discount_code = DiscountCode.objects.get(code=code)
            discount_code.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except DiscountCode.DoesNotExist:
            return Response({"error": "Discount code not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        code = request.data.get('code')
        try:
            discount_code = DiscountCode.objects.get(code=code)
            serializer = DiscountCodeSerializer(discount_code)
            return Response(serializer.data)
        except DiscountCode.DoesNotExist:
            return Response({"error": "Discount code not found"}, status=status.HTTP_404_NOT_FOUND)



