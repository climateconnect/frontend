from climateconnect_api.models.content_shares import ContentShares
from organization.models.project import Project
from organization.models.organization import Organization
from ideas.models.ideas import Idea
from rest_framework import status
from rest_framework.response import Response

def save_content_shared(request, sharedObject):
    if 'shared_via' not in request.data:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if request.user.is_authenticated:
        user2 = request.user
    else:
        user2 = None

    if isinstance(sharedObject, Project):
        ContentShares.objects.create(user=user2, project=sharedObject, shared_via=request.data['shared_via'])
    elif isinstance(sharedObject, Organization):
        ContentShares.objects.create(user=user2, organization=sharedObject, shared_via=request.data['shared_via'])
    elif isinstance(sharedObject, Idea):
        ContentShares.objects.create(user=user2, idea=sharedObject, shared_via=request.data['shared_via'])