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
