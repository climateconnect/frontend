# Generated by Django 2.2.24 on 2022-01-23 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('climateconnect_api', '0079_userprofile_email_on_new_post_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='email_on_new_project_update_post',
            field=models.BooleanField(blank=True, default=True, help_text='Check if user wants to receive emails when somebody posts an update to their project or a project they follow', null=True, verbose_name='Email on new post'),
        ),
    ]