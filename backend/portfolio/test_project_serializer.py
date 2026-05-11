from django.test import TestCase

from .serializers import ProjectSerializer
from .testing import create_project


class ProjectSerializerTest(TestCase):
    def test_serializes_comma_separated_tech_stack_as_list(self):
        project = create_project(
            "Serialized Project",
            tech_stack="Python, Django, , PostgreSQL , Docker, ",
        )

        project_data = ProjectSerializer(project).data

        self.assertEqual(
            project_data["tech_stack"],
            ["Python", "Django", "PostgreSQL", "Docker"],
        )

    def test_serializes_project_case_study_fields(self):
        project = create_project(
            "Case Study Project",
            problem="Problem statement",
            solution="What was built",
            tech_choices="Technical choices",
            competencies_demonstrated="Competencies demonstrated",
        )

        project_data = ProjectSerializer(project).data

        self.assertEqual(project_data["problem"], "Problem statement")
        self.assertEqual(project_data["solution"], "What was built")
        self.assertEqual(project_data["tech_choices"], "Technical choices")
        self.assertEqual(
            project_data["competencies_demonstrated"],
            "Competencies demonstrated",
        )

    def test_serializes_project_thumbnail_fields(self):
        project = create_project(
            "Thumbnail Project",
            thumbnail="portfolio/resources/upload/thumbnails/project.png",
            thumbnail_caption="Project thumbnail caption.",
        )

        project_data = ProjectSerializer(project).data

        self.assertEqual(
            project_data["thumbnail"],
            "/media/portfolio/resources/upload/thumbnails/project.png",
        )
        self.assertEqual(project_data["thumbnail_caption"], "Project thumbnail caption.")

    def test_serializes_project_card_icon_field(self):
        project = create_project(
            "Card Icon Project",
            card_icon="portfolio/resources/upload/icons/projects/project-icon.png",
        )

        project_data = ProjectSerializer(project).data

        self.assertEqual(
            project_data["card_icon"],
            "/media/portfolio/resources/upload/icons/projects/project-icon.png",
        )
