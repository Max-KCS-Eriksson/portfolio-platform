from django.urls import path

from .views import AboutView, HeroView

app_name = "core"
urlpatterns = [
    path("about/", AboutView.as_view(), name="about"),
    path("hero/", HeroView.as_view(), name="hero"),
]
