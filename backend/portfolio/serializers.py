from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "repo_url",
            "live_url",
            "summary",
            "description",
            "slug",
            "featured",
            "display_order",
        )
