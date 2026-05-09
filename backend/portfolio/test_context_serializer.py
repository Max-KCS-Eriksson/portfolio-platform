from django.test import TestCase

from .models import PortfolioContext
from .serializers import PortfolioContextSerializer


class ContextSerializerTest(TestCase):
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
