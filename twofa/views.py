from django.shortcuts import render, HttpResponse

# Create your views here.
import hashlib
import requests
from API.models import Users
import os

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



def twofa(request):
	try:
		#add user to db
		code_from_user = request.GET.get('code')
		user = create_user_API(code_from_user)
		#TODO twofa
		return HttpResponse(f"Hello {user.username} , email {user.email}!")
	except Exception as exc:
		return HttpResponse(exc)
