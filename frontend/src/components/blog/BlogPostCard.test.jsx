import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import BlogPostCard from "./BlogPostCard";

function createBlogPost(blogPost = {}) {
  return {
    id: 1,
    title: "First Post",
    intro: "First post intro",
    slug: "first-post",
    tags: ["React Testing", "Django"],
    dateAdded: "2025-12-31T08:00:00Z",
    ...blogPost,
  };
}

describe("BlogPostCard", () => {
  test("renders post summary, creation date, tags, and read CTA", () => {
    render(
      <MemoryRouter>
        <BlogPostCard blogPost={createBlogPost()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "First Post" })).toBeInTheDocument();
    expect(screen.getByText("First post intro")).toBeInTheDocument();
    expect(screen.getByText("31 Dec, 2025")).toBeInTheDocument();
    expect(screen.getByText("React Testing")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "First Post" })).toHaveAttribute("href", "/blog/first-post/");
    expect(screen.getByRole("link", { name: /Read post/ })).toHaveAttribute("href", "/blog/first-post/");
    expect(screen.queryByText(/min read/i)).not.toBeInTheDocument();
  });
});
