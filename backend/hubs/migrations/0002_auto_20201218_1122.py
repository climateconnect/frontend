# Generated by Django 2.2.13 on 2020-12-18 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hubs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='hub',
            name='segway_text',
            field=models.CharField(blank=True, help_text='Segway text between the info and the solutions', max_length=1024, null=True, unique=True, verbose_name='Segway text'),
        ),
        migrations.AddField(
            model_name='hub',
            name='sub_headline',
            field=models.CharField(blank=True, help_text='Sub headline', max_length=1024, null=True, unique=True, verbose_name='Sub headline'),
        ),
        migrations.AddField(
            model_name='hubstat',
            name='source_link',
            field=models.CharField(blank=True, help_text='Link to the source of the stat', max_length=1024, null=True, verbose_name='Source link'),
        ),
        migrations.AddField(
            model_name='hubstat',
            name='source_name',
            field=models.CharField(blank=True, help_text='Name of the source', max_length=1024, null=True, verbose_name='Source Name'),
        ),
        migrations.AlterField(
            model_name='hub',
            name='headline',
            field=models.CharField(blank=True, help_text='Headline', max_length=1024, null=True, unique=True, verbose_name='headline'),
        ),
        migrations.AlterField(
            model_name='hub',
            name='quick_info',
            field=models.TextField(help_text='Text that is shown when the hub info is not expanded', verbose_name='Quick info about the hub (non-expanded text)'),
        ),
        migrations.AlterField(
            model_name='hubstat',
            name='description',
            field=models.CharField(blank=True, help_text='Description that is shown in the stat box', max_length=1024, null=True, verbose_name='Stat box description'),
        ),
        migrations.AlterField(
            model_name='hubstat',
            name='value',
            field=models.CharField(blank=True, help_text="Value of the stat that is being highlighted in the stat box (e.g. '75%')", max_length=128, null=True, verbose_name='Stat Value'),
        ),
    ]
