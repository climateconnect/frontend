# Generated by Django 2.2.13 on 2021-01-17 23:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0058_projectmember_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_active',
            field=models.BooleanField(default=True, help_text='Flags if the project is still publically active or not', verbose_name='Is an Active Project'),
        ),
    ]
