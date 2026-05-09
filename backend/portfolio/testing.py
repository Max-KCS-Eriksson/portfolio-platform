from .models import Project


def create_project(title, **field_values):
    field_values = {
        "title": title,
        "repo_url": f"https://github.com/example/{title.lower().replace(' ', '-')}",
        "summary": f"{title} summary",
        "tech_stack": "Python, Django",
        "problem": f"{title} problem",
        "solution": f"{title} solution",
        "tech_choices": f"{title} tech choices",
        "competencies_demonstrated": f"{title} competencies",
        **field_values,
    }

    return Project.objects.create(**field_values)
