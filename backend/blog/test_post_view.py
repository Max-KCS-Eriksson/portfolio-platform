from datetime import timedelta

from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from .testing import create_blog_post


# Endpoint tests exercise URL routing - omit message middleware so they do not depend
# on a locally configured SECRET_KEY.
@override_settings(
    MIDDLEWARE=[
        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
    ]
)
class PostViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_returns_published_blog_posts(self):
        published_blog_post = create_blog_post("Published Blog Post")
        unpublished_blog_post = create_blog_post(
            "Unpublished Blog Post",
            publish=False,
        )

        response = self.client.get("/api/blog/")
        returned_blog_post_ids = [blog_post["id"] for blog_post in response.data]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(returned_blog_post_ids, [published_blog_post.id])
        self.assertNotIn(unpublished_blog_post.id, returned_blog_post_ids)

    def test_orders_blog_posts_by_latest_first(self):
        now = timezone.now()
        older_blog_post = create_blog_post(
            "Older Blog Post",
            date_added=now - timedelta(days=2),
        )
        newest_blog_post = create_blog_post(
            "Newest Blog Post",
            date_added=now,
        )
        middle_blog_post = create_blog_post(
            "Middle Blog Post",
            date_added=now - timedelta(days=1),
        )

        response = self.client.get("/api/blog/")
        returned_blog_post_ids = [blog_post["id"] for blog_post in response.data]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            returned_blog_post_ids,
            [newest_blog_post.id, middle_blog_post.id, older_blog_post.id],
        )

    def test_orders_tagged_blog_posts_by_latest_first(self):
        now = timezone.now()
        newest_python_post = create_blog_post(
            "Newest Python Post",
            date_added=now,
            tags=["python"],
        )
        older_python_post = create_blog_post(
            "Older Python Post",
            date_added=now - timedelta(days=1),
            tags=["python"],
        )
        django_post = create_blog_post(
            "Django Post",
            date_added=now + timedelta(days=1),
            tags=["django"],
        )

        response = self.client.get("/api/blog/tag/python/")
        returned_blog_post_ids = [blog_post["id"] for blog_post in response.data]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            returned_blog_post_ids,
            [newest_python_post.id, older_python_post.id],
        )
        self.assertNotIn(django_post.id, returned_blog_post_ids)

    def test_returns_blog_post_detail_from_markdown(self):
        blog_post = create_blog_post(
            "Markdown Post",
            as_markdown="""# Markdown Post

Markdown intro text.

## A Section

Some text.

More text.

```hello.py file
print('hello')
```
> Example code

```Bash shell
python hello.py
```
> Running the file

Another paragraph.""",
        )

        response = self.client.get(f"/api/blog/{blog_post.slug}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Markdown Post")
        self.assertEqual(response.data["intro"], "Markdown intro text.")
        self.assertEqual(
            response.data["content"],
            [
                {"type": "title", "text": "Markdown Post"},
                {"type": "intro", "text": "Markdown intro text."},
                {
                    "type": "section",
                    "heading": "A Section",
                    "blocks": [
                        {"type": "paragraph", "text": "Some text."},
                        {"type": "paragraph", "text": "More text."},
                        {
                            "type": "snippet",
                            "context": "hello.py file",
                            "snippet": "print('hello')",
                            "description": "Example code",
                        },
                        {
                            "type": "snippet",
                            "context": "Bash shell",
                            "snippet": "python hello.py",
                            "description": "Running the file",
                        },
                        {"type": "paragraph", "text": "Another paragraph."},
                    ],
                },
            ],
        )
