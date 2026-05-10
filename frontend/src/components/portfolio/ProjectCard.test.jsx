import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../../context/CoreContext";
import ProjectCard from "./ProjectCard";

function createProject(project = {}) {
  return {
    id: 1,
    title: "Project One",
    repoUrl: "https://github.com/example/project-one",
    liveUrl: "https://example.com/project-one",
    description: "Project summary",
    slug: "project-one",
    featured: true,
    techStack: ["React", "Django"],
    ...project,
  };
}

function renderProjectCard(project = createProject(), props = {}) {
  return render(
    <CoreContext.Provider value={{ coreContext: { socialMediaLinks: [] }, error: null, isLoading: false }}>
      <MemoryRouter>
        <ProjectCard project={project} {...props} />
      </MemoryRouter>
    </CoreContext.Provider>,
  );
}

describe("ProjectCard", () => {
  test("renders project summary, tech tags, and detail link", () => {
    renderProjectCard();

    expect(screen.getByRole("heading", { name: "Project One" })).toBeInTheDocument();
    expect(screen.getByText("Project summary")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Django")).toBeInTheDocument();
    expect(screen.getByLabelText("Project One")).toHaveAttribute("href", "/portfolio/project-one/");
  });

  test("renders repo and live links when available", () => {
    renderProjectCard();

    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/example/project-one",
    );
    expect(screen.getByRole("link", { name: /Live demo/ })).toHaveAttribute("href", "https://example.com/project-one");
  });

  test("uses a placeholder tech tag when tech stack is empty", () => {
    renderProjectCard(createProject({ techStack: [] }));

    expect(screen.getByText("Project tech stack TBD")).toBeInTheDocument();
  });

  test("renders featured badge only for featured CTA cards", () => {
    renderProjectCard(createProject({ featured: true }), { ctaCard: true });

    expect(screen.getByText("Featured")).toBeInTheDocument();
  });
});
