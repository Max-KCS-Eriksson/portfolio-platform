import { describe, expect, test } from "vitest";
import { mapBlogContext, mapBlogPost, mapBlogPosts } from "./blogMapper";

describe("mapBlogPost", () => {
  test("maps ordered markdown content blocks from API field names", () => {
    const blogPost = mapBlogPost({
      id: 1,
      title: "Testing Frontend Boundaries",
      intro: "Intro text",
      content: [
        { type: "title", text: "Testing Frontend Boundaries" },
        { type: "intro", text: "Intro text" },
        {
          type: "section",
          heading: "A Section",
          blocks: [
            { type: "paragraph", text: "Paragraph text" },
            {
              type: "snippet",
              context: "Bash shell",
              snippet: "python manage.py test",
              description: "Run the test suite.",
            },
            null,
          ],
        },
        { type: "unknown", text: "Ignored block" },
      ],
      tags: ["React", 42, "Testing"],
      date_added: "2026-05-10",
      slug: "testing-frontend-boundaries",
    });

    expect(blogPost).toEqual({
      id: 1,
      title: "Testing Frontend Boundaries",
      intro: "Intro text",
      content: [
        { type: "title", text: "Testing Frontend Boundaries" },
        { type: "intro", text: "Intro text" },
        {
          type: "section",
          heading: "A Section",
          blocks: [
            { type: "paragraph", text: "Paragraph text" },
            {
              type: "snippet",
              context: "Bash shell",
              snippet: "python manage.py test",
              description: "Run the test suite.",
            },
          ],
        },
      ],
      tags: ["React", "Testing"],
      dateAdded: "2026-05-10",
      slug: "testing-frontend-boundaries",
    });
  });

  test("maps camel case fallback fields", () => {
    const blogPost = mapBlogPost({
      dateAdded: "2026-05-11",
    });

    expect(blogPost.dateAdded).toBe("2026-05-11");
  });

  test("returns null for invalid blog post content", () => {
    expect(mapBlogPost(null)).toBeNull();
  });
});

describe("mapBlogPosts", () => {
  test("maps arrays and filters invalid blog post entries", () => {
    const blogPosts = mapBlogPosts([
      {
        id: 1,
        title: "First post",
      },
      null,
      {
        id: 2,
        title: "Second post",
      },
    ]);

    expect(blogPosts).toHaveLength(2);
    expect(blogPosts.map((blogPost) => blogPost.title)).toEqual(["First post", "Second post"]);
  });

  test("returns an empty array for invalid blog post lists", () => {
    expect(mapBlogPosts(undefined)).toEqual([]);
  });
});

describe("mapBlogContext", () => {
  test("maps blog context", () => {
    expect(
      mapBlogContext({
        id: 1,
        intro: "Thoughts on backend development and tooling.",
      }),
    ).toEqual({
      id: 1,
      intro: "Thoughts on backend development and tooling.",
    });
  });

  test("returns null for invalid blog context", () => {
    expect(mapBlogContext(undefined)).toBeNull();
  });
});
