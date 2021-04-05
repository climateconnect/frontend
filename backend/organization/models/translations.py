from django.db import models

from climateconnect_api.models.language import Language
from organization.models import (Project, Organization)


class ProjectTranslation(models.Model):
    project = models.ForeignKey(
        Project, related_name='translation_project',
        help_text="Point to project table", verbose_name="Project",
        on_delete=models.CASCADE
    )

    language = models.ForeignKey(
        Language, related_name="proj_translation_language",
        help_text="Point to languaage table", verbose_name="Language",
        on_delete=models.CASCADE
    )

    name_translation = models.CharField(
        help_text="Translation of project name",
        verbose_name="Name translation",
        max_length=1024, null=True, blank=True
    )

    short_description_translation = models.CharField(
        help_text="Translation of project's short description",
        verbose_name="Short description translation",
        max_length=240, null=True, blank=True
    )

    description_translation = models.TextField(
        help_text="Translation of project's description",
        verbose_name="Description translation",
        max_length=4800, null=True, blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True, help_text="Time when translation object was created",
        verbose_name="Created at", null=True, blank=True
    )

    updated_at = models.DateTimeField(
        auto_now=True, help_text="Time when translation object was updated",
        verbose_name="Updated at", null=True, blank=True
    )

    class Meta:
        verbose_name = "Project translation"
        verbose_name_plural = "Project translations"
        unique_together = [['project', 'language']]
    
    def __str__(self):
        return "{}: {} translation for project {}".format(
            self.id, self.language.name, self.project.name
        )


class OrganizationTranslation(models.Model):
    organization = models.ForeignKey(
        Organization, related_name="translation_org",
        help_text="Points to organization table", verbose_name="Organization",
        on_delete=models.CASCADE
    )

    language = models.ForeignKey(
        Language, related_name="org_translation_language",
        help_text="Points to language organization needed to be translated to",
        verbose_name="Language",
        on_delete=models.CASCADE
    )

    name_translation = models.CharField(
        help_text="Translation of organization name",
        verbose_name="Name translation",
        max_length=1024, null=True, blank=True
    )

    short_description_translation = models.TextField(
        help_text="Translation of short description",
        verbose_name="Short description translation",
        null=True, blank=True
    )

    school_translation = models.CharField(
        help_text="Translation of school name",
        verbose_name="School translation",
        max_length=512, null=True, blank=True
    )

    organ_translation = models.CharField(
        help_text="Translation of gov organization",
        verbose_name="Organ translation", max_length=512, null=True, blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True, help_text="Time when translation object was created",
        verbose_name="Created at", null=True, blank=True
    )

    updated_at = models.DateTimeField(
        auto_now=True, help_text="Time when translation object was updated",
        verbose_name="Updated at", null=True, blank=True
    )

    class Meta:
        verbose_name = "Organization translation"
        verbose_name_plural = "Organization translations"
        app_label = "organization"
    
    def __str__(self):
        return "{}: {} translation for organizaton {}".format(
            self.id, self.language.name, self.organization.name
        )