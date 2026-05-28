from django.test import SimpleTestCase

from .utils import BlogMarkdownParseError, BlogUtility


class BlogUtilityTest(SimpleTestCase):
    def test_parses_blog_post_markdown_as_ordered_content(self):
        parsed_post = BlogUtility.markdown_to_blog_post(
            """# Title

An intro under the title is required.

## A Section

Some text.

More text.

```hello.py file
print('hello')
```
> Example code

```Bash shell
python hello.py
rm hello.py
```
> Run the script.
> Remove the example.

More text.

## Another section

Final text."""
        )

        self.assertEqual(parsed_post["title"], "Title")
        self.assertEqual(parsed_post["intro"], "An intro under the title is required.")
        self.assertEqual(
            parsed_post["content"],
            [
                {"type": "title", "text": "Title"},
                {"type": "intro", "text": "An intro under the title is required."},
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
                            "snippet": "python hello.py\nrm hello.py",
                            "description": "Run the script.\nRemove the example.",
                        },
                        {"type": "paragraph", "text": "More text."},
                    ],
                },
                {
                    "type": "section",
                    "heading": "Another section",
                    "blocks": [{"type": "paragraph", "text": "Final text."}],
                },
            ],
        )

    def test_preserves_backslashes_in_multiline_snippets(self):
        parsed_post = BlogUtility.markdown_to_blog_post(
            """# Title

Intro text.

## Section

```Multiline Bash snippet
docker compose \\
    --profile dev \\
    up --build
```
> Start the development stack."""
        )

        snippet = parsed_post["content"][2]["blocks"][0]

        self.assertEqual(snippet["context"], "Multiline Bash snippet")
        self.assertEqual(
            snippet["snippet"],
            "docker compose \\\n    --profile dev \\\n    up --build",
        )

    def test_parses_adjacent_paragraphs_and_snippets_as_separate_ordered_blocks(self):
        parsed_post = BlogUtility.markdown_to_blog_post(
            """# Title

Intro text.

## Section

First paragraph.

Second paragraph.

```Bash shell
python first.py
```
> Run the first file.

```Bash shell
python second.py
```
> Run the second file.

Third paragraph."""
        )

        self.assertEqual(
            parsed_post["content"][2]["blocks"],
            [
                {"type": "paragraph", "text": "First paragraph."},
                {"type": "paragraph", "text": "Second paragraph."},
                {
                    "type": "snippet",
                    "context": "Bash shell",
                    "snippet": "python first.py",
                    "description": "Run the first file.",
                },
                {
                    "type": "snippet",
                    "context": "Bash shell",
                    "snippet": "python second.py",
                    "description": "Run the second file.",
                },
                {"type": "paragraph", "text": "Third paragraph."},
            ],
        )

    def test_allows_markdown_indented_up_to_three_spaces_for_structural_markers(self):
        parsed_post = BlogUtility.markdown_to_blog_post(
            """   # Title

Intro text.

   ## Section

Text.

   ```Bash shell
python manage.py test
   ```
   > Run tests."""
        )

        self.assertEqual(parsed_post["title"], "Title")
        self.assertEqual(parsed_post["content"][2]["heading"], "Section")
        self.assertEqual(
            parsed_post["content"][2]["blocks"][1],
            {
                "type": "snippet",
                "context": "Bash shell",
                "snippet": "python manage.py test",
                "description": "Run tests.",
            },
        )

    def test_requires_intro_before_first_section_heading(self):
        with self.assertRaisesMessage(
            BlogMarkdownParseError,
            "Blog Markdown must include an intro paragraph before the first ## heading.",
        ):
            BlogUtility.markdown_to_blog_post(
                """# Title

## Section

Text."""
            )

    def test_requires_closed_fenced_code_blocks(self):
        with self.assertRaisesMessage(
            BlogMarkdownParseError, "Fenced code blocks must be closed with ```."
        ):
            BlogUtility.markdown_to_blog_post(
                """# Title

Intro text.

## Section

```Bash shell
python manage.py test"""
            )

    def test_rejects_content_before_title(self):
        with self.assertRaisesMessage(
            BlogMarkdownParseError,
            "Blog Markdown cannot include content before the # title.",
        ):
            BlogUtility.markdown_to_blog_post(
                """Intro before title.

# Title

Intro text."""
            )

    def test_rejects_multiple_title_headings(self):
        with self.assertRaisesMessage(
            BlogMarkdownParseError, "Blog Markdown can only define one # title."
        ):
            BlogUtility.markdown_to_blog_post(
                """# Title

Intro text.

# Another title"""
            )

    def test_rejects_heading_levels_other_than_title_and_sections(self):
        with self.assertRaisesMessage(
            BlogMarkdownParseError, "Use ## headings for blog sections."
        ):
            BlogUtility.markdown_to_blog_post(
                """# Title

Intro text.

### Nested section"""
            )
