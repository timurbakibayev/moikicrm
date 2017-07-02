from rest_framework import serializers
from django.contrib.auth.models import Group
from django.contrib.auth.models import User
from main.models import Dialog
from main.models import Message
from main.models import Event
from main.models import Master
from main.models import Subscription


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


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'user', 'date_time', 'text', 'url')


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ('id', 'user', 'text')


class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ('id', 'user', 'name')


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'user', 'date_time_from', 'date_time_to', 'text', 'price', 'dialog_id')
