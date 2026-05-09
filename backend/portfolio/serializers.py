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
            "problem",
            "solution",
            "tech_choices",
            "competencies_demonstrated",
            "slug",
        )
