from rest_framework.response import Response
from rest_framework.views import APIView

from .models import About
from .serializers import AboutSerializer


class AboutView(APIView):
    template_name = "core/about.html"

    def get(self, request):
        try:
            about = About.objects.get(featured=True)
        except About.DoesNotExist:
            return Response({})
        return Response(AboutSerializer(about).data)
