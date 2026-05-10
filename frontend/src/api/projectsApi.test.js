import { beforeEach, describe, expect, test, vi } from "vitest";
import { apiGet } from "./client";
import { getPortfolioContext, getProject, getProjects, getProjectsByFeatured } from "./projectsApi";

vi.mock("./client", () => ({
  apiGet: vi.fn(),
}));

describe("projectsApi", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("loads and maps projects", async () => {
    apiGet.mockResolvedValue([{ id: 1, title: "Project", repo_url: "https://github.com/example/project" }]);

    await expect(getProjects()).resolves.toEqual([
      expect.objectContaining({
        id: 1,
        title: "Project",
        repoUrl: "https://github.com/example/project",
      }),
    ]);

    expect(apiGet).toHaveBeenCalledWith("/portfolio/");
  });

  test("loads and maps projects by featured state", async () => {
    apiGet.mockResolvedValue([]);

    await getProjectsByFeatured(true);

    expect(apiGet).toHaveBeenCalledWith("/portfolio/?featured=true");
  });

  test("loads and maps a project by encoded slug", async () => {
    apiGet.mockResolvedValue({ id: 2, title: "Project Detail", slug: "project detail" });

    await getProject("project detail");

    expect(apiGet).toHaveBeenCalledWith("/portfolio/project%20detail/");
  });

  test("loads and maps portfolio context", async () => {
    apiGet.mockResolvedValue({ id: 3, intro: "Portfolio intro" });

    await expect(getPortfolioContext()).resolves.toEqual({
      id: 3,
      intro: "Portfolio intro",
    });

    expect(apiGet).toHaveBeenCalledWith("/portfolio/context");
  });
});
