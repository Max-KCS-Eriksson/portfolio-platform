from django.test import TestCase

from .models import BlogContext
from .serializers import BlogContextSerializer


class BlogContextSerializerTest(TestCase):
    def test_serializes_blog_context(self):
        blog_context = BlogContext.objects.create(
            intro="Thoughts on backend development and tooling.",
        )

        blog_context_data = BlogContextSerializer(blog_context).data

        self.assertEqual(blog_context_data["id"], blog_context.id)
        self.assertEqual(
            blog_context_data["intro"],
            "Thoughts on backend development and tooling.",
        )
