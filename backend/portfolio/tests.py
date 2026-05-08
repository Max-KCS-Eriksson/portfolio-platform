from django.test import TestCase
from rest_framework.test import APIRequestFactory

from .models import Project
from .views import ProjectDetailView, ProjectsListView


def create_project(title, **field_values):
    field_values = {
        "title": title,
        "repo_url": f"https://github.com/example/{title.lower().replace(' ', '-')}",
        "summary": f"{title} summary",
        **field_values,
    }

    return Project.objects.create(**field_values)


class ProjectsListViewTests(TestCase):
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


class ProjectModelTests(TestCase):
    def test_creates_project_with_model_defaults(self):
        project = create_project("Defaulted Project")

        self.assertEqual(project.live_url, "")
        self.assertEqual(project.description, "")
        self.assertTrue(project.public)
        self.assertFalse(project.featured)
        self.assertEqual(project.display_order, 0)

    def test_generates_slug_when_created(self):
        project = create_project("Slugged Project")

        self.assertEqual(project.slug, "slugged-project")

    def test_returns_title_as_string_representation(self):
        project = create_project("Slugged Project")

        self.assertEqual(str(project), "Slugged Project")

    def test_regenerates_slug_when_title_changes(self):
        project = create_project("Original Project")

        project.title = "Renamed Project"
        project.save()

        project.refresh_from_db()
        self.assertEqual(project.slug, "renamed-project")

    def test_updates_project_fields(self):
        project = create_project("Original Project")

        project.summary = "Updated summary"
        project.description = "Updated description"
        project.save()

        project.refresh_from_db()
        self.assertEqual(project.summary, "Updated summary")
        self.assertEqual(project.description, "Updated description")

    def test_deletes_project(self):
        project = create_project("Deleted Project")

        project.delete()

        self.assertFalse(Project.objects.filter(title="Deleted Project").exists())

    def test_orders_by_display_order_then_newest_first(self):
        first_project = create_project("First Project", display_order=1)
        older_project = create_project("Older Project", display_order=2)
        newest_project = create_project("Newest Project", display_order=2)

        projects = list(Project.objects.all())

        self.assertEqual(projects, [first_project, newest_project, older_project])


class ProjectApiResponseTests(TestCase):
    def setUp(self):
        self.list_view = ProjectsListView.as_view()
        self.detail_view = ProjectDetailView.as_view()
        self.request_factory = APIRequestFactory()

    def get_projects(self, path):
        request = self.request_factory.get(path)
        return self.list_view(request)

    def get_project(self, slug):
        request = self.request_factory.get(f"/api/portfolio/{slug}/")
        return self.detail_view(request, slug=slug)

    def test_list_response_serializes_frontend_project_fields(self):
        project = create_project("API Project", featured=True, display_order=3)
        project.live_url = "https://example.com/live"
        project.description = "API project description"
        project.save()

        response = self.get_projects("/api/portfolio/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data[0],
            {
                "id": project.id,
                "title": "API Project",
                "repo_url": project.repo_url,
                "live_url": "https://example.com/live",
                "summary": "API Project summary",
                "description": "API project description",
                "slug": "api-project",
                "featured": True,
                "display_order": 3,
            },
        )

    def test_detail_response_serializes_frontend_project_fields(self):
        project = create_project("Detail API Project", featured=True, display_order=4)

        response = self.get_project(project.slug)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], project.id)
        self.assertEqual(response.data["title"], "Detail API Project")
        self.assertEqual(response.data["repo_url"], project.repo_url)
        self.assertEqual(response.data["live_url"], "")
        self.assertEqual(response.data["summary"], "Detail API Project summary")
        self.assertEqual(response.data["description"], "")
        self.assertEqual(response.data["slug"], "detail-api-project")
        self.assertTrue(response.data["featured"])
        self.assertEqual(response.data["display_order"], 4)
