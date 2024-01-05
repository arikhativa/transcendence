from django.http import HttpResponse
from twofa.views import validate_user

def auth(get_response):

    def middleware(request):
        MATCH = ["/", "/metrics", "/API/authenticate_42", "/validate_2fa_code/", "/set-language/fr/", "/set-language/en/", 
                 "/set-language/es/", "/set-language/he/", "/logout"]
        START_WITH = ["/twofa"]

        if request.path in MATCH or any(request.path.startswith(s) for s in START_WITH):
            return get_response(request)
        if not validate_user(request):
            return HttpResponse('Unauthorized', status=401)
        else:
            return get_response(request)
    return middleware