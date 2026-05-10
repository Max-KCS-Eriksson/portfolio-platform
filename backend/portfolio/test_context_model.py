from django.test import TestCase

from .models import PortfolioContext


class ContextModelTest(TestCase):
    def test_first_always_featured(self):
        PortfolioContext.objects.all().delete()
        PortfolioContext.objects.create(featured=False, intro="Portfolio intro.")

        self.assertTrue(PortfolioContext.objects.first().featured)

    def test_two_cannot_be_featured(self):
        PortfolioContext.objects.all().delete()
        PortfolioContext.objects.create(featured=True, intro="First intro.")
        PortfolioContext.objects.create(featured=True, intro="Second intro.")

        first = PortfolioContext.objects.get(pk=1)
        second = PortfolioContext.objects.get(pk=2)

        self.assertFalse(first.featured)
        self.assertTrue(second.featured)

    def test_deleting_featured_context_promotes_remaining_context(self):
        PortfolioContext.objects.all().delete()
        featured_context = PortfolioContext.objects.create(
            featured=True,
            intro="Featured intro.",
        )
        older_context = PortfolioContext.objects.create(
            featured=False,
            intro="Older intro.",
        )
        latest_context = PortfolioContext.objects.create(
            featured=False,
            intro="Latest intro.",
        )

        featured_context.delete()

        older_context.refresh_from_db()
        latest_context.refresh_from_db()
        self.assertFalse(older_context.featured)
        self.assertTrue(latest_context.featured)
        self.assertEqual(PortfolioContext.objects.filter(featured=True).count(), 1)
