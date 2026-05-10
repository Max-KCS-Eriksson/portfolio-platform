import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBlogPosts } from "../api/blogApi";
import { getHero } from "../api/coreApi";
import { getProjectsByFeatured } from "../api/projectsApi";
import { CoreContext } from "../context/CoreContext";
import HomePage from "./HomePage";

vi.mock("../api/blogApi", () => ({
  getBlogPosts: vi.fn(),
}));

vi.mock("../api/coreApi", () => ({
  getHero: vi.fn(),
}));

vi.mock("../api/projectsApi", () => ({
  getProjectsByFeatured: vi.fn(),
}));

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

function renderHomePage(coreContext = { socialMediaLinks: [] }) {
  return render(
    <CoreContext.Provider value={{ coreContext, error: null, isLoading: false }}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </CoreContext.Provider>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("loads hero, featured projects, and latest writing", async () => {
    getHero.mockResolvedValue({ headline: "Backend Developer", intro: "Hero intro", skills: ["Python"] });
    getProjectsByFeatured.mockResolvedValue([
      {
        id: 1,
        title: "Featured Project",
        repoUrl: "https://github.com/example/featured-project",
        description: "Featured project summary",
        slug: "featured-project",
        featured: true,
        techStack: ["Django"],
      },
    ]);
    getBlogPosts.mockResolvedValue([
      {
        id: 2,
        title: "Latest Post",
        intro: "Latest post intro",
        slug: "latest-post",
        dateAdded: "2026-05-10",
      },
    ]);

    renderHomePage();

    expect(await screen.findByRole("heading", { name: "Backend Developer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured Project" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Latest Post" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Portfolio/ })).toHaveAttribute("href", "/portfolio/");
  });

  test("renders fallback messages when projects and writing fail to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getHero.mockResolvedValue({});
    getProjectsByFeatured.mockRejectedValue(new Error("Projects failed"));
    getBlogPosts.mockRejectedValue(new Error("Blog failed"));

    renderHomePage();

    expect(await screen.findByText("Hero headline TBD")).toBeInTheDocument();
    expect(await screen.findByText("Could not load projects.")).toBeInTheDocument();
    expect(await screen.findByText("Could not load writing.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
