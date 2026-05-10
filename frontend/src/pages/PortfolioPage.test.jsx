import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getPortfolioContext, getProjectsByFeatured } from "../api/projectsApi";
import { CoreContext } from "../context/CoreContext";
import PortfolioPage from "./PortfolioPage";

vi.mock("../api/projectsApi", () => ({
  getPortfolioContext: vi.fn(),
  getProjectsByFeatured: vi.fn(),
}));

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

function createProject(project = {}) {
  return {
    id: 1,
    title: "Project One",
    repoUrl: "https://github.com/example/project-one",
    liveUrl: "",
    description: "Project summary",
    slug: "project-one",
    featured: true,
    techStack: ["React"],
    ...project,
  };
}

function renderPortfolioPage(props = {}) {
  return render(
    <CoreContext.Provider value={{ coreContext: { socialMediaLinks: [] }, error: null, isLoading: false }}>
      <MemoryRouter>
        <PortfolioPage {...props} />
      </MemoryRouter>
    </CoreContext.Provider>,
  );
}

describe("PortfolioPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("loads portfolio context and project sections", async () => {
    getPortfolioContext.mockResolvedValue({ intro: "Portfolio intro" });
    getProjectsByFeatured.mockImplementation((featured) =>
      Promise.resolve(
        featured
          ? [createProject({ id: 1, title: "Featured Project", featured: true })]
          : [createProject({ id: 2, title: "Other Project", featured: false, slug: "other-project" })],
      ),
    );

    renderPortfolioPage();

    expect(await screen.findByText("Portfolio intro")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Other Projects" })).toBeInTheDocument();
    expect(getProjectsByFeatured).toHaveBeenCalledWith(true);
    expect(getProjectsByFeatured).toHaveBeenCalledWith(false);
  });

  test("shows overview links only when project totals exceed overview limits", async () => {
    getPortfolioContext.mockResolvedValue({ intro: "Portfolio intro" });
    getProjectsByFeatured.mockImplementation((featured) =>
      Promise.resolve(
        featured
          ? [
              createProject({ id: 1, title: "Featured Project 1", featured: true, slug: "featured-project-1" }),
              createProject({ id: 2, title: "Featured Project 2", featured: true, slug: "featured-project-2" }),
              createProject({ id: 3, title: "Featured Project 3", featured: true, slug: "featured-project-3" }),
              createProject({ id: 4, title: "Featured Project 4", featured: true, slug: "featured-project-4" }),
            ]
          : [
              createProject({ id: 5, title: "Other Project 1", featured: false, slug: "other-project-1" }),
              createProject({ id: 6, title: "Other Project 2", featured: false, slug: "other-project-2" }),
              createProject({ id: 7, title: "Other Project 3", featured: false, slug: "other-project-3" }),
              createProject({ id: 8, title: "Other Project 4", featured: false, slug: "other-project-4" }),
              createProject({ id: 9, title: "Other Project 5", featured: false, slug: "other-project-5" }),
              createProject({ id: 10, title: "Other Project 6", featured: false, slug: "other-project-6" }),
              createProject({ id: 11, title: "Other Project 7", featured: false, slug: "other-project-7" }),
            ],
      ),
    );

    renderPortfolioPage();

    expect(await screen.findByRole("heading", { name: "Featured Project 1" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Featured Project 4" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Other Project 7" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all featured/ })).toHaveAttribute("href", "/portfolio/featured");
    expect(screen.getByRole("link", { name: /View all projects/ })).toHaveAttribute("href", "/portfolio/projects");
  });

  test("renders all featured projects without overview links in featured listing mode", async () => {
    getPortfolioContext.mockResolvedValue({ intro: "Portfolio intro" });
    getProjectsByFeatured.mockResolvedValue([
      createProject({ id: 1, title: "Featured Project 1", featured: true, slug: "featured-project-1" }),
      createProject({ id: 2, title: "Featured Project 2", featured: true, slug: "featured-project-2" }),
      createProject({ id: 3, title: "Featured Project 3", featured: true, slug: "featured-project-3" }),
      createProject({ id: 4, title: "Featured Project 4", featured: true, slug: "featured-project-4" }),
    ]);

    renderPortfolioPage({ featured: true });

    expect(await screen.findByRole("heading", { name: "Featured Project 4" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Other Projects" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View all featured/ })).not.toBeInTheDocument();
    expect(getProjectsByFeatured).toHaveBeenCalledWith(true);
  });

  test("renders all other projects without overview links in project listing mode", async () => {
    getPortfolioContext.mockResolvedValue({ intro: "Portfolio intro" });
    getProjectsByFeatured.mockResolvedValue([
      createProject({ id: 1, title: "Other Project 1", featured: false, slug: "other-project-1" }),
      createProject({ id: 2, title: "Other Project 2", featured: false, slug: "other-project-2" }),
      createProject({ id: 3, title: "Other Project 3", featured: false, slug: "other-project-3" }),
      createProject({ id: 4, title: "Other Project 4", featured: false, slug: "other-project-4" }),
      createProject({ id: 5, title: "Other Project 5", featured: false, slug: "other-project-5" }),
      createProject({ id: 6, title: "Other Project 6", featured: false, slug: "other-project-6" }),
      createProject({ id: 7, title: "Other Project 7", featured: false, slug: "other-project-7" }),
    ]);

    renderPortfolioPage({ featured: false });

    expect(await screen.findByRole("heading", { name: "Other Project 7" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Featured Projects" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View all projects/ })).not.toBeInTheDocument();
    expect(getProjectsByFeatured).toHaveBeenCalledWith(false);
  });

  test("renders an error message when project loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getPortfolioContext.mockResolvedValue({ intro: "Portfolio intro" });
    getProjectsByFeatured.mockRejectedValue(new Error("Failed"));

    renderPortfolioPage();

    expect(await screen.findByText("Could not load projects.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
