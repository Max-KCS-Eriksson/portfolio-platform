from django.db import models
from utils.text import normalize_comma_separated_values, normalize_unsorted_list_text


class About(models.Model):
    """An about section for the website."""

    featured = models.BooleanField(default=True)
    intro = models.TextField()
    background = models.TextField(blank=False)
    mindset_intro = models.TextField(blank=False)
    mindset_list = models.TextField(
        blank=False, help_text='List each entry with "- " on a new line.'
    )
    focus_intro = models.TextField(blank=False)
    focus_list = models.TextField(
        blank=False, help_text='List each entry with "- " on a new line.'
    )

    class Meta:
        verbose_name_plural = "About"

    def save(self, *args, **kwargs):
        """Ensure only one instance is featured and that one always is featured."""

        self.mindset_list = normalize_unsorted_list_text(self.mindset_list)
        self.focus_list = normalize_unsorted_list_text(self.focus_list)

        other_about_sections = About.objects.exclude(pk=self.pk)
        if self.featured:
            other_about_sections.update(featured=False)
        elif not other_about_sections.filter(featured=True).exists():
            self.featured = True

        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Promote another about section if the featured one is deleted."""

        was_featured = self.featured
        result = super().delete(*args, **kwargs)

        has_featured_about = About.objects.filter(featured=True).exists()
        should_promote_about = was_featured and not has_featured_about

        if not should_promote_about:
            return result

        next_about = About.objects.order_by("-pk").first()

        if next_about is None:
            return result

        next_about.featured = True
        next_about.save()

        return result

    def __str__(self):
        return f"About-section (v.{self.pk})"


class HeroSection(models.Model):
    """Hero content for the website landing page."""

    featured = models.BooleanField(default=True)
    headline = models.TextField(blank=False)
    intro = models.TextField(blank=False)
    skills = models.TextField(blank=False, help_text="Comma-separated list of skills.")

    def save(self, *args, **kwargs):
        """Ensure only one instance is featured and that one always is featured."""
        self.skills = normalize_comma_separated_values(self.skills)
        other_hero_sections = HeroSection.objects.exclude(pk=self.pk)

        if self.featured:
            other_hero_sections.update(featured=False)
        elif not other_hero_sections.filter(featured=True).exists():
            self.featured = True

        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Promote another hero section if the featured one is deleted."""

        was_featured = self.featured
        result = super().delete(*args, **kwargs)

        has_featured_hero_section = HeroSection.objects.filter(featured=True).exists()
        should_promote_hero_section = was_featured and not has_featured_hero_section

        if not should_promote_hero_section:
            return result

        next_hero_section = HeroSection.objects.order_by("-pk").first()

        if next_hero_section is None:
            return result

        next_hero_section.featured = True
        next_hero_section.save()

        return result

    def __str__(self):
        return f"Hero-section (v.{self.pk})"


class SocialMediaLink(models.Model):
    """Link to a social media."""

    class SocialMediaPlatform(models.TextChoices):
        GITHUB = "gh", "GitHub"
        LINKEDIN = "in", "LinkedIn"
        FACEBOOK = "fb", "Facebook"
        INSTAGRAM = "ig", "Instagram"
        YOUTUBE = "yt", "YouTube"

    social_media = models.CharField(
        max_length=2,
        unique=True,
        choices=SocialMediaPlatform.choices,
    )
    url = models.URLField(
        unique=True,
        help_text="URL to social media page.",
    )

    def __str__(self):
        return self.social_media
