# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-07-13 11:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sto', '0009_event_transaction_created'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'ordering': ['date_time_from']},
        ),
        migrations.AlterModelOptions(
            name='transaction',
            options={'ordering': ['date_time']},
        ),
    ]
