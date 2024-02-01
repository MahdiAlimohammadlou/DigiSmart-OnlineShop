from django.db import models
from core.models import AbstractBaseModel, AbstractSlugModel, AbstractDiscountModel
from accounts.models import User

# Create your models here.
class Category(AbstractSlugModel):
    """ A model representing a category with an option to be a sub-category. """

    is_sub = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete = models.CASCADE, null=True, blank=True, related_name='sub_categories')
    image = models.ImageField(upload_to = 'categories/')
    

class Brand(AbstractSlugModel):
    #  """ A model representing a brand. """
    #    
    image = models.ImageField(upload_to = 'brands/')
    

class Product(AbstractSlugModel):
    """ A model representing a product with its category, brand, image, price, and inventory. """

    category = models.ForeignKey(Category, on_delete = models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete = models.CASCADE)
    images = models.ManyToManyField('ProductImage', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    inventory = models.PositiveIntegerField()

    @property
    def is_available(self):
        """ Checks if the product is available (inventory > 0). """
        
        return self.inventory > 0

class ProductImage(AbstractBaseModel):
    image = models.ImageField(upload_to='products/')
    

class Discount(AbstractDiscountModel):
    """ A model representing a discount applicable to a product or a category. """

    product = models.ForeignKey(Product, on_delete = models.CASCADE, blank = True, null = True)
    category = models.ForeignKey(Category, on_delete = models.CASCADE, blank = True, null = True)

    def __str__(self):
        if self.product is not None:
            return f"{self.product} - {self.start_date} - {self.end_date}"
        else:
            return f"{self.category} - {self.start_date} - {self.end_date}"

    def save(self, *args, **kwargs):
        """ Overrides the save method to validate and set the product or category. """

        if self.category is None and self.product is None:
            raise ValueError("At least one of 'category' or 'product' must be provided.")
        
        super().save(*args, **kwargs)


class DiscountCode(AbstractDiscountModel):
    """ A model representing a discount code. """

    code = models.PositiveIntegerField()

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

