from django.db import models
from django.utils.text import slugify


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
