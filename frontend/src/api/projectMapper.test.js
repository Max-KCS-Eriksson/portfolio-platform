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

  test("keeps thumbnail fields empty when the API response does not include them", () => {
    const project = mapProject({
      id: 2,
      title: "Project Without Thumbnail",
      repo_url: "https://github.com/example/project-without-thumbnail",
      slug: "project-without-thumbnail",
    });

    expect(project.thumbnail).toBe("");
    expect(project.thumbnailCaption).toBe("");
  });
});
