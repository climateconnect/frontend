# Generated by Django 3.2.23 on 2024-11-26 16:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hubs', '0025_hubtheme_hub_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hubtheme',
            old_name='hub_type',
            new_name='mode',
        ),
    ]