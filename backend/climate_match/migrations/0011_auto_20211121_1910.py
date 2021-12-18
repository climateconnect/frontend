# Generated by Django 2.2.24 on 2021-11-21 19:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('climate_match', '0010_userquestionanswer_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userquestionanswer',
            name='user',
            field=models.ForeignKey(blank=True, help_text='Points user who answered questions', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_qna', to=settings.AUTH_USER_MODEL, verbose_name='User'),
        ),
    ]
