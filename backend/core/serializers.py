from rest_framework import serializers

from .models import About, HeroSection, SocialMediaLink


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ("id", "text")


class HeroSectionSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = HeroSection
        fields = ("id", "headline", "intro", "skills")

    def get_skills(self, hero_section):
        skills = []

        for skill in hero_section.skills.split(","):
            skill = skill.strip()

            if skill:
                skills.append(skill)

        return skills


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ("id", "social_media", "url")
