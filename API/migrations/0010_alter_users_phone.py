# Generated by Django 4.2.7 on 2023-12-03 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0009_users_email_2fa_users_phone_users_qr_2fa_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='phone',
            field=models.CharField(default=None, max_length=17, null=True),
        ),
    ]
