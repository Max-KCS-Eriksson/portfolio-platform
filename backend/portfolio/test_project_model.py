from django.test import TestCase

from .models import Project
from .testing import create_project


class ProjectModelTest(TestCase):
    def test_creates_project_with_model_defaults(self):
        project = create_project("Defaulted Project")

        self.assertEqual(project.live_url, "")
        self.assertEqual(project.tech_stack, "Python, Django")
        self.assertEqual(project.problem, "Defaulted Project problem")
        self.assertEqual(project.solution, "Defaulted Project solution")
        self.assertEqual(project.tech_choices, "Defaulted Project tech choices")
        self.assertEqual(
            project.competencies_demonstrated,
            "Defaulted Project competencies",
        )
        self.assertEqual(project.card_icon, "")
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
        project.problem = "Updated problem"
        project.solution = "Updated solution"
        project.tech_choices = "Updated tech choices"
        project.competencies_demonstrated = "Updated competencies"
        project.save()

        project.refresh_from_db()
        self.assertEqual(project.summary, "Updated summary")
        self.assertEqual(project.problem, "Updated problem")
        self.assertEqual(project.solution, "Updated solution")
        self.assertEqual(project.tech_choices, "Updated tech choices")
        self.assertEqual(project.competencies_demonstrated, "Updated competencies")

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

    def test_normalizes_comma_separated_tech_stack_on_save(self):
        project = create_project(
            "Normalized Project",
            tech_stack="Django,Python, Docker, , PostgreSQL",
        )

        self.assertEqual(project.tech_stack, "Django, Python, Docker, PostgreSQL")
