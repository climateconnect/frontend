# Generated by Django 2.2.11 on 2020-06-17 07:55

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0019_auto_20200616_1244'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projecttagging',
            name='additional_info',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True),
        ),
    ]
