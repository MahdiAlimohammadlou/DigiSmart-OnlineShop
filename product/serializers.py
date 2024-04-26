from rest_framework import serializers
from .models import Product, ProductImage, Category, Brand, Discount, DiscountCode

class DiscountSerializer(serializers.ModelSerializer):
    is_usable = serializers.SerializerMethodField()

    class Meta:
        model = Discount
        fields = ['percentage', 'amount', 'discount_type', 'is_usable']

    def get_is_usable(self, obj):
        """ Return True if the discount is currently usable, False otherwise. """
        return obj.is_usable

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image',)

class ProductSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    discount = DiscountSerializer()

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'description',
                 'category', 'brand', 'price', 'inventory',
                  'is_available', 'discount' , 'images']

    def get_images(self, obj):
        images_queryset = ProductImage.objects.filter(product=obj)
        images_serializer = ProductImageSerializer(instance=images_queryset, many=True)
        return images_serializer.data
    
    @staticmethod
    def setup_eager_loading(queryset):
        """ Optimize queryset by eagerly loading related fields to avoid N+1 queries. """
        queryset = queryset.select_related('category', 'brand', 'discount')
        return queryset


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug', 'image', 'description', 'is_sub', 'is_parent', 'parent',]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'title', 'slug', 'image', 'description',]


class DiscountCodeSerializer(DiscountSerializer):
    class Meta:
        model = DiscountCode
        fields = ['id', 'code', 'minimum_price', 'percentage', 'amount', 'discount_type', 'is_usable']

