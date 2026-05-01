from core.context_processors import domain_name, site_owner, social_media_links
from core.serializers import SocialMediaLinkSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


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
