# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-03 06:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sto', '0002_message_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='message',
            new_name='dialog',
        ),
    ]
