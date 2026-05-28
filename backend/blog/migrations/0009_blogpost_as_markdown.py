from django.db import migrations, models


def copy_blog_posts_to_markdown(apps, schema_editor):
    BlogPost = apps.get_model("blog", "BlogPost")
    BlogPostParagraph = apps.get_model("blog", "BlogPostParagraph")
    BlogPostSnippet = apps.get_model("blog", "BlogPostSnippet")

    for blog_post in BlogPost.objects.all():
        markdown_lines = [
            f"# {blog_post.title}",
            "",
            blog_post.intro.strip(),
        ]

        paragraphs = BlogPostParagraph.objects.filter(blog_post=blog_post).order_by(
            "pk"
        )

        for paragraph in paragraphs:
            markdown_lines.extend(["", f"## {paragraph.heading}".rstrip()])

            if paragraph.text.strip():
                markdown_lines.extend(["", paragraph.text.strip()])

            snippets = BlogPostSnippet.objects.filter(paragraph=paragraph).order_by(
                "pk"
            )

            for snippet in snippets:
                fence_start = f"```{snippet.intended_location}".rstrip()
                markdown_lines.extend(["", fence_start, snippet.snippet.strip(), "```"])

                if snippet.description.strip():
                    for description_line in snippet.description.strip().splitlines():
                        markdown_lines.append(f"> {description_line}".rstrip())

        blog_post.as_markdown = "\n".join(markdown_lines).strip()
        blog_post.save(update_fields=["as_markdown"])


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0008_alter_blogpost_options"),
    ]

    operations = [
        migrations.AddField(
            model_name="blogpost",
            name="as_markdown",
            field=models.TextField(
                default="",
                help_text="Write the blog post as Markdown, starting with a # title.",
            ),
            preserve_default=False,
        ),
        migrations.RunPython(
            copy_blog_posts_to_markdown, reverse_code=migrations.RunPython.noop
        ),
        migrations.RemoveField(
            model_name="blogpost",
            name="intro",
        ),
        migrations.RemoveField(
            model_name="blogpost",
            name="title",
        ),
    ]
