from rest_framework import serializers

from climateconnect_main.utility.general import get_image_from_data_url
from location.utility import get_location
from ideas.models import Idea, IdeaSupporter


class IdeaSupportedMinimalSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = IdeaSupporter
        fields = ['name']
    
    def get_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}'


class IdeaMinimalSerializer(serializers.ModelSerializer):
    hub_image = serializers.SerializerMethodField()
    ratings = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = [
            'id', 'name', 'url_slug', 'short_description', 
            'thumbnail_image', 'hub_image', 'ratings', 'image'
        ]

    def get_hub_image(self, obj):
        if obj.hub and obj.hub.icon:
            return obj.hub.icon
        
        return None
    
    def get_ratings(self, obj):
        total_average = 0
        if obj.rating_idea.count() > 0:
            total_average = sum(
                idea_rating.rating for idea_rating in obj.rating_idea.all()
            ) //  obj.rating_idea.count()

        return total_average


class IdeaSerializer(serializers.ModelSerializer):
    supported_by_users = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    hub_image = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = (
            'id', 'name', 'hub_image', 'image', 'short_description',
            'supported_by_users', 'thumbnail_image',
            'user', 'url_slug'
        )
    
    def get_hub_image(self, obj):
        if obj.hub and obj.hub.icon:
            return obj.hub.icon
        
        return None

    def get_user(self, obj):
        thumbnail_image = obj.user.user_profile.thumbnail_image
        return {
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'image': None if not thumbnail_image else thumbnail_image
        }
    
    def get_supported_by_users(self, obj):
        return {
            'total': obj.supported_idea.count(),
            'users': IdeaSupportedMinimalSerializer(
                obj.supported_idea.all(), many=True
            ).data
        }
    
    def create(self, validated_date):
        return Idea(**validated_date)

    def update(self, instance, validated_data):
        name = validated_data.get('name')
        short_description = validated_data.get('short_description')
        image_url = validated_data.get('image', None)
        thumbnail_image_url = validated_data.get('thumbnail_image', None)
        loc = validated_data.get('loc', None)
        
        if name and instance.name != name:
            instance.name = name
        
        if short_description and instance.short_description != short_description:
            instance.short_description = short_description

        if image_url is not None:
            image = get_image_from_data_url(image_url)[0]
            instance.image = image
        
        if thumbnail_image_url:
            thumbnail_image = get_image_from_data_url(thumbnail_image_url)[0]
            instance.thumbnail_image = thumbnail_image

        if loc:
            instance.location = get_location(loc)

        instance.save()
        return instance
