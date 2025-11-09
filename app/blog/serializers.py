from rest_framework import serializers

from .models import BlogPost, BlogPostParagraph, BlogPostSnippet


class BlogPostSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostSnippet
        fields = (
            "id",
            "paragraph",
            "snippet",
            "side_scroll",
            "description",
            "intended_location",
        )


class BlogPostParagraphSerializer(serializers.ModelSerializer):
    snippets = BlogPostSnippetSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPostParagraph
        fields = ("id", "blog_post", "heading", "text", "snippets")


class BlogPostSerializer(serializers.ModelSerializer):
    paragraphs = BlogPostParagraphSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = ("id", "title", "intro", "paragraphs", "date_added", "slug")
