from django.http import HttpResponse
from twofa.views import validate_user

def auth(get_response):

    def middleware(request):
        if request.path == "/" or request.path == "/metrics" or request.path == "/API/authenticate_42" or request.path.startswith("/static") or request.path.startswith("/twofa"):
            return get_response(request)
        if not validate_user(request):
            return HttpResponse('Unauthorized', status=401)
        else:
            return get_response(request)

    return middleware