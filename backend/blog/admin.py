from django.contrib import admin

from .models import BlogContext, BlogPost


admin.site.register(BlogContext)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    exclude = ["slug"]
