from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Project
from .serializers import ProjectSerializer


def create_project(title, **field_values):
    project_values = {
        "title": title,
        "repo_url": f"https://example.com/{title.lower().replace(' ', '-')}.git",
        "summary": f"{title} summary",
        "problem": f"{title} problem",
        "solution": f"{title} solution",
        "tech_choices": f"{title} tech choices",
        "competencies_demonstrated": f"{title} competencies",
        **field_values,
    }

    return Project.objects.create(**project_values)


class ProjectSerializerTest(TestCase):
    def test_serializes_project_case_study_fields(self):
        project = create_project(
            "Serialized Project",
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


# Endpoint tests exercise URL routing - omit message middleware so they do not depend
# on a locally configured SECRET_KEY.
@override_settings(
    MIDDLEWARE=[
        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
    ]
)
class ProjectViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_project_list_includes_case_study_fields(self):
        create_project(
            "List Project",
            problem="List problem",
            solution="List solution",
            tech_choices="List tech choices",
            competencies_demonstrated="List competencies",
        )

        response = self.client.get("/api/portfolio/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["problem"], "List problem")
        self.assertEqual(response.data[0]["solution"], "List solution")
        self.assertEqual(response.data[0]["tech_choices"], "List tech choices")
        self.assertEqual(
            response.data[0]["competencies_demonstrated"],
            "List competencies",
        )

    def test_project_detail_includes_case_study_fields(self):
        project = create_project(
            "Detail Project",
            problem="Detail problem",
            solution="Detail solution",
            tech_choices="Detail tech choices",
            competencies_demonstrated="Detail competencies",
        )

        response = self.client.get(f"/api/portfolio/{project.slug}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["problem"], "Detail problem")
        self.assertEqual(response.data["solution"], "Detail solution")
        self.assertEqual(response.data["tech_choices"], "Detail tech choices")
        self.assertEqual(
            response.data["competencies_demonstrated"],
            "Detail competencies",
        )
