# Generated by Django 5.0.1 on 2024-04-10 01:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0012_order_discount_amount_alter_transaction_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='ref_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
