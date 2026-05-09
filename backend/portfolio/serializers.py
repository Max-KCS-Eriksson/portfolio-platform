from rest_framework import serializers

from .models import PortfolioContext, Project


class PortfolioContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioContext
        fields = ("id", "intro")


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
        )
