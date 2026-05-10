import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getHero } from "../api/coreApi";
import { getProjectsByFeatured } from "../api/projectsApi";
import { CoreContext } from "../context/CoreContext";
import HomePage from "./HomePage";

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

  test("loads hero and featured projects", async () => {
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

    renderHomePage();

    expect(await screen.findByRole("heading", { name: "Backend Developer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured Project" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Portfolio/ })).toHaveAttribute("href", "/portfolio/");
  });

  test("renders fallback messages when projects fail to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getHero.mockResolvedValue({});
    getProjectsByFeatured.mockRejectedValue(new Error("Projects failed"));

    renderHomePage();

    expect(await screen.findByText("Hero headline TBD")).toBeInTheDocument();
    expect(await screen.findByText("Could not load projects.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
