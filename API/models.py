from django.db import models

class Users(models.Model):
    username = models.CharField(max_length=80)
    email = models.CharField(max_length=80, null=True, default=None)
    token_42 = models.CharField(max_length=80, null=True, default=None)
    token_2FA = models.CharField(max_length=80, null=True, default=None)
    wins = models.IntegerField()
    losses = models.IntegerField()
