from django.db import models

class Users(models.Model):
    username = models.CharField(max_length=80)
    email = models.CharField(max_length=80, null=True, default=None)
    phone = models.CharField(max_length=17, null=True, default=None)
    code_42 = models.CharField(max_length=80, null=True, default=None)
    token_2FA = models.CharField(max_length=80, null=True, default=None)
    jwt = models.CharField(max_length=256, null=True, default=None)
    active_2FA = models.BooleanField(default=False)
    email_2FA = models.BooleanField(default=False)
    qr_2FA = models.BooleanField(default=False)
    sms_2FA = models.BooleanField(default=False)
    wins = models.IntegerField()
    losses = models.IntegerField()
