
from .models import About, HeroSection


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


class HeroSectionModelTest(TestCase):
    def setUp(self):
        self.field_values_true = dict(
            featured=True,
            headline="Backend Developer",
            intro="Building reliable systems.",
            skills="Python, Django, PostgreSQL",
        )
        self.field_values_false = dict(
            featured=False,
            headline="Backend Developer",
            intro="Building reliable systems.",
            skills="Python, Django, PostgreSQL",
        )
        return super().setUp()

    def test_first_always_featured(self):
        HeroSection.objects.all().delete()
        HeroSection.objects.create(**self.field_values_false)

        self.assertTrue(HeroSection.objects.first().featured)

    def test_cant_manually_remove_featured_status(self):
        HeroSection.objects.all().delete()
        HeroSection.objects.create(**self.field_values_true)
        HeroSection.objects.create(**self.field_values_false)

        self.assertEqual(len(HeroSection.objects.filter(featured=True)), 1)

        featured_object = HeroSection.objects.get(featured=True)
        featured_object.featured = False

        self.assertEqual(HeroSection.objects.get(featured=True).pk, featured_object.pk)

    def test_saving_featured_hero_section_as_not_featured_keeps_it_featured(self):
        HeroSection.objects.all().delete()
        featured_object = HeroSection.objects.create(**self.field_values_true)

        featured_object.featured = False
        featured_object.save()

        featured_object.refresh_from_db()
        self.assertTrue(featured_object.featured)
        self.assertEqual(HeroSection.objects.filter(featured=True).count(), 1)

    def test_deleting_featured_hero_section_promotes_remaining_hero_section(self):
        HeroSection.objects.all().delete()
        featured_object = HeroSection.objects.create(**self.field_values_true)
        older_object = HeroSection.objects.create(**self.field_values_false)
        latest_object = HeroSection.objects.create(**self.field_values_false)

        featured_object.delete()

        older_object.refresh_from_db()
        latest_object.refresh_from_db()
        self.assertFalse(older_object.featured)
        self.assertTrue(latest_object.featured)
        self.assertEqual(HeroSection.objects.filter(featured=True).count(), 1)

    def test_two_cannot_be_featured(self):
        HeroSection.objects.all().delete()
        HeroSection.objects.create(**self.field_values_true)
        HeroSection.objects.create(**self.field_values_true)

        first = HeroSection.objects.get(pk=1)
        self.assertFalse(first.featured)
        second = HeroSection.objects.get(pk=2)
        self.assertTrue(second.featured)
