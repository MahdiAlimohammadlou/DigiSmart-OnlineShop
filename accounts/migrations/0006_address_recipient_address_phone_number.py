# Generated by Django 5.0.1 on 2024-04-07 17:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_user_email_alter_user_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='Recipient',
            field=models.CharField(default='Mahdi', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='address',
            name='phone_number',
            field=models.CharField(default='09057939426', max_length=11),
            preserve_default=False,
        ),
    ]
