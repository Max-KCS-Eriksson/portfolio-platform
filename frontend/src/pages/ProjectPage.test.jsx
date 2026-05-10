import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getProject } from "../api/projectsApi";
import ProjectPage from "./ProjectPage";

vi.mock("../api/projectsApi", () => ({
  getProject: vi.fn(),
}));

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

function renderProjectPage(slug = "thumbnail-project") {
  return render(
    <MemoryRouter initialEntries={[`/portfolio/${slug}`]}>
      <Routes>
        <Route path="/portfolio/:slug" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function createProject(project = {}) {
  return {
    id: 1,
    title: "Thumbnail Project",
    repoUrl: "https://github.com/example/thumbnail-project",
    liveUrl: "",
    description: "Thumbnail Project summary",
    problem: "Thumbnail Project problem",
    solution: "Thumbnail Project solution",
    techChoices: "Thumbnail Project tech choices",
    competenciesDemonstrated: "Thumbnail Project competencies",
    thumbnail: "/media/portfolio/resources/upload/thumbnails/project.png",
    thumbnailCaption: "Project thumbnail caption.",
    slug: "thumbnail-project",
    featured: true,
    displayOrder: 1,
    techStack: ["React", "Django"],
    ...project,
  };
}

describe("ProjectPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders the project thumbnail in the hero", async () => {
    getProject.mockResolvedValue(createProject());

    renderProjectPage();

    expect(getProject).toHaveBeenCalledWith("thumbnail-project");

    const thumbnail = await screen.findByRole("img", {
      name: "Project thumbnail caption.",
    });

    expect(thumbnail).toHaveAttribute(
      "src",
      "/media/portfolio/resources/upload/thumbnails/project.png",
    );
  });

  test("renders the project hero without an image when the project has no thumbnail", async () => {
    getProject.mockResolvedValue(
      createProject({
        thumbnail: "",
        thumbnailCaption: "",
      }),
    );

    renderProjectPage();

    await screen.findByRole("heading", { name: "Thumbnail Project" });

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
