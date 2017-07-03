from django.contrib import admin
from sto.models import Dialog
from sto.models import Message
from sto.models import Master
from sto.models import Event
from sto.models import Profile


admin.site.register(Dialog)
admin.site.register(Message)
admin.site.register(Master)
admin.site.register(Event)
admin.site.register(Profile)