from django.test import TestCase

from .models import About
from .serializers import AboutSerializer


class AboutSerializerTest(TestCase):
    def test_serializes_about_page_fields(self):
        about = About.objects.create(
            intro="About intro.",
            background="About background.",
            mindset_intro="Work mindset.",
            mindset_list=(
                "- Pair API contracts, admin editing, and frontend mapping\n"
                "- Use docker-container names when useful\n"
                "- Keep changes small, observable, and reversible"
            ),
            focus_intro="Current focus.",
            focus_list=(
                "- Backend support for content sections\n"
                "- Recruiter-readable project narratives"
            ),
        )

        about_data = AboutSerializer(about).data

        self.assertEqual(about_data["intro"], "About intro.")
        self.assertEqual(about_data["background"], "About background.")
        self.assertEqual(about_data["mindset_intro"], "Work mindset.")
        self.assertEqual(
            about_data["mindset_list"],
            [
                "Pair API contracts, admin editing, and frontend mapping",
                "Use docker-container names when useful",
                "Keep changes small, observable, and reversible",
            ],
        )
        self.assertEqual(about_data["focus_intro"], "Current focus.")
        self.assertEqual(
            about_data["focus_list"],
            [
                "Backend support for content sections",
                "Recruiter-readable project narratives",
            ],
        )
