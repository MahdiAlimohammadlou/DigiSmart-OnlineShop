from django.contrib import admin
from .models import Category, Brand, Product, ProductImage, Discount, DiscountCode, Comment, Banner

# Register your models here.
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Discount)
admin.site.register(DiscountCode)
admin.site.register(Comment)
admin.site.register(Banner)

