# Generated by Django 5.0.1 on 2024-04-09 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0010_transaction_ref_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='ref_id',
            field=models.IntegerField(),
        ),
    ]
