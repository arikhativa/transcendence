# Generated by Django 4.2.7 on 2024-01-12 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0014_alter_users_bonus_alter_users_walls'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='bonus',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='users',
            name='walls',
            field=models.BooleanField(default=False),
        ),
    ]