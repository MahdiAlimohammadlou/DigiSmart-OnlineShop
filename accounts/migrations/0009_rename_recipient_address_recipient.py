# Generated by Django 5.0.1 on 2024-04-09 22:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_alter_user_registration_time'),
    ]

    operations = [
        migrations.RenameField(
            model_name='address',
            old_name='Recipient',
            new_name='recipient',
        ),
    ]