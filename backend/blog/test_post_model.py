from django.core.exceptions import ValidationError
from django.test import TestCase

from .models import BlogPost


class BlogPostModelTest(TestCase):
    def test_derives_title_intro_and_slug_from_markdown(self):
        blog_post = BlogPost.objects.create(
            as_markdown="""# Markdown Blog Post

The intro comes from the first text under the title.

## First section

Section body."""
        )

        self.assertEqual(blog_post.title, "Markdown Blog Post")
        self.assertEqual(
            blog_post.intro, "The intro comes from the first text under the title."
        )
        self.assertEqual(blog_post.slug, "markdown-blog-post")

    def test_updates_slug_when_markdown_title_changes(self):
        blog_post = BlogPost.objects.create(
            as_markdown="""# Original Title

Intro text.

## First section

Section body."""
        )

        blog_post.as_markdown = """# Updated Title

Intro text.

## First section

Section body."""
        blog_post.save(update_fields=["as_markdown"])

        blog_post.refresh_from_db()
        self.assertEqual(blog_post.slug, "updated-title")

    def test_requires_intro_between_title_and_first_section(self):
        with self.assertRaises(ValidationError):
            BlogPost.objects.create(
                as_markdown="""# Missing Intro

## First section

Section body."""
            )
