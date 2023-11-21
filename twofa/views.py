from django.shortcuts import render, HttpResponse

# Create your views here.
from API.models import Users
from API.views import add_user_API



def twofa(request):
	try:
		#add user to db and return user of type Users
		user = add_user_API(request)
		#TODO twofa
		return HttpResponse(f"Hello {user.username} , email {user.email}!")
	except Exception as exc:
		return HttpResponse(exc)
