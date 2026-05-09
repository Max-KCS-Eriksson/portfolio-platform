from rest_framework import serializers

from .models import Project


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
            "description",
            "slug",
        )

    def get_tech_stack(self, project):
        technologies = []

        for technology in project.tech_stack.split(","):
            technology = technology.strip()

            if technology:
                technologies.append(technology)

        return technologies
