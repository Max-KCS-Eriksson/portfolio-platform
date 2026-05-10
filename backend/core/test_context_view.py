from unittest.mock import patch

from django.test import TestCase, override_settings
from rest_framework.test import APIClient


# Endpoint tests exercise URL routing - omit message middleware so they do not depend
# on a locally configured SECRET_KEY.
@override_settings(
    MIDDLEWARE=[
        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
    ]
)
class ContextViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch.dict(
        "os.environ",
        {"DOMAIN_NAME": "example.com", "SITE_OWNER": "Example Owner"},
    )
    def test_returns_core_context_data(self):
        response = self.client.get("/api/core/context/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["domain_name"], "example.com")
        self.assertEqual(response.data["site_owner"], "Example Owner")
        self.assertEqual(response.data["social_media_links"], [])
