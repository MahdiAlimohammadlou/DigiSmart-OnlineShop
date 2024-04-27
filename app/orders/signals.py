from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OrderItem


@receiver(post_save, sender=OrderItem)
def update_product_inventory(sender, instance, created, **kwargs):
    if created:
        instance.product.inventory -= instance.quantity
        instance.product.save()
