from django.db import models
from core.models import AbstractBaseModel, AbstractSlugModel
from accounts.models import User
from django.utils import timezone

# Create your models here.
class Category(AbstractSlugModel):
    """ A model representing a category with an option to be a sub-category. """

    is_sub = models.BooleanField(default=False)
    is_parent = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete = models.SET_NULL, null=True, blank=True, related_name='sub_categories')
    image = models.ImageField(upload_to = 'categories/')

    def save(self, *args, **kwargs):
        if self.parent:
            self.is_sub = True
            parent : Category = self.parent
            parent.is_parent = True
            parent.save()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.is_parent:
            self.sub_categories.all().update(is_sub=False)
        super().delete(*args, **kwargs)
    

class Brand(AbstractSlugModel):
    #  """ A model representing a brand. """
    image = models.ImageField(upload_to = 'brands/')


class Discount(AbstractBaseModel):
    """ A model representing a discount applicable to a product."""

    PERCENTAGE = 'percentage'
    AMOUNT = 'amount'

    DISCOUNT_TYPES = [
        (PERCENTAGE, 'Percentage'),
        (AMOUNT, 'Amount'),
    ]

    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    amount = models.DecimalField(max_digits=13, decimal_places=2, null=True, blank=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    @property
    def is_usable(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date

    def save(self, *args, **kwargs):
        """ Overrides the save method to validate and set the discount type. """
        if self.percentage is not None and self.amount is not None:
            raise ValueError("Only one of 'percentage' or 'amount' can be provided.")
        elif self.percentage is None and self.amount is None:
            raise ValueError("At least one of 'percentage' or 'amount' must be provided.")

        if (percentage := self.percentage) is not None:
            if not (1 <= percentage <= 100):
                raise ValueError("Percentage must be an integer between 1 and 100.")
        
        if self.percentage is not None:
            self.discount_type = self.PERCENTAGE
        elif self.amount is not None:
            self.discount_type = self.AMOUNT
        
        super().save(*args, **kwargs)


class Product(AbstractSlugModel):
    """ A model representing a product with its category, brand, image, price, and inventory. """

    category = models.ForeignKey(Category, on_delete = models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete = models.CASCADE)
    price = models.DecimalField(max_digits=13, decimal_places=2)
    inventory = models.PositiveIntegerField()
    discount = models.ForeignKey(Discount, on_delete = models.SET_NULL, null = True, blank = True)

    @property
    def is_available(self):
        """ Checks if the product is available (inventory > 0). """
        
        return self.inventory > 0

    def __str__(self):
        return f"{self.title} {self.category.title}" 
    


class ProductImage(AbstractBaseModel):
    image = models.ImageField(upload_to='products/')
    product = models.ForeignKey(Product, on_delete = models.CASCADE)

    def __str__(self):
        return self.product.title 



class DiscountCode(Discount):
    """ A model representing a discount code. """

    code = models.PositiveIntegerField()
    minimum_price = models.DecimalField(max_digits=13, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.code} - {self.created_at}"

class Comment(AbstractBaseModel):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    comment_text = models.TextField()
    like = models.PositiveIntegerField()
    dislike = models.PositiveIntegerField()

    def __str__(self):
        return self.comment_text[:10]

class Banner(AbstractBaseModel):
    title = models.CharField(max_length = 10)
    image = models.ImageField(upload_to = 'banners/')

