from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework_jwt.settings import api_settings

from main.serializers import UserSerializer
from django.contrib.auth.models import User
from django.utils.deprecation import MiddlewareMixin


class DisableCsrfCheck(MiddlewareMixin):
    def process_request(self, req):
        attr = '_dont_enforce_csrf_checks'
        if not getattr(req, attr, False):
            setattr(req, attr, True)


def request_post_errors(request):
    err = {}
    if "password" in request.data:
        if not isinstance(request.data["password"], str) or len(request.data["password"]) < 8:
            err["password"] = ["Password should be a string with minimum length 8"]
    return err


# @authentication_classes([])
# @csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([])
@method_decorator(csrf_exempt, name='dispatch')
def user_list(request):
    if request.method == 'GET':
        return Response({"detail": "Authentication failed/Not implemented"}, status=status.HTTP_401_UNAUTHORIZED)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            errors = request_post_errors(request)
            if "email" not in request.data or len(request.data["email"]) == 0:
                errors["email"] = ["Field is required"]
            if len(errors) > 0:
                return Response(data=errors,
                                status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            user = User.objects.filter(username=request.data["username"])[0]
            if "password" in request.data:
                user.set_password(request.data["password"])
                user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user1 = request.user
    if user1 is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if user != user1:
        return Response({"detail": "You are not allowed to view/change another user"}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

