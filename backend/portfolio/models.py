from django.db import models
from django.utils.text import slugify


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
    summary = models.TextField(
        help_text="Summarize the project.",
    )
    description = models.TextField(
        blank=True,
        help_text="A detailed description of the project.",
    )

    slug = models.SlugField(unique=True, default="")

    publish = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first.",
    )

    class Meta:
        ordering = ["display_order", "-id"]

    def save(self, *args, **kwargs):
        """Generate a slug field and save the instance."""
        self.slug = slugify(self.title)
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title
