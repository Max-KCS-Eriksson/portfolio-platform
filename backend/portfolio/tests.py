from django.test import TestCase
from rest_framework.test import APIRequestFactory

from .models import Project
from .views import ProjectsListView


def create_project(title, public=True, featured=False, display_order=0):
    return Project.objects.create(
        title=title,
        repo_url=f"https://github.com/example/{title.lower().replace(' ', '-')}",
        summary=f"{title} summary",
        public=public,
        featured=featured,
        display_order=display_order,
    )


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
