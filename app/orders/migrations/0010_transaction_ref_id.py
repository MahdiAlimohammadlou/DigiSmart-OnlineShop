# Generated by Django 5.0.1 on 2024-04-09 23:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0009_alter_transaction_transaction_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='ref_id',
            field=models.CharField(default='12345678', max_length=10),
            preserve_default=False,
        ),
    ]