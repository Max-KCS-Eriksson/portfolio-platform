from django.db import models


class About(models.Model):
    """An about section for the website."""

    featured = models.BooleanField(default=True)
    text = models.TextField(
        help_text="NOTE: Add a blank space to empty lines to maintain the line break."
    )

    class Meta:
        verbose_name_plural = "About"

    def save(self, *args, **kwargs):
        """Ensure only one instance is featured and that one always is featured."""
        if self.featured:
            About.objects.update(featured=False)
        else:
            try:
                About.objects.get(featured=True)
            except self.DoesNotExist:
                self.featured = True

        return super().save(*args, **kwargs)

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
        if self.featured:
            HeroSection.objects.exclude(pk=self.pk).update(featured=False)
        else:
            if not HeroSection.objects.exclude(pk=self.pk).filter(featured=True).exists():
                self.featured = True

        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Promote another hero section if the featured one is deleted."""
        was_featured = self.featured
        result = super().delete(*args, **kwargs)

        if was_featured and not HeroSection.objects.filter(featured=True).exists():
            next_hero_section = HeroSection.objects.order_by("-pk").first()

            if next_hero_section:
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
