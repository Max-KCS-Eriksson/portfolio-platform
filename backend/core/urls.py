from django.urls import path

from .views import AboutView, FrontendContextView

app_name = "core"
urlpatterns = [
    path("about/", AboutView.as_view(), name="about"),
    path("context/", FrontendContextView.as_view(), name="context"),
]
