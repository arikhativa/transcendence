# Generated by Django 4.2.7 on 2023-11-21 19:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0002_remove_users_password'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Users',
        ),
    ]