# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-15 02:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sto', '0012_auto_20170715_0807'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='date_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
