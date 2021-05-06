# Generated by Django 2.2.18 on 2021-05-06 04:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ideas', '0003_ideacomment'),
    ]

    operations = [
        migrations.AddField(
            model_name='idea',
            name='user',
            field=models.ForeignKey(blank=True, help_text='Points to user who created the idea', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='idea_user', to=settings.AUTH_USER_MODEL, verbose_name='User'),
        ),
    ]
