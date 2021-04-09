# Generated by Django 2.2.18 on 2021-04-09 04:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('climateconnect_api', '0056_auto_20210408_0541'),
        ('hubs', '0007_hub_image_attribution'),
    ]

    operations = [
        migrations.CreateModel(
            name='HubTranslation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_translation', models.CharField(blank=True, help_text='Translation of name column', max_length=1024, null=True, verbose_name='Name translation')),
                ('headline_translation', models.CharField(blank=True, help_text='Translation of headline column', max_length=1024, null=True, verbose_name='Headline translation')),
                ('sub_headline_translation', models.CharField(blank=True, help_text='Translation of sub_headline column', max_length=1024, null=True, verbose_name='Sub headline translation')),
                ('segway_text_translation', models.TextField(blank=True, help_text='Translation of segway_text column', null=True, verbose_name='Segway text translation')),
                ('image_attribution_translation', models.CharField(blank=True, help_text='Translation of image_attribution column', max_length=1024, null=True, verbose_name='Image attribution translation')),
                ('quick_info_translation', models.TextField(blank=True, help_text='Translation of quick_info column', null=True, verbose_name='Quick info translation')),
                ('stat_box_title_translation', models.CharField(blank=True, help_text='Translation of stat_box_title column', max_length=1024, null=True, verbose_name='Stat box title translation')),
                ('hub', models.ForeignKey(help_text='Points to Hub table', on_delete=django.db.models.deletion.CASCADE, related_name='translate_hub', to='hubs.Hub', verbose_name='Hub')),
                ('language', models.ForeignKey(help_text='Points to language table', on_delete=django.db.models.deletion.CASCADE, related_name='hub_translate_language', to='climateconnect_api.Language', verbose_name='Language')),
            ],
            options={
                'verbose_name': 'Hub translation',
                'verbose_name_plural': 'Hub translations',
                'unique_together': {('hub', 'language')},
            },
        ),
    ]
