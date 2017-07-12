from rest_framework import serializers
from django.contrib.auth.models import Group
from django.contrib.auth.models import User
from sto.models import Dialog
from sto.models import Message
from sto.models import Event
from sto.models import Master
from sto.models import Subscription
from sto.models import Transaction


class UserSerializer(serializers.ModelSerializer):
    #blocked = serializers.SerializerMethodField("i_blocked")

    #def i_blocked(self,user):
    #    profile = Profile.objects.get(user=user)
    #    return profile.blocked

    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class DialogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dialog
        fields = ('id', 'user', 'date_time', 'text', 'city', 'brand', 'model', 'year')
        read_only_fields = ("id", "user")


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'user', 'dialog_id', 'date_time', 'text', 'url')
        read_only_fields = ("id", "user", "dialog_id")


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ('id', 'user', 'text')
        read_only_fields = ("id", "user")


class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Master
        fields = ('id', 'user', 'name')
        read_only_fields = ("id", "user")


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'user', 'master_id', 'date_time_from', 'date_time_to', 'text', 'price', 'dialog_id')
        read_only_fields = ("id", "user")


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'user', 'master_id', 'date_time', 'text', 'amount')
        read_only_fields = ("id", "user")
