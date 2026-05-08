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
            About.objects.exclude(pk=self.pk).update(featured=False)
        else:
            if not About.objects.exclude(pk=self.pk).filter(featured=True).exists():
                self.featured = True

        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Promote another about section if the featured one is deleted."""
        was_featured = self.featured
        result = super().delete(*args, **kwargs)

        if was_featured and not About.objects.filter(featured=True).exists():
            next_about = About.objects.order_by("-pk").first()

            if next_about:
                next_about.featured = True
                next_about.save()

        return result

    def __str__(self):
        return f"About-section (v.{self.pk})"


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
