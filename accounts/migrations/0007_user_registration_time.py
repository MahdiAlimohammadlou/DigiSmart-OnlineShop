# Generated by Django 5.0.1 on 2024-04-07 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_address_recipient_address_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='registration_time',
            field=models.DateTimeField(default='2020-03-25 01:49:44.60101'),
            preserve_default=False,
        ),
    ]