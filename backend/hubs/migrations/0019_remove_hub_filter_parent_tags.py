# Generated by Django 3.2.23 on 2024-10-19 11:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hubs', '0018_auto_20240920_1503'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hub',
            name='filter_parent_tags',
        ),
    ]
