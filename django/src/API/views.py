from django.shortcuts import render, HttpResponse, redirect

from django.conf import settings
from django.http import HttpResponseRedirect
from requests_oauthlib import OAuth2Session
import os
from API.models import Users
import hashlib
import requests
import pyotp




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
	try:
		url = 'https://api.intra.42.fr/oauth/token'
		UID = os.environ.get("UID_APP")
		SECRET = os.environ.get("SECRET_KEY_APP")
		REDIRECT_URI = os.environ.get("REDIRECT_URI")

		data = {
			'grant_type': 'authorization_code',
			'client_id':  UID,
			'client_secret': SECRET,
			'code': CODE,
			'redirect_uri': REDIRECT_URI
		}

		response = requests.post(url, data=data)
	
		return response.json()['access_token']
	except:
		raise Exception("Error get_token")

def create_user_API(code, language='en'):
	
	if Users.objects.filter(code_42=hashlib.md5(code.encode()).hexdigest()).exists():
		user = Users.objects.get(code_42=hashlib.md5(code.encode()).hexdigest())
		return user
	token = get_token(code)
	user_name ,user_email = get_username_email_API(token)
	if Users.objects.filter(username=user_name).exists():
		user = Users.objects.get(username=user_name)
		update_code_API(user, code)
		return user
	
	if Users.objects.filter(token_2FA=pyotp.random_base32()).exists():
		user = Users.objects.get(token_2FA=pyotp.random_base32())
		update_code_API(user, code)
		return user
	
	new_user = Users(
		username=user_name,
		email=user_email,
		code_42 = hashlib.md5(code.encode()).hexdigest(),
		token_2FA=pyotp.random_base32(),
		wins=0,
		losses=0,
		language=language
		)
	new_user.save()
	return new_user


def get_my_data(token):
	res = get42("/v2/me/", {}, token)
	return res

def get_username_email_API(token):
	me = get_my_data(token)
	if 'The access token is invalid' in me:
		raise Exception("Error get_username_email_API")
	return me['login'], me['email']

def update_code_API(user, code):
	user.code_42 = hashlib.md5(code.encode()).hexdigest()
	user.save()

def add_user_API(request):
	code_from_user = request.GET.get('code')
	if request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME):
		language = request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME)
	else:
		language = 'en'
	user = create_user_API(code_from_user, language)

	return user

def authenticate_42(request):
	UID = os.environ.get("UID_APP")
	authorization_base_url = 'https://api.intra.42.fr/oauth/authorize'
	REDIRECT_URI = os.environ.get("REDIRECT_URI")
	client_app = OAuth2Session(client_id=UID,  redirect_uri=REDIRECT_URI)
	authorization_url, _ = client_app.authorization_url(authorization_base_url)
	return HttpResponseRedirect(authorization_url)
 