# Generated by Django 4.2.7 on 2024-01-12 21:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0016_users_player_1_color_users_player_2_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='player_1_color',
            field=models.CharField(default='white', max_length=80, null=True),
        ),
        migrations.AlterField(
            model_name='users',
            name='player_2_color',
            field=models.CharField(default='white', max_length=80, null=True),
        ),
    ]
