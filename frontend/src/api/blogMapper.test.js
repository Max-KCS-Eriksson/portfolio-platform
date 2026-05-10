import { describe, expect, test } from "vitest";
import { mapBlogPost, mapBlogPosts } from "./blogMapper";

describe("mapBlogPost", () => {
  test("maps nested blog post content from API field names", () => {
    const blogPost = mapBlogPost({
      id: 1,
      title: "Testing Frontend Boundaries",
      intro: "Intro text",
      paragraphs: [
        {
          id: 10,
          blog_post: 1,
          heading: "Paragraph heading",
          text: "Paragraph text",
          snippets: [
            {
              id: 20,
              paragraph: 10,
              snippet: "const tested = true;",
              side_scroll: true,
              description: "Code sample",
              intended_location: "after paragraph",
            },
            null,
          ],
        },
      ],
      tags: ["React", 42, "Testing"],
      date_added: "2026-05-10",
      slug: "testing-frontend-boundaries",
    });

    expect(blogPost).toEqual({
      id: 1,
      title: "Testing Frontend Boundaries",
      intro: "Intro text",
      paragraphs: [
        {
          id: 10,
          blogPost: 1,
          heading: "Paragraph heading",
          text: "Paragraph text",
          snippets: [
            {
              id: 20,
              paragraph: 10,
              snippet: "const tested = true;",
              sideScroll: true,
              description: "Code sample",
              intendedLocation: "after paragraph",
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
      paragraphs: [
        {
          blogPost: 2,
          snippets: [
            {
              sideScroll: true,
              intendedLocation: "inline",
            },
          ],
        },
      ],
      dateAdded: "2026-05-11",
    });

    expect(blogPost.paragraphs[0].blogPost).toBe(2);
    expect(blogPost.paragraphs[0].snippets[0].sideScroll).toBe(true);
    expect(blogPost.paragraphs[0].snippets[0].intendedLocation).toBe("inline");
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
