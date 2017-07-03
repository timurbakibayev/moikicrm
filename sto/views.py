from django.shortcuts import render
from django.db.models import Q
from django.utils.datetime_safe import datetime
from rest_framework.decorators import api_view
from sto.serializers import EventSerializer
from sto.serializers import MessageSerializer
from sto.serializers import DialogSerializer
from sto.serializers import MasterSerializer
from sto.serializers import SubscriptionSerializer
from rest_framework.response import Response
from rest_framework import status, permissions
from sto.models import Dialog
from sto.models import Message


def index(request):
    autocomplete = []
    context = {"today": datetime.now(), "autocomplete" : autocomplete}
    return render(request, "index.html", context)


@api_view(['GET','POST'])
def dialogs_list(request):
    user = request.user
    if request.method == "GET":
        dialogs = Dialog.objects.filter(user=user)
        serializer = DialogSerializer(dialogs, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = DialogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET","PUT","DELETE"])
def dialog_detail(request, pk):
    try:
        dialog = Dialog.objects.get(pk=pk)
    except Dialog.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        serializer = DialogSerializer(dialog)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = DialogSerializer(dialog, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        if dialog.user != user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        dialog.delete()
        return  Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def messages_list(request,pk):
    try:
        dialog = Dialog.objects.get(pk=pk)
    except Dialog.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if request.method == "GET":
        messages = Message.objects.filter(dialog=dialog)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=user.id, dialog_id=dialog.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def message_detail(request, pk, msg):
    try:
        dialog = Dialog.objects.get(pk=pk)
    except Dialog.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    try:
        message = Message.objects.get(pk=msg)
    except Message.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if dialog.id != message.dialog.id:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        serializer = MessageSerializer(message)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = MessageSerializer(message, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        if message.user != user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
