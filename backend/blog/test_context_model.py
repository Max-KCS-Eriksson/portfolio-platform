from django.test import TestCase

from .models import BlogContext


class BlogContextModelTest(TestCase):
    def test_first_always_featured(self):
        BlogContext.objects.all().delete()
        BlogContext.objects.create(featured=False, intro="Blog intro.")

        self.assertTrue(BlogContext.objects.first().featured)

    def test_two_cannot_be_featured(self):
        BlogContext.objects.all().delete()
        BlogContext.objects.create(featured=True, intro="First intro.")
        BlogContext.objects.create(featured=True, intro="Second intro.")

        first = BlogContext.objects.get(pk=1)
        second = BlogContext.objects.get(pk=2)

        self.assertFalse(first.featured)
        self.assertTrue(second.featured)

    def test_deleting_featured_context_promotes_remaining_context(self):
        BlogContext.objects.all().delete()
        featured_context = BlogContext.objects.create(
            featured=True,
            intro="Featured intro.",
        )
        older_context = BlogContext.objects.create(
            featured=False,
            intro="Older intro.",
        )
        latest_context = BlogContext.objects.create(
            featured=False,
            intro="Latest intro.",
        )

        featured_context.delete()

        older_context.refresh_from_db()
        latest_context.refresh_from_db()
        self.assertFalse(older_context.featured)
        self.assertTrue(latest_context.featured)
        self.assertEqual(BlogContext.objects.filter(featured=True).count(), 1)
