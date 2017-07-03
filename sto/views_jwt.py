from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def auth_api(request):
    if request.method == 'POST':
        errors = {}
        if "password" not in request.data:
            errors["password"]=["This field is required"]
        else:
            password = str(request.data["password"])
        if "username" not in request.data:
            errors["username"]=["This field is required"]
        else:
            username = str(request.data["username"])

        token_data = {}
        if len(errors) == 0:
            try:
                user = authenticate(username=username, password=password)
                if user is None:
                    errors["non_field_errors"]=["Unable to log in with provided credentials."]
                else:
                    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
                    payload = jwt_payload_handler(user)
                    token = jwt_encode_handler(payload)
                    token_data = {"token": token}
            except Exception as e:
                errors["non_field_errors"]=["Something wrong just happened: " + str(e)]
                print(str(e))

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(token_data, status=status.HTTP_200_OK)
