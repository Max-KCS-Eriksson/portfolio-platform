from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0007_alter_blogpostparagraph_blog_post_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="blogpost",
            options={"ordering": ["-date_added", "-id"]},
        ),
    ]
