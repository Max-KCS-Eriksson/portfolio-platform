from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Project
from .serializers import ProjectSerializer


def create_project(title, **field_values):
    project_values = {
        "title": title,
        "repo_url": f"https://example.com/{title.lower().replace(' ', '-')}.git",
        "summary": f"{title} summary",
        "tech_stack": "Python, Django",
        **field_values,
    }

    return Project.objects.create(**project_values)


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

    def test_project_list_includes_tech_stack(self):
        create_project("List Project", tech_stack="Python, Django, PostgreSQL")

        response = self.client.get("/api/portfolio/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data[0]["tech_stack"],
            ["Python", "Django", "PostgreSQL"],
        )

    def test_project_detail_includes_tech_stack(self):
        project = create_project("Detail Project", tech_stack="Python, Django")

        response = self.client.get(f"/api/portfolio/{project.slug}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["tech_stack"], ["Python", "Django"])
