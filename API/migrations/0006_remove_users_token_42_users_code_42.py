# Generated by Django 4.2.7 on 2023-11-22 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0005_users_active_2fa'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='token_42',
        ),
        migrations.AddField(
            model_name='users',
            name='code_42',
            field=models.CharField(default=None, max_length=80, null=True),
        ),
    ]
