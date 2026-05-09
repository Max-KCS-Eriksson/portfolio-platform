from rest_framework import serializers

from .models import PortfolioContext, Project


class PortfolioContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioContext
        fields = ("id", "intro")


class ProjectSerializer(serializers.ModelSerializer):
    tech_stack = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "repo_url",
            "live_url",
            "summary",
            "tech_stack",
            "problem",
            "solution",
            "tech_choices",
            "competencies_demonstrated",
            "slug",
            "featured",
            "display_order",
        )

    def get_tech_stack(self, project):
        technologies = []

        for technology in project.tech_stack.split(","):
            technology = technology.strip()

            if technology:
                technologies.append(technology)

        return technologies
