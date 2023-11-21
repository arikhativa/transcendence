from django.shortcuts import render, HttpResponse, redirect

from django.http import HttpResponseRedirect
from requests_oauthlib import OAuth2Session
import os
from API.models import Users
import hashlib
import requests


def post42(url, payload):
	url = "https://api.intra.42.fr" + url
	payload = payload
	headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	response = requests.request("POST", url, headers=headers, data=payload)
	return response.json()

def get42(url, payload, token):
	url = "https://api.intra.42.fr" + url
	payload = payload
	headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': f'Bearer {token}'
	}
	response = requests.request("GET", url, headers=headers, data=payload)
	return response.json()

def get_token(CODE):
	url = 'https://api.intra.42.fr/oauth/token'
	UID = os.environ.get("UID_APP")
	SECRET = os.environ.get("SECRET_KEY_APP")


	data = {
		'grant_type': 'authorization_code',
		'client_id':  UID,
		'client_secret': SECRET,
		'code': CODE,
		'redirect_uri': 'http://localhost:8000/twofa'
	}

	response = requests.post(url, data=data)
	return response.json()['access_token']


def create_user_API(code):
	token = get_token(code)
	if Users.objects.filter(token_42=hashlib.md5(token.encode()).hexdigest()).exists():
		user = Users.objects.get(token_42=hashlib.md5(token.encode()).hexdigest())
		return (user)

def add_user_API(request):
	code_from_user = request.GET.get('code')
	user = create_user_API(code_from_user)
	return user

def authenticate_42(request):
	UID = os.environ.get("UID_APP")
	authorization_base_url = 'https://api.intra.42.fr/oauth/authorize'
	client_app = OAuth2Session(client_id=UID,  redirect_uri=request.build_absolute_uri('/twofa'))
	authorization_url, _ = client_app.authorization_url(authorization_base_url)
	return HttpResponseRedirect(authorization_url)
 