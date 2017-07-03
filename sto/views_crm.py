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
from sto.models import Event
from sto.models import Master



@api_view(['GET','POST'])
def masters_list(request):
    user = request.user
    if request.method == "GET":
        masters = Master.objects.filter(user=user)
        serializer = MasterSerializer(masters, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = MasterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET","PUT","DELETE"])
def master_detail(request, pk):
    try:
        master = Master.objects.get(pk=pk)
    except Master.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if user is None or master.user != user:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        serializer = MasterSerializer(master)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = MasterSerializer(master, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        if master.user != user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        master.delete()
        return  Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def events_list(request):
    user = request.user
    events = Event.objects.filter(user=user)

    if request.method == "GET":
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=user.id, master_id=request.data["master_id"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def event_detail(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        serializer = EventSerializer(event)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
