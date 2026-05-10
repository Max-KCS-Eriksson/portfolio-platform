import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBlogPost } from "../api/blogApi";
import BlogPostDetailPage from "./BlogPostDetailPage";

vi.mock("../api/blogApi", () => ({
  getBlogPost: vi.fn(),
}));

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

function renderBlogPostDetailPage(path = "/blog/first-post") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BlogPostDetailPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders blog post details, tags, paragraphs, and snippets", async () => {
    getBlogPost.mockResolvedValue({
      title: "First Post",
      intro: "Intro text",
      tags: ["React Testing"],
      paragraphs: [
        {
          id: 1,
          heading: "Paragraph heading",
          text: "Paragraph text",
          snippets: [
            {
              id: 2,
              intendedLocation: "Example",
              snippet: "const value = true;",
              sideScroll: true,
              description: "Snippet description",
            },
          ],
        },
      ],
    });

    renderBlogPostDetailPage();

    expect(await screen.findByRole("heading", { name: "First Post" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "React Testing" })).toHaveAttribute("href", "/blog/tag/react-testing/");
    expect(screen.getByRole("heading", { name: "Paragraph heading" })).toBeInTheDocument();
    expect(screen.getByText("const value = true;")).toHaveClass("scroll");
  });

  test("copies snippet content with the Clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.assign(navigator, {
      clipboard: { writeText },
    });
    getBlogPost.mockResolvedValue({
      title: "First Post",
      intro: "Intro text",
      tags: [],
      paragraphs: [
        {
          id: 1,
          heading: "Paragraph heading",
          text: "Paragraph text",
          snippets: [{ id: 2, snippet: "copy me" }],
        },
      ],
    });

    renderBlogPostDetailPage();

    fireEvent.click(await screen.findByRole("button", { name: "Copy snippet" }));

    expect(writeText).toHaveBeenCalledWith("copy me");
  });

  test("renders loading and error states", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getBlogPost.mockRejectedValue(new Error("Failed"));

    renderBlogPostDetailPage();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Could not load blog post.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
