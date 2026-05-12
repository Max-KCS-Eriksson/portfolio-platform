import { describe, expect, test } from "vitest";
import { mapProject } from "./projectMapper";

describe("mapProject", () => {
  test("maps project thumbnail fields from the API response", () => {
    const project = mapProject({
      id: 1,
      title: "Thumbnail Project",
      repo_url: "https://github.com/example/thumbnail-project",
      thumbnail: "/media/portfolio/resources/upload/thumbnails/project.png",
      thumbnail_caption: "Project thumbnail caption.",
      slug: "thumbnail-project",
    });

    expect(project.thumbnail).toBe("/media/portfolio/resources/upload/thumbnails/project.png");
    expect(project.thumbnailCaption).toBe("Project thumbnail caption.");
  });

  test("maps project card icon field from the API response", () => {
    const project = mapProject({
      id: 3,
      title: "Icon Project",
      repo_url: "https://github.com/example/icon-project",
      card_icon: "/media/portfolio/resources/upload/icons/projects/project-icon.png",
      slug: "icon-project",
    });

    expect(project.icon).toBe("/media/portfolio/resources/upload/icons/projects/project-icon.png");
  });

  test("maps project status from the API response", () => {
    const project = mapProject({
      id: 4,
      title: "Beta Project",
      repo_url: "https://github.com/example/beta-project",
      status: "beta",
      slug: "beta-project",
    });

    expect(project.status).toBe("beta");
  });

  test("keeps thumbnail fields empty when the API response does not include them", () => {
    const project = mapProject({
      id: 2,
      title: "Project Without Thumbnail",
      repo_url: "https://github.com/example/project-without-thumbnail",
      slug: "project-without-thumbnail",
    });

    expect(project.thumbnail).toBe("");
    expect(project.thumbnailCaption).toBe("");
    expect(project.icon).toBe("");
    expect(project.status).toBe("stable");
  });
});
