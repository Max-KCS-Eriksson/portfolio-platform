from django.test import TestCase

from .models import HeroSection
from .serializers import HeroSectionSerializer


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
