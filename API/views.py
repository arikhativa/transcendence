from django.shortcuts import render, HttpResponse, redirect

from django.http import HttpResponseRedirect
from requests_oauthlib import OAuth2Session
import os
from API.models import Users
import hashlib
import requests
from twofa.views import twofa

def authenticate_42(request):
	UID = os.environ.get("UID_APP")
	authorization_base_url = 'https://api.intra.42.fr/oauth/authorize'
	client_app = OAuth2Session(client_id=UID,  redirect_uri=request.build_absolute_uri('/twofa'))
	authorization_url, _ = client_app.authorization_url(authorization_base_url)
	return HttpResponseRedirect(authorization_url)
 