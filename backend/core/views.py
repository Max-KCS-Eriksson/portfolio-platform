from rest_framework.response import Response
from rest_framework.views import APIView

from .context_processors import domain_name, site_owner, social_media_links
from .models import About
from .serializers import AboutSerializer, SocialMediaLinkSerializer


class AboutView(APIView):
    def get(self, request):
        try:
            about = About.objects.get(featured=True)
        except About.DoesNotExist:
            return Response({})
        return Response(AboutSerializer(about).data)


class FrontendContextView(APIView):
    """API for providing previously used template context processor injections."""

    def get(self, request):
        social_media_queryset = social_media_links(request)["social_media_links"]

        return Response(
            {
                "domain_name": domain_name(request)["domain_name"],
                "site_owner": site_owner(request)["site_owner"],
                "social_media_links": SocialMediaLinkSerializer(
                    social_media_queryset, many=True
                ).data,
            }
        )
