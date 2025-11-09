from blog.serializers import BlogPostSerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from taggit.models import Tag

from .models import BlogPost


class BlogPostListView(APIView):
    """Overview of all blog posts."""

    def get(self, request, tag=None):
        if tag:
            tag = get_object_or_404(Tag, slug=tag)
            blog_posts = BlogPost.objects.filter(publish=True, tags__in=[tag])
        else:
            blog_posts = BlogPost.objects.filter(publish=True)
        return Response(BlogPostSerializer(blog_posts, many=True).data)

    model = BlogPost
    context_object_name = "blog_post_list"


class BlogPostDetailView(APIView):
    """Detail view of a blog post."""

    def get(self, request, slug):
        try:
            blog_post = BlogPost.objects.get(slug=slug)
            if not blog_post.publish:
                raise Http404
        except BlogPost.DoesNotExist:
            raise Http404
        return Response(BlogPostSerializer(blog_post).data)
