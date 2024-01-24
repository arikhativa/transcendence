from django.db import models

class Users(models.Model):
    username = models.CharField(max_length=80)
    email = models.CharField(max_length=80, null=True, default=None)
    code_42 = models.CharField(max_length=80, null=True, default=None)
    token_2FA = models.CharField(max_length=80, null=True, default=None)
    jwt = models.CharField(max_length=256, null=True, default=None)
    active_2FA = models.BooleanField(default=False)
    email_2FA = models.BooleanField(default=False)
    qr_2FA = models.BooleanField(default=False)
    validated_2fa = models.BooleanField(default=False)
    bonus = models.BooleanField(default=False)
    walls = models.BooleanField(default=False)
    player_1_color = models.CharField(max_length=80, null=True, default='white')
    player_2_color = models.CharField(max_length=80, null=True, default='white')
    ball_color = models.CharField(max_length=80, null=True, default='white')
    ball_speed = models.IntegerField(default=3)
    wins = models.IntegerField()
    losses = models.IntegerField()

