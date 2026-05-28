from django.contrib import admin

from .models import BlogContext, BlogPost, BlogPostParagraph, BlogPostSnippet


admin.site.register(BlogContext)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    exclude = ["slug"]


admin.site.register(BlogPostParagraph)
admin.site.register(BlogPostSnippet)
