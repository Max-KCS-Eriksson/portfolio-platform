from django.db import models
from django.utils.text import slugify
from taggit.managers import TaggableManager


class BlogPost(models.Model):
    title = models.CharField(
        max_length=50,
        unique=True,
        help_text="The title of the blog post.",
    )
    intro = models.TextField(
        help_text="Introduction of the blog post.",
    )
    tags = TaggableManager()
    date_added = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, default="")
    publish = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        """Generate a slug field and save the instance."""
        self.slug = slugify(self.title)
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class BlogPostParagraph(models.Model):
    """A paragraph of a blog post."""

    blog_post = models.ForeignKey(
        BlogPost, related_name="paragraphs", on_delete=models.CASCADE
    )
    heading = models.CharField(
        max_length=50, blank=True, help_text="The heading of the paragraph."
    )
    text = models.TextField(help_text="A blog post paragraph.")

    def __str__(self):
        return f"{self.blog_post.title} (p.{self.heading})"


class BlogPostSnippet(models.Model):
    """A code or command snippet belonging to a blog post paragraph."""

    paragraph = models.ForeignKey(
        BlogPostParagraph, related_name="snippets", on_delete=models.CASCADE
    )
    snippet = models.TextField(help_text="A blog post paragraph.")
    side_scroll = models.BooleanField(default=False, help_text="Scrollable sideways")
    description = models.TextField(
        blank=True,
        help_text="A detailed description of the project.",
    )
    intended_location = models.TextField(
        blank=True,
        help_text="The intended location to write the snippet to.",
    )

    def __str__(self):
        blog_title = self.paragraph.blog_post.title
        paragraph_heading = self.paragraph.heading
        return f"{blog_title} (p.{paragraph_heading}, s.{self.pk})"
