import re


class BlogMarkdownParseError(ValueError):
    """Raised when authored blog Markdown cannot be parsed as a blog post."""


class BlogUtility:
    """Utility methods for blog post content handling."""

    HEADING_PATTERN = re.compile(r"^\s{0,3}(#{1,6})\s+(.*)$")
    FENCED_CODE_PATTERN = re.compile(r"^\s{0,3}```")
    BLOCKQUOTE_PATTERN = re.compile(r"^\s{0,3}>\s?(.*)$")

    def __init__(self, markdown):
        self.lines = markdown.replace("\r\n", "\n").replace("\r", "\n").split("\n")
        self.content = []
        self.current_section = None
        self.paragraph_lines = []
        self.intro = None
        self.index = 0

    @classmethod
    def markdown_to_blog_post(cls, markdown: str):
        """Parse authored Markdown into ordered blog post content blocks."""

        return cls(markdown)._parse()

    def _parse(self):
        title_index, title = self._find_title()
        self.content.append({"type": "title", "text": title})
        self.index = title_index + 1

        while self.index < len(self.lines):
            line = self.lines[self.index]
            heading = self._parse_heading(line)

            if heading is not None:
                self._handle_heading(heading)
                continue

            if self._is_fenced_code_marker(line):
                self._flush_paragraph()
                snippet = self._parse_fenced_code_block()
                self._append_block(snippet)
                continue

            if not line.strip():
                self._flush_paragraph()
                self.index += 1
                continue

            self.paragraph_lines.append(line.rstrip())
            self.index += 1

        self._flush_paragraph()

        if self.intro is None:
            raise BlogMarkdownParseError(
                "Blog Markdown must include an intro paragraph below the # title."
            )

        return {
            "title": title,
            "intro": self.intro,
            "content": self.content,
        }

    def _find_title(self):
        for index, line in enumerate(self.lines):
            heading = self._parse_heading(line)

            if heading is None:
                if line.strip():
                    raise BlogMarkdownParseError(
                        "Blog Markdown cannot include content before the # title."
                    )

                continue

            level, text = heading

            if level != 1:
                raise BlogMarkdownParseError("Blog Markdown must start with a # title.")

            if not text:
                raise BlogMarkdownParseError(
                    "Blog Markdown must start with a non-empty # title."
                )

            return index, text

        raise BlogMarkdownParseError("Blog Markdown must include a # title.")

    def _handle_heading(self, heading):
        level, text = heading

        if level == 1:
            raise BlogMarkdownParseError("Blog Markdown can only define one # title.")

        if level != 2:
            raise BlogMarkdownParseError("Use ## headings for blog sections.")

        self._flush_paragraph()

        if self.intro is None:
            raise BlogMarkdownParseError(
                "Blog Markdown must include an intro paragraph before the first ## heading."
            )

        self.current_section = {"type": "section", "heading": text, "blocks": []}
        self.content.append(self.current_section)
        self.index += 1

    def _parse_fenced_code_block(self):
        context = self.FENCED_CODE_PATTERN.sub(
            "", self.lines[self.index], count=1
        ).strip()
        snippet_lines = []
        self.index += 1

        while self.index < len(self.lines):
            if self._is_fenced_code_marker(self.lines[self.index]):
                self.index += 1
                break

            snippet_lines.append(self.lines[self.index].rstrip())
            self.index += 1
        else:
            raise BlogMarkdownParseError("Fenced code blocks must be closed with ```.")

        return {
            "type": "snippet",
            "context": context,
            "snippet": self._trim_empty_edge_lines(snippet_lines),
            "description": self._parse_snippet_description(),
        }

    def _parse_snippet_description(self):
        while self.index < len(self.lines) and not self.lines[self.index].strip():
            self.index += 1

        description_lines = []

        while self.index < len(self.lines):
            description_line = self._parse_blockquote_line(self.lines[self.index])

            if description_line is None:
                break

            description_lines.append(description_line)
            self.index += 1

        return "\n".join(description_lines)

    def _flush_paragraph(self):
        if not self.paragraph_lines:
            return

        paragraph = {
            "type": "paragraph",
            "text": self._trim_empty_edge_lines(self.paragraph_lines),
        }
        self.paragraph_lines.clear()

        if self.intro is None and self.current_section is None:
            self.intro = paragraph["text"]
            self.content.append({"type": "intro", "text": self.intro})
            return

        self._append_block(paragraph)

    def _append_block(self, block):
        if self.current_section is None:
            self.content.append(block)
            return

        self.current_section["blocks"].append(block)

    @classmethod
    def _parse_heading(cls, line):
        match = cls.HEADING_PATTERN.match(line)

        if match is None:
            return None

        return len(match.group(1)), match.group(2).strip()

    @classmethod
    def _is_fenced_code_marker(cls, line):
        return cls.FENCED_CODE_PATTERN.match(line) is not None

    @classmethod
    def _parse_blockquote_line(cls, line):
        match = cls.BLOCKQUOTE_PATTERN.match(line)

        if match is None:
            return None

        return match.group(1).rstrip()

    @staticmethod
    def _trim_empty_edge_lines(lines):
        trimmed_lines = list(lines)

        while trimmed_lines and not trimmed_lines[0].strip():
            trimmed_lines.pop(0)

        while trimmed_lines and not trimmed_lines[-1].strip():
            trimmed_lines.pop()

        return "\n".join(trimmed_lines)
