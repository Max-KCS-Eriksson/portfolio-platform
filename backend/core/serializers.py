from rest_framework import serializers

from .models import About, HeroSection, SocialMediaLink


def parse_marked_list(value):
    list_entries = []

    for list_entry in value.split("- "):
        list_entry = list_entry.strip()

        if list_entry:
            list_entries.append(list_entry)

    return list_entries


class AboutSerializer(serializers.ModelSerializer):
    mindset_list = serializers.SerializerMethodField()
    focus_list = serializers.SerializerMethodField()

    class Meta:
        model = About
        fields = (
            "id",
            "intro",
            "background",
            "mindset_intro",
            "mindset_list",
            "focus_intro",
            "focus_list",
        )

    def get_mindset_list(self, about):
        return parse_marked_list(about.mindset_list)

    def get_focus_list(self, about):
        return parse_marked_list(about.focus_list)


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
