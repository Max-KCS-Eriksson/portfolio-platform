from django.contrib import admin
from django.contrib.auth.models import Group

from .models import About, HeroSection, SocialMediaLink

admin.site.unregister(Group)
admin.site.register(About)
admin.site.register(HeroSection)
admin.site.register(SocialMediaLink)
