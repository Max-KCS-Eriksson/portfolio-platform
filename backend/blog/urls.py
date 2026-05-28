from django.urls import path

from .views import BlogContextView, BlogPostDetailView, BlogPostListView

app_name = "blog"
urlpatterns = [
    path("", BlogPostListView.as_view(), name="blog_posts"),
    path("context/", BlogContextView.as_view(), name="blog_context"),
    path("<slug:slug>/", BlogPostDetailView.as_view(), name="single_blog_post"),
    path("tag/<slug:tag>/", BlogPostListView.as_view(), name="blog_tag"),
]
