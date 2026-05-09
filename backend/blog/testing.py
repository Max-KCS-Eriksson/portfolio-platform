from .models import BlogPost


def create_blog_post(title, **field_values):
    date_added = field_values.pop("date_added", None)
    tags = field_values.pop("tags", [])
    field_values = {
        "title": title,
        "intro": f"{title} intro",
        **field_values,
    }

    blog_post = BlogPost.objects.create(**field_values)
    blog_post.tags.set(tags)

    if date_added is not None:
        BlogPost.objects.filter(pk=blog_post.pk).update(date_added=date_added)
        blog_post.refresh_from_db()

    return blog_post
