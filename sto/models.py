from django.db import models
from django.contrib.auth.models import User
from django.utils.datetime_safe import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.datetime_safe import date


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    blocked = models.BooleanField(default=False)

    def __str__(self):
        return "profile for " + self.user.username


class Dialog(models.Model):
    user = models.ForeignKey(User)
    date_time = models.DateTimeField(auto_now=True)
    city = models.TextField(max_length=100)
    brand = models.TextField(max_length=100, null=True, blank=True)
    model = models.TextField(max_length=100, null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)
    text = models.TextField(max_length=1000)

    def __str__(self):
        return str(self.date_time)+": "+self.text

    class Meta:
        ordering = ["date_time"]


class Message(models.Model):
    user = models.ForeignKey(User)
    dialog = models.ForeignKey(Dialog)
    date_time = models.DateTimeField(auto_now=True)
    text = models.TextField(max_length=10000)
    url = models.TextField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return self.user.username+": "+self.text


class Subscription(models.Model):
    user = models.ForeignKey(User)
    text = models.TextField(max_length=100)


class Master(models.Model):
    user = models.ForeignKey(User)
    name = models.TextField(max_length=100)


class Event(models.Model):
    user = models.ForeignKey(User)
    date_time_from = models.DateTimeField()
    date_time_to = models.DateTimeField()
    text = models.TextField(max_length=1000)
    price = models.IntegerField(null=True, blank=True)
    dialog_id = models.IntegerField(null=True, blank=True)
