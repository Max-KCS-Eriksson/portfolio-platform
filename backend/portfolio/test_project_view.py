from django.test import TestCase
from rest_framework.test import APIRequestFactory

from .models import Project
from .testing import create_project
from .views import ProjectDetailView, ProjectsListView


class ProjectListViewTest(TestCase):
    def setUp(self):
        self.view = ProjectsListView.as_view()
        self.request_factory = APIRequestFactory()

    def get_projects(self, path):
        request = self.request_factory.get(path)
        return self.view(request)

    def test_returns_public_projects(self):
        public_project = create_project("Public Project")
        private_project = create_project("Private Project", public=False)

        response = self.get_projects("/api/portfolio/")
        returned_project_ids = [project["id"] for project in response.data]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(returned_project_ids, [public_project.id])
        self.assertNotIn(private_project.id, returned_project_ids)

    def test_filters_featured_projects(self):
        featured_project = create_project("Featured Project", featured=True)
        non_featured_project = create_project("Non-featured Project", featured=False)

        response = self.get_projects("/api/portfolio/?featured=true")
        returned_project_ids = [project["id"] for project in response.data]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(returned_project_ids, [featured_project.id])
        self.assertNotIn(non_featured_project.id, returned_project_ids)

    def test_filters_non_featured_projects(self):
        featured_project = create_project("Featured Project", featured=True)
        other_project = create_project("Other Project")

        response = self.get_projects("/api/portfolio/?featured=false")
        returned_project_ids = [project["id"] for project in response.data]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(returned_project_ids, [other_project.id])
        self.assertNotIn(featured_project.id, returned_project_ids)

    def test_list_response_serializes_frontend_project_fields(self):
        project = create_project(
            "API Project",
            featured=True,
            status=Project.Status.BETA,
            display_order=3,
            live_url="https://example.com/live",
            tech_stack="Python, Django, PostgreSQL",
            problem="API project problem",
            solution="API project solution",
            tech_choices="API project tech choices",
            competencies_demonstrated="API project competencies",
        )

        response = self.get_projects("/api/portfolio/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data[0],
            {
                "id": project.id,
                "title": "API Project",
                "repo_url": project.repo_url,
                "live_url": "https://example.com/live",
                "thumbnail": None,
                "thumbnail_caption": "",
                "card_icon": None,
                "summary": "API Project summary",
                "tech_stack": ["Python", "Django", "PostgreSQL"],
                "problem": "API project problem",
                "solution": "API project solution",
                "tech_choices": "API project tech choices",
                "competencies_demonstrated": "API project competencies",
                "slug": "api-project",
                "featured": True,
                "status": Project.Status.BETA,
                "display_order": 3,
            },
        )


class ProjectDetailViewTest(TestCase):
    def setUp(self):
        self.view = ProjectDetailView.as_view()
        self.request_factory = APIRequestFactory()

    def get_project(self, slug):
        request = self.request_factory.get(f"/api/portfolio/{slug}/")
        return self.view(request, slug=slug)

    def test_detail_response_serializes_frontend_project_fields(self):
        project = create_project(
            "Detail API Project",
            featured=True,
            status=Project.Status.BETA,
            display_order=4,
            thumbnail="portfolio/resources/upload/thumbnails/detail-project.png",
            thumbnail_caption="Detail project thumbnail.",
            card_icon="portfolio/resources/upload/icons/projects/detail-project.png",
            tech_stack="Python, Django",
            problem="Detail API Project problem",
            solution="Detail API Project solution",
            tech_choices="Detail API Project tech choices",
            competencies_demonstrated="Detail API Project competencies",
        )

        response = self.get_project(project.slug)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], project.id)
        self.assertEqual(response.data["title"], "Detail API Project")
        self.assertEqual(response.data["repo_url"], project.repo_url)
        self.assertEqual(response.data["live_url"], "")
        self.assertEqual(
            response.data["thumbnail"],
            "/media/portfolio/resources/upload/thumbnails/detail-project.png",
        )
        self.assertEqual(response.data["thumbnail_caption"], "Detail project thumbnail.")
        self.assertEqual(
            response.data["card_icon"],
            "/media/portfolio/resources/upload/icons/projects/detail-project.png",
        )
        self.assertEqual(response.data["summary"], "Detail API Project summary")
        self.assertEqual(response.data["tech_stack"], ["Python", "Django"])
        self.assertEqual(response.data["problem"], "Detail API Project problem")
        self.assertEqual(response.data["solution"], "Detail API Project solution")
        self.assertEqual(
            response.data["tech_choices"],
            "Detail API Project tech choices",
        )
        self.assertEqual(
            response.data["competencies_demonstrated"],
            "Detail API Project competencies",
        )
        self.assertEqual(response.data["slug"], "detail-api-project")
        self.assertTrue(response.data["featured"])
        self.assertEqual(response.data["status"], Project.Status.BETA)
        self.assertEqual(response.data["display_order"], 4)
        self.assertNotIn("description", response.data)
