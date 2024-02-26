from django.db import models
from jdatetime import datetime as jdatetime
from autoslug import AutoSlugField

class AbstractBaseModel(models.Model):
    """An abstract base model providing common fields and methods."""
    
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    deleted = models.BooleanField(default=False)

    def delete(self):
        self.deleted = True
        self.save()

    class Meta:
        abstract = True


class AbstractSlugModel(AbstractBaseModel):
    """ An abstract model representing a model with a title and auto-generated slug. """

    title = models.CharField(max_length=50)
    slug = AutoSlugField(unique=True, populate_from='title')
    description = models.TextField()

    def __str__(self):
        return self.title

    class Meta:
        abstract = True


class AbstractDiscountModel(AbstractBaseModel):
    #  """ An abstract model representing a discount with options for either percentage or amount. """

    PERCENTAGE = 'percentage'
    AMOUNT = 'amount'

    DISCOUNT_TYPES = [
        (PERCENTAGE, 'Percentage'),
        (AMOUNT, 'Amount'),
    ]

    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    # @property
    # def start_date_shamsi(self):
    #     """ Returns the start date of the discount in Shamsi (Persian) calendar format. """
    #     shamsi_datetime = jdatetime.fromgregorian(datetime=self.start_date)
    #     return shamsi_datetime.strftime('%Y/%m/%d %H:%M:%S')

    # @property
    # def end_date_shamsi(self):
    #     """ Returns the end date of the discount in Shamsi (Persian) calendar format. """
    #     shamsi_datetime = jdatetime.fromgregorian(datetime=self.end_date)
    #     return shamsi_datetime.strftime('%Y/%m/%d %H:%M:%S')

    def save(self, *args, **kwargs):
        """ Overrides the save method to validate and set the discount type. """
        if self.percentage is not None and self.amount is not None:
            raise ValueError("Only one of 'percentage' or 'amount' can be provided.")
        elif self.percentage is None and self.amount is None:
            raise ValueError("At least one of 'percentage' or 'amount' must be provided.")
        
        if self.percentage is not None:
            self.discount_type = self.PERCENTAGE
        elif self.amount is not None:
            self.discount_type = self.AMOUNT
        
        super().save(*args, **kwargs)

    class Meta:
        abstract = True