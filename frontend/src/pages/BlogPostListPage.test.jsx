import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBlogPosts, getBlogPostsByTag } from "../api/blogApi";
import BlogPostListPage from "./BlogPostListPage";

vi.mock("../api/blogApi", () => ({
  getBlogPosts: vi.fn(),
  getBlogPostsByTag: vi.fn(),
}));

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

function createBlogPost(blogPost = {}) {
  return {
    id: 1,
    title: "First Post",
    intro: "First post intro",
    slug: "first-post",
    tags: ["React Testing", "Django"],
    ...blogPost,
  };
}

function renderBlogPostListPage(path = "/blog/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog/" element={<BlogPostListPage />} />
        <Route path="/blog/tag/:tag/" element={<BlogPostListPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BlogPostListPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders blog posts and tag navigation", async () => {
    getBlogPosts.mockResolvedValue([createBlogPost()]);

    renderBlogPostListPage();

    expect(await screen.findByRole("heading", { name: /First Post/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /React Testing/ })).toHaveAttribute("href", "/blog/tag/react-testing/");
  });

  test("loads filtered posts by tag and can remove the selected filter", async () => {
    getBlogPostsByTag.mockResolvedValue([createBlogPost()]);
    getBlogPosts.mockResolvedValue([createBlogPost()]);

    renderBlogPostListPage("/blog/tag/react-testing/");

    expect(await screen.findByRole("heading", { name: "React Testing" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Remove tag filter" })).toHaveAttribute("href", "/blog/");
    expect(getBlogPostsByTag).toHaveBeenCalledWith("react-testing");
  });

  test("toggles the tags menu", async () => {
    getBlogPosts.mockResolvedValue([createBlogPost()]);

    const { container } = renderBlogPostListPage();

    const button = await screen.findByRole("button", { name: "Toggle tags menu" });
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("#tags-menu")).toHaveClass("active");
  });

  test("renders an error message when posts fail to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getBlogPosts.mockRejectedValue(new Error("Failed"));

    renderBlogPostListPage();

    expect(await screen.findByText("Could not load blog posts.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
