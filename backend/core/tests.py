from django.test import TestCase

from .models import About


class AboutModelTest(TestCase):
    def setUp(self):
        self.field_values_true = dict(
            featured=True,
            text="This is the About page",
        )
        self.field_values_false = dict(
            featured=False,
            text="This is the About page",
        )
        return super().setUp()

    def test_first_always_featured(self):
        About.objects.all().delete()
        About.objects.create(**self.field_values_false)

        self.assertTrue(About.objects.first().featured)

    def test_cant_manually_remove_featured_status(self):
        About.objects.all().delete()
        About.objects.create(**self.field_values_true)
        About.objects.create(**self.field_values_false)

        self.assertEqual(len(About.objects.filter(featured=True)), 1)

        featured_object = About.objects.get(featured=True)
        featured_object.featured = False

        self.assertEqual(About.objects.get(featured=True).pk, featured_object.pk)

    def test_two_cannot_be_featured(self):
        About.objects.all().delete()
        About.objects.create(**self.field_values_true)
        About.objects.create(**self.field_values_true)

        first = About.objects.get(pk=1)
        self.assertFalse(first.featured)
        second = About.objects.get(pk=2)
        self.assertTrue(second.featured)
