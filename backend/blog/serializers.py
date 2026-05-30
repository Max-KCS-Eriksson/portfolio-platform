from rest_framework import serializers

from .models import BlogContext, BlogPost


class BlogContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogContext
        fields = ("id", "intro")


class TagListFieldSerializer(serializers.ModelSerializer):
    """Serializes `Tag` models from the thrid-party `django-taggit` library."""

    def to_representation(self, instance):
        return [tag.name for tag in instance.all()]

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError("Tags must be a list of strings")
        return data


class BlogPostSerializer(serializers.ModelSerializer):
    title = serializers.CharField(read_only=True)
    intro = serializers.CharField(read_only=True)
    content = serializers.SerializerMethodField()
    tags = TagListFieldSerializer()

    class Meta:
        model = BlogPost
        fields = (
            "id",
            "title",
            "intro",
            "content",
            "tags",
            "date_added",
            "slug",
        )

    def get_content(self, blog_post):
        return blog_post.parsed_markdown["content"]
