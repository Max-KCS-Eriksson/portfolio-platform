from rest_framework import serializers

from .models import About, SocialMediaLink


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ("id", "text")


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ("id", "social_media", "url")
