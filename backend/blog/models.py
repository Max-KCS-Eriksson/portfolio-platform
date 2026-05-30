from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from taggit.managers import TaggableManager

from .utils import BlogMarkdownParseError, BlogUtility


class BlogContext(models.Model):
    """Context content for the blog overview page."""

    featured = models.BooleanField(default=True)
    intro = models.TextField()

    def another_featured_context_exists(self):
        return BlogContext.objects.exclude(pk=self.pk).filter(featured=True).exists()

    def save(self, *args, **kwargs):
        """Ensure only one instance is featured and that one always is featured."""
        if self.featured:
            BlogContext.objects.exclude(pk=self.pk).update(featured=False)
        elif not self.another_featured_context_exists():
            self.featured = True

        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Promote another blog context if the featured one is deleted."""
        was_featured = self.featured
        result = super().delete(*args, **kwargs)

        if not was_featured:
            return result

        if BlogContext.objects.filter(featured=True).exists():
            return result

        next_context = BlogContext.objects.order_by("-pk").first()

        if next_context:
            next_context.featured = True
            next_context.save()

        return result

    def __str__(self):
        return f"Blog context (v.{self.pk})"


class BlogPost(models.Model):
    as_markdown = models.TextField(
        help_text="Write the blog post as Markdown, starting with a # title."
    )
    tags = TaggableManager()
    date_added = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, default="")
    publish = models.BooleanField(default=True)

    class Meta:
        ordering = ["-date_added", "-id"]

    def save(self, *args, **kwargs):
        """Generate a slug from the Markdown title and save the instance."""
        parsed_post = self.parsed_markdown
        self.slug = slugify(parsed_post["title"])

        if not self.slug:
            raise ValidationError(
                {"as_markdown": "Blog Markdown title must create a non-empty slug."}
            )

        if kwargs.get("update_fields") is not None:
            kwargs["update_fields"] = {*kwargs["update_fields"], "slug"}

        return super().save(*args, **kwargs)

    @property
    def parsed_markdown(self):
        try:
            return BlogUtility.markdown_to_blog_post(self.as_markdown)
        except BlogMarkdownParseError as error:
            raise ValidationError({"as_markdown": str(error)}) from error

    @property
    def title(self):
        return self.parsed_markdown["title"]

    @property
    def intro(self):
        return self.parsed_markdown["intro"]

    def __str__(self):
        return self.title
