from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import About


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
class AboutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_returns_empty_object_when_about_does_not_exist(self):
        response = self.client.get("/api/about/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {})

    def test_returns_featured_about(self):
        older_about = About.objects.create(
            intro="Older intro.",
            background="Older background.",
            mindset_intro="Older mindset.",
            mindset_list="- Older habit",
            focus_intro="Older focus.",
            focus_list="- Older focus area",
        )
        featured_about = About.objects.create(
            intro="About intro.",
            background="About background.",
            mindset_intro="Work mindset.",
            mindset_list="- First habit\n- Second habit",
            focus_intro="Current focus.",
            focus_list="- First focus\n- Second focus",
        )

        response = self.client.get("/api/about/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], featured_about.id)
        self.assertNotEqual(response.data["id"], older_about.id)
        self.assertEqual(response.data["intro"], "About intro.")
        self.assertEqual(response.data["background"], "About background.")
        self.assertEqual(response.data["mindset_intro"], "Work mindset.")
        self.assertEqual(response.data["mindset_list"], ["First habit", "Second habit"])
        self.assertEqual(response.data["focus_intro"], "Current focus.")
        self.assertEqual(response.data["focus_list"], ["First focus", "Second focus"])
