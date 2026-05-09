from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import About, HeroSection
from .serializers import AboutSerializer, HeroSectionSerializer


class AboutModelTest(TestCase):
    def setUp(self):
        self.field_values_true = dict(
            featured=True,
            intro="This is the About page",
            background="About background.",
            mindset_intro="Work mindset.",
            mindset_list="- First habit\n- Second habit",
            focus_intro="Current focus.",
            focus_list="- First focus\n- Second focus",
        )
        self.field_values_false = dict(
            featured=False,
            intro="This is the About page",
            background="About background.",
            mindset_intro="Work mindset.",
            mindset_list="- First habit\n- Second habit",
            focus_intro="Current focus.",
            focus_list="- First focus\n- Second focus",
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

    def test_saving_featured_about_as_not_featured_keeps_it_featured(self):
        About.objects.all().delete()
        featured_object = About.objects.create(**self.field_values_true)

        featured_object.featured = False
        featured_object.save()

        featured_object.refresh_from_db()
        self.assertTrue(featured_object.featured)
        self.assertEqual(About.objects.filter(featured=True).count(), 1)

    def test_saving_only_remaining_about_as_not_featured_keeps_one_featured(self):
        About.objects.all().delete()
        featured_object = About.objects.create(**self.field_values_true)
        other_object = About.objects.create(**self.field_values_false)

        other_object.delete()
        featured_object.featured = False
        featured_object.save()

        featured_object.refresh_from_db()
        self.assertTrue(featured_object.featured)
        self.assertEqual(About.objects.filter(featured=True).count(), 1)

    def test_deleting_featured_about_promotes_remaining_about(self):
        About.objects.all().delete()
        featured_object = About.objects.create(**self.field_values_true)
        older_object = About.objects.create(**self.field_values_false)
        latest_object = About.objects.create(**self.field_values_false)

        featured_object.delete()

        older_object.refresh_from_db()
        latest_object.refresh_from_db()
        self.assertFalse(older_object.featured)
        self.assertTrue(latest_object.featured)
        self.assertEqual(About.objects.filter(featured=True).count(), 1)

    def test_two_cannot_be_featured(self):
        About.objects.all().delete()
        About.objects.create(**self.field_values_true)
        About.objects.create(**self.field_values_true)

        first = About.objects.get(pk=1)
        self.assertFalse(first.featured)
        second = About.objects.get(pk=2)
        self.assertTrue(second.featured)


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


class HeroSectionSerializerTest(TestCase):
    def test_serializes_comma_separated_skills_as_list(self):
        hero_section = HeroSection.objects.create(
            headline="Backend Developer",
            intro="Building reliable systems.",
            skills="Python, Django, , PostgreSQL , Docker, ",
        )

        hero_section_data = HeroSectionSerializer(hero_section).data

        self.assertEqual(
            hero_section_data["skills"],
            ["Python", "Django", "PostgreSQL", "Docker"],
        )


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
class HeroViewTest(TestCase):
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
