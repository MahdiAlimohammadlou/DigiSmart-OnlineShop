from rest_framework import serializers
from .models import Product, ProductImage, Category, Brand

class BaseDiscountSerializer(serializers.ModelSerializer):
    discount_percentage = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()

    class Meta:
        abstract = True

    def get_discount_percentage(self, obj):
        if obj.discount_set.exists():
            discount = obj.discount_set.first()
            return discount.percentage if discount.discount_type == 'percentage' else None
        return None

    def get_discount_amount(self, obj):
        if obj.discount_set.exists():
            discount = obj.discount_set.first()
            return discount.amount if discount.discount_type == 'amount' else None
        return None

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image',)

class ProductSerializer(BaseDiscountSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'description', 'category', 'brand', 'price', 'inventory', 'is_available', 'discount_percentage', 'discount_amount', 'images']

    def get_images(self, obj):
        images_queryset = ProductImage.objects.filter(product=obj)
        images_serializer = ProductImageSerializer(instance=images_queryset, many=True)
        return images_serializer.data


class CategorySerializer(BaseDiscountSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug', 'image', 'description', 'is_sub', 'is_parent', 'parent', 'discount_percentage', 'discount_amount']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'title', 'slug', 'image', 'description',]
