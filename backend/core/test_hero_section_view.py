from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import HeroSection


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
class HeroSectionViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_returns_empty_object_when_hero_section_does_not_exist(self):
        response = self.client.get("/api/hero/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {})

    def test_returns_featured_hero_section(self):
        older_hero_section = HeroSection.objects.create(
            headline="Older headline",
            intro="Older intro.",
            skills="Python, Django",
        )
        featured_hero_section = HeroSection.objects.create(
            headline="Backend Developer",
            intro="Building reliable systems.",
            skills="Python, Django, PostgreSQL",
        )

        response = self.client.get("/api/hero/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], featured_hero_section.id)
        self.assertNotEqual(response.data["id"], older_hero_section.id)
        self.assertEqual(response.data["headline"], "Backend Developer")
        self.assertEqual(response.data["intro"], "Building reliable systems.")
