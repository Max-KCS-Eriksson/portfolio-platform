from django.db import models
from django.utils.text import slugify

from utils.text import normalize_comma_separated_values


class PortfolioContext(models.Model):
    """Context content for the portfolio overview page."""

    featured = models.BooleanField(default=True)
    intro = models.TextField()

    def save(self, *args, **kwargs):
        """Ensure only one instance is featured and that one always is featured."""
        if self.featured:
            PortfolioContext.objects.exclude(pk=self.pk).update(featured=False)
        else:
            if not PortfolioContext.objects.exclude(pk=self.pk).filter(featured=True).exists():
                self.featured = True

        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Promote another portfolio context if the featured one is deleted."""
        was_featured = self.featured
        result = super().delete(*args, **kwargs)

        if was_featured and not PortfolioContext.objects.filter(featured=True).exists():
            next_context = PortfolioContext.objects.order_by("-pk").first()

            if next_context:
                next_context.featured = True
                next_context.save()

        return result

    def __str__(self):
        return f"Portfolio context (v.{self.pk})"


class Project(models.Model):
    class Status(models.TextChoices):
        PROTOTYPE = "prototype", "Prototype"
        BETA = "beta", "Beta"
        STABLE = "stable", "Stable"

    title = models.CharField(
        max_length=50,
        unique=True,
        help_text="The title of the project.",
    )
    repo_url = models.URLField(
        help_text="URL to remote git repo.",
    )
    live_url = models.URLField(
        blank=True,
        help_text="URL to live project.",
    )
    thumbnail = models.ImageField(
        blank=True,
        upload_to="portfolio/resources/upload/thumbnails/",
    )
    thumbnail_caption = models.TextField(blank=True)
    card_icon = models.ImageField(
        blank=True,
        upload_to="portfolio/resources/upload/icons/projects/",
    )
    tech_stack = models.TextField(
        default="",  # preserving existing production rows
        blank=False,  # required in Django admin
        help_text="Comma-separated list of technologies.",
    )
    summary = models.TextField(
        help_text="Summarize the project.",
    )
    problem = models.TextField(blank=False)
    # `default=""` for preserving existing production rows.
    solution = models.TextField(blank=False, default="")
    tech_choices = models.TextField(blank=False, default="")
    competencies_demonstrated = models.TextField(blank=False, default="")

    slug = models.SlugField(unique=True, default="")

    public = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    status = models.CharField(
        default=Status.STABLE, choices=Status.choices, max_length=20
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first.",
    )

    class Meta:
        ordering = ["display_order", "-id"]

    def save(self, *args, **kwargs):
        """Generate a slug field and save the instance."""
        self.slug = slugify(self.title)
        self.tech_stack = normalize_comma_separated_values(self.tech_stack)
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title
