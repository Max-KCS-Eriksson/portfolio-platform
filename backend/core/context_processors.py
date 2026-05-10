import os

from django.core.exceptions import ObjectDoesNotExist

from .models import SocialMediaLink


def domain_name(request):
    return {"domain_name": os.environ["DOMAIN_NAME"]}


def site_owner(request):
    return {"site_owner": os.environ["SITE_OWNER"]}


def social_media_links(request):
    try:
        social_media_links = SocialMediaLink.objects.all()
    except ObjectDoesNotExist:
        social_media_links = None
    return {"social_media_links": social_media_links}
