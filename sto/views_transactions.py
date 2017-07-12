from django.shortcuts import render
from django.db.models import Q
from django.utils.datetime_safe import datetime
from rest_framework.decorators import api_view
from sto.serializers import TransactionSerializer
from rest_framework.response import Response
from rest_framework import status, permissions
from sto.models import Transaction


@api_view(["GET", "POST"])
def transaction_list(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user)

    if request.method == "GET":
        if request.GET.get("start"):
            date_from = request.GET.get("start").strip()
            transactions = transactions.filter(date_time__gte=date_from)
        if request.GET.get("end"):
            date_till = request.GET.get("end").strip()
            transactions = transactions.filter(date_time__lte=date_till)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=user.id, master_id=request.data["master_id"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def transaction_detail(request, pk):
    try:
        transaction = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = TransactionSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
