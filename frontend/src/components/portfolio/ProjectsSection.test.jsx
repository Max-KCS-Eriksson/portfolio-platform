import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../../context/CoreContext";
import ProjectsSection from "./ProjectsSection";

function createProject(project = {}) {
  return {
    id: 1,
    title: "Project One",
    repoUrl: "https://github.com/example/project-one",
    liveUrl: "",
    description: "Project summary",
    slug: "project-one",
    featured: false,
    techStack: ["React"],
    ...project,
  };
}

function renderProjectsSection(projects, props = {}) {
  return render(
    <CoreContext.Provider value={{ coreContext: { socialMediaLinks: [] }, error: null, isLoading: false }}>
      <MemoryRouter>
        <ProjectsSection projects={projects} {...props} />
      </MemoryRouter>
    </CoreContext.Provider>,
  );
}

describe("ProjectsSection", () => {
  test("renders featured project section when the first project is featured", () => {
    renderProjectsSection([createProject({ featured: true })], { ctaCards: true });

    expect(screen.getByRole("heading", { name: "Featured Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all featured/ })).toHaveAttribute("href", "#featured-projects");
    expect(screen.getByRole("heading", { name: "Project One" })).toBeInTheDocument();
  });

  test("renders other project section for non-featured projects", () => {
    renderProjectsSection([createProject({ featured: false })], { tight: true });

    expect(screen.getByRole("heading", { name: "Other Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all projects/ })).toHaveAttribute("href", "#other-projects");
  });

  test("treats highlighted projects as featured for legacy mapped data", () => {
    renderProjectsSection([createProject({ featured: false, highlighted: true })]);

    expect(screen.getByRole("heading", { name: "Featured Projects" })).toBeInTheDocument();
  });
});
