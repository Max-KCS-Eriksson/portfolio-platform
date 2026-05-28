import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBlogPost } from "../api/blogApi";
import BlogPostPage from "./BlogPostPage";

vi.mock("../api/blogApi", () => ({
  getBlogPost: vi.fn(),
}));

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

function renderBlogPostPage(path = "/blog/first-post/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BlogPostPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders typed markdown content blocks in order", async () => {
    getBlogPost.mockResolvedValue({
      title: "First Post",
      intro: "Intro text",
      tags: ["React Testing"],
      dateAdded: "2025-12-31T08:00:00Z",
      content: [
        { type: "title", text: "First Post" },
        { type: "intro", text: "Intro text" },
        {
          type: "section",
          heading: "Paragraph heading",
          blocks: [
            { type: "paragraph", text: "Paragraph text" },
            {
              type: "snippet",
              context: "Bash shell",
              snippet: "python manage.py test",
              description: "Snippet description",
            },
          ],
        },
        {
          type: "section",
          heading: "Next Steps",
          blocks: [{ type: "paragraph", text: "Ship it." }],
        },
      ],
    });

    renderBlogPostPage();

    expect(getBlogPost).toHaveBeenCalledWith("first-post");
    expect(await screen.findByRole("heading", { name: "First Post" })).toBeInTheDocument();
    expect(screen.getByText("Intro text")).toBeInTheDocument();
    expect(screen.getByText("31 Dec, 2025")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "First Post tags" })).toBeInTheDocument();
    expect(screen.getByText("React Testing")).toHaveClass("blog-tag-chip");
    expect(screen.queryByText(/min read/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "01 Paragraph heading" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "1. Paragraph heading" })).toHaveAttribute(
      "href",
      "#paragraph-heading",
    );
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "1. Paragraph heading" })).toHaveAttribute("aria-current", "true"),
    );
    expect(screen.getByRole("heading", { name: "02 Next Steps" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2. Next Steps" })).toHaveAttribute("href", "#next-steps");
    expect(screen.getByText("Paragraph text")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bash shell" })).toBeInTheDocument();
    expect(screen.getByText("python manage.py test").closest(".code-snippet__code")).toBeInTheDocument();
    expect(screen.getByText("Snippet description")).toBeInTheDocument();
    expect(document.querySelector('[data-icon="comment"]')).toBeInTheDocument();
    expect(document.querySelector(".blog-post-page__toc")).toBeInTheDocument();
    expect(document.querySelector(".blog-post-page__section")).toHaveClass("card");
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
      dateAdded: "2025-12-31T08:00:00Z",
      content: [
        {
          type: "section",
          heading: "Paragraph heading",
          blocks: [{ type: "snippet", context: "Bash shell", snippet: "copy me", description: "" }],
        },
      ],
    });

    renderBlogPostPage();

    fireEvent.click(await screen.findByRole("button", { name: "Copy snippet" }));

    expect(writeText).toHaveBeenCalledWith("copy me");
    await waitFor(() => expect(screen.getByText("copy me").closest(".code-snippet__box")).toHaveClass("copied"));
  });

  test("renders loading and error states", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getBlogPost.mockRejectedValue(new Error("Failed"));

    renderBlogPostPage();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Could not load blog post.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
