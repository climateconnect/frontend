# Generated by Django 2.2.24 on 2021-12-07 18:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('climateconnect_api', '0074_donationgoal_name_de_translation'),
    ]

    operations = [
        migrations.AddField(
            model_name='badge',
            name='instantly_awarded_over_amount',
            field=models.PositiveIntegerField(blank=True, help_text="You instantly get this badge if you've donated more than this amount in your current streak", null=True, verbose_name='Instantly awarded over amount'),
        ),
    ]
