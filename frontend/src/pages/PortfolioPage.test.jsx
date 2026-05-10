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

function renderPortfolioPage(coreContext = { projectOverviewLimit: 1, socialMediaLinks: [] }) {
  return render(
    <CoreContext.Provider value={{ coreContext, error: null, isLoading: false }}>
      <MemoryRouter>
        <PortfolioPage />
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

  test("renders an error message when project loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getPortfolioContext.mockResolvedValue({ intro: "Portfolio intro" });
    getProjectsByFeatured.mockRejectedValue(new Error("Failed"));

    renderPortfolioPage();

    expect(await screen.findByText("Could not load projects.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
