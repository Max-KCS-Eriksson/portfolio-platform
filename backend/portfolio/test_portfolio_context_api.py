from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import PortfolioContext
from .serializers import PortfolioContextSerializer


class PortfolioContextSerializerTest(TestCase):
    def test_serializes_portfolio_context(self):
        portfolio_context = PortfolioContext.objects.create(
            intro="A selection of backend engineering projects.",
        )

        portfolio_context_data = PortfolioContextSerializer(portfolio_context).data

        self.assertEqual(portfolio_context_data["id"], portfolio_context.id)
        self.assertEqual(
            portfolio_context_data["intro"],
            "A selection of backend engineering projects.",
        )


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
class PortfolioContextViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_returns_empty_object_when_portfolio_context_does_not_exist(self):
        response = self.client.get("/api/portfolio/context")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {})

    def test_returns_featured_portfolio_context(self):
        older_context = PortfolioContext.objects.create(intro="Older intro.")
        featured_context = PortfolioContext.objects.create(intro="Featured intro.")

        response = self.client.get("/api/portfolio/context")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], featured_context.id)
        self.assertNotEqual(response.data["id"], older_context.id)
        self.assertEqual(response.data["intro"], "Featured intro.")
