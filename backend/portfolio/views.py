from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PortfolioContext, Project
from .serializers import PortfolioContextSerializer, ProjectSerializer


class PortfolioContextView(APIView):
    def get(self, request):
        try:
            portfolio_context = PortfolioContext.objects.get(featured=True)
        except PortfolioContext.DoesNotExist:
            return Response({})
        return Response(PortfolioContextSerializer(portfolio_context).data)


def get_featured_filter(value):
    if value == "true":
        return True

    if value == "false":
        return False

    return None


class ProjectsListView(APIView):
    """Overview of all showcased projects."""

    def get(self, request):
        project_filters = {"public": True}
        featured = get_featured_filter(request.query_params.get("featured"))

        if featured is not None:
            project_filters["featured"] = featured

        projects = Project.objects.filter(**project_filters)

        return Response(ProjectSerializer(projects, many=True).data)


class ProjectDetailView(APIView):
    """Detail view of a project."""

    def get(self, request, slug):
        try:
            project = Project.objects.get(slug=slug)
            if not project.public:
                raise Http404
        except Project.DoesNotExist:
            raise Http404
        return Response(ProjectSerializer(project).data)
