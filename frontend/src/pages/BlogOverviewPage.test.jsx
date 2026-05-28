import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBlogContext, getBlogPosts, getBlogPostsByTag } from "../api/blogApi";
import BlogOverviewPage from "./BlogOverviewPage";

vi.mock("../api/blogApi", () => ({
  getBlogContext: vi.fn(),
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
    dateAdded: "2025-12-31T08:00:00Z",
    ...blogPost,
  };
}

function renderBlogOverviewPage(path = "/blog/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog/" element={<BlogOverviewPage />} />
        <Route path="/blog/tag/:tag/" element={<BlogOverviewPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BlogOverviewPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getBlogContext.mockResolvedValue({ id: 1, intro: "Backend development notes." });
  });

  test("renders the overview hero, blog posts, dates, and tag navigation", async () => {
    getBlogPosts.mockResolvedValue([createBlogPost()]);

    renderBlogOverviewPage();

    expect(await screen.findByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("Backend development notes.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "All Posts" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "First Post" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "First Post" })).toHaveAttribute("href", "/blog/first-post/");
    expect(screen.getByText("31 Dec, 2025")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /React Testing/ })).toHaveAttribute("href", "/blog/tag/react-testing/");
    expect(screen.queryByRole("link", { name: "All" })).not.toBeInTheDocument();
    expect(screen.queryByText(/min read/i)).not.toBeInTheDocument();
  });

  test("uses the shared secondary card-section layout for blog posts", async () => {
    getBlogPosts.mockResolvedValue([createBlogPost()]);

    const { container } = renderBlogOverviewPage();

    await screen.findByRole("heading", { name: "First Post" });

    expect(container.querySelector(".blog-posts-section")).toBeInTheDocument();
    expect(container.querySelector(".overview-card-section__list")).toHaveClass("secondary");
    expect(container.querySelector(".blog-posts-section__item")).toBeInTheDocument();
  });

  test("loads filtered posts by tag and updates the posts heading", async () => {
    getBlogPostsByTag.mockResolvedValue([createBlogPost()]);
    getBlogPosts.mockResolvedValue([createBlogPost()]);

    renderBlogOverviewPage("/blog/tag/react-testing/");

    expect(await screen.findByRole("heading", { name: "React Testing Posts" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "React Testing" })).toHaveAttribute("href", "/blog/");
    expect(screen.getByRole("link", { name: "Clear tag filter" })).toHaveAttribute("href", "/blog/");
    expect(getBlogPostsByTag).toHaveBeenCalledWith("react-testing");
  });

  test("keeps the tag icon as the clear-filter action when a tag is selected", async () => {
    getBlogPostsByTag.mockResolvedValue([createBlogPost()]);
    getBlogPosts.mockResolvedValue([createBlogPost()]);

    const { container } = renderBlogOverviewPage("/blog/tag/react-testing/");

    const clearFilterLink = await screen.findByRole("link", { name: "Clear tag filter" });

    expect(container.querySelector('[data-icon="tag"]')).toBeInTheDocument();

    fireEvent.mouseEnter(clearFilterLink);

    expect(container.querySelector('[data-icon="tag"]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="xmark"]')).not.toBeInTheDocument();
  });

  test("renders an error message when posts fail to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getBlogContext.mockResolvedValue({ id: 1, intro: "Backend development notes." });
    getBlogPosts.mockRejectedValue(new Error("Failed"));

    renderBlogOverviewPage();

    expect(await screen.findByText("Could not load blog posts.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
