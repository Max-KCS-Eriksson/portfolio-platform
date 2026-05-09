from django.contrib import admin

from .models import PortfolioContext, Project


admin.site.register(PortfolioContext)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "publish", "display_order")
    list_editable = ("publish", "display_order")
    ordering = ("display_order", "-id")
    exclude = ["slug"]
