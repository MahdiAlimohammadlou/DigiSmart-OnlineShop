from django import forms
from django.contrib import admin, messages
from .models import Category, Brand, Product, ProductImage, Discount, DiscountCode, Comment, Banner
from django.core.exceptions import ValidationError


# Register your models here.
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(DiscountCode)
admin.site.register(Comment)
admin.site.register(Banner)

class DiscountForm(forms.ModelForm):
    class Meta:
        model = Discount
        fields = '__all__'
        error_css_class = 'error'
        required_css_class = 'required'

    def clean(self):
        cleaned_data = super().clean()

        #Checking that only percentage or amount is entered
        percentage = cleaned_data.get('percentage')
        amount = cleaned_data.get('amount')

        if percentage is not None and amount is not None:
            raise forms.ValidationError("Both 'percentage' and 'amount' are provided. Only one should be provided.")
        elif percentage is None and amount is None:
            raise forms.ValidationError("Neither 'percentage' nor 'amount' is provided. At least one should be provided.")
            
        return cleaned_data

    def clean_percentage(self):
        percentage = self.cleaned_data.get('percentage')
        if percentage is not None:
            if not (1 <= percentage <= 100):
                raise ValidationError("Percentage must be an integer between 1 and 100.")
        return percentage

class DiscountModelAdmin(admin.ModelAdmin):
    form = DiscountForm

admin.site.register(Discount, DiscountModelAdmin)





