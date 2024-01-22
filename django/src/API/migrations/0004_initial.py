# Generated by Django 4.2.7 on 2023-11-21 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('API', '0003_delete_users'),
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=80)),
                ('email', models.CharField(default=None, max_length=80, null=True)),
                ('token_42', models.CharField(default=None, max_length=80, null=True)),
                ('token_2FA', models.CharField(default=None, max_length=80, null=True)),
                ('wins', models.IntegerField()),
                ('losses', models.IntegerField()),
            ],
        ),
    ]