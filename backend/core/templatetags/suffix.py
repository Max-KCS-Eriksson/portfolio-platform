from django import template
from django.template import defaultfilters

register = template.Library()


@register.filter
@defaultfilters.stringfilter
def suffix(value, suffix):
    if value:
        return f"{value}{suffix}"
    else:
        return value
