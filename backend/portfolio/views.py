from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project
from .serializers import ProjectSerializer


class ProjectsListView(APIView):
    """Overview of all showcased projects."""

    def get(self, request):
        projects = Project.objects.filter(publish=True)
        return Response(ProjectSerializer(projects, many=True).data)


class ProjectDetailView(APIView):
    """Detail view of a project."""

    def get(self, request, slug):
        try:
            project = Project.objects.get(slug=slug)
            if not project.publish:
                raise Http404
        except Project.DoesNotExist:
            raise Http404
        return Response(ProjectSerializer(project).data)
