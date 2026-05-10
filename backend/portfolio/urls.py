from django.urls import path

from .views import PortfolioContextView, ProjectDetailView, ProjectsListView

app_name = "portfolio"
urlpatterns = [
    path("", ProjectsListView.as_view(), name="projects"),
    path("context", PortfolioContextView.as_view(), name="context"),
    path("<slug:slug>/", ProjectDetailView.as_view(), name="single_project"),
]
