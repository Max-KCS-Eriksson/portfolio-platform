from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "public", "featured", "display_order")
    list_editable = ("public", "featured", "display_order")
    ordering = ("display_order", "-id")
    exclude = ["slug"]
