# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-07-13 09:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sto', '0007_auto_20170712_1714'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='event',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sto.Event'),
        ),
    ]