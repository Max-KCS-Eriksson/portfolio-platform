import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../../context/CoreContext";
import { getProjectOverviewLayoutGroupSize } from "../../config/overviewLimits";
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

function createProjects(projectCount, project = {}) {
  return Array.from({ length: projectCount }, (_, index) =>
    createProject({
      id: index + 1,
      slug: `project-${index + 1}`,
      ...project,
    }),
  );
}

describe("ProjectsSection", () => {
  test("renders featured project section when the first project is featured", () => {
    renderProjectsSection([createProject({ featured: true })], { ctaCards: true, showAllLink: true });

    expect(screen.getByRole("heading", { name: "Featured Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all featured/ })).toHaveAttribute("href", "/portfolio/featured");
    expect(screen.getByRole("heading", { name: "Project One" })).toBeInTheDocument();
  });

  test("renders other project section for non-featured projects", () => {
    renderProjectsSection([createProject({ featured: false })], { tight: true, showAllLink: true });

    expect(screen.getByRole("heading", { name: "Other Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all projects/ })).toHaveAttribute("href", "/portfolio/projects");
  });

  test("hides section route links by default", () => {
    renderProjectsSection([createProject({ featured: false })]);

    expect(screen.queryByRole("link", { name: /View all projects/ })).not.toBeInTheDocument();
  });

  test("treats highlighted projects as featured for legacy mapped data", () => {
    renderProjectsSection([createProject({ featured: false, highlighted: true })]);

    expect(screen.getByRole("heading", { name: "Featured Projects" })).toBeInTheDocument();
  });

  test("uses single layout for one featured project", () => {
    const { container } = renderProjectsSection(createProjects(1, { featured: true }));

    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-single");
    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-stack");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-paired");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-lead");
  });

  test("uses paired layout for two featured projects", () => {
    const { container } = renderProjectsSection(createProjects(2, { featured: true }));

    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-paired");
    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-stack");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-single");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-lead");
  });

  test("uses lead layout for three featured projects", () => {
    const { container } = renderProjectsSection(
      createProjects(getProjectOverviewLayoutGroupSize(), { featured: true }),
    );

    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-lead");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-stack");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-paired");
  });

  test("uses default thirds layout for the minimum secondary project count divisible by 3", () => {
    const { container } = renderProjectsSection(createProjects(getProjectOverviewLayoutGroupSize()), { tight: true });

    expect(container.querySelector(".projects-section")).toHaveClass("secondary");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-paired");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-fifths");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-stack");
  });

  test("uses default thirds layout for the next secondary project count divisible by 3", () => {
    const { container } = renderProjectsSection(createProjects(getProjectOverviewLayoutGroupSize() * 2), {
      tight: true,
    });

    expect(container.querySelector(".projects-section")).toHaveClass("secondary");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-paired");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-fifths");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-stack");
  });

  test("uses paired layout for the minimum secondary project count divisible by 2 and not 3", () => {
    const { container } = renderProjectsSection(createProjects(2), { tight: true });

    expect(container.querySelector(".projects-section")).toHaveClass("secondary");
    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-paired");
    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-stack");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-fifths");
  });

  test("uses paired layout for the next secondary project count divisible by 2 and not 3", () => {
    const { container } = renderProjectsSection(createProjects(4), { tight: true });

    expect(container.querySelector(".projects-section")).toHaveClass("secondary");
    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-paired");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-stack");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-fifths");
  });

  test("uses fifths layout for secondary project counts divisible by five and not two", () => {
    const { container } = renderProjectsSection(createProjects(5), { tight: true });

    expect(container.querySelector(".projects-section")).toHaveClass("secondary");
    expect(container.querySelector(".projects-section")).toHaveClass("projects-section--layout-fifths");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-paired");
    expect(container.querySelector(".projects-section")).not.toHaveClass("projects-section--layout-stack");
  });
});
