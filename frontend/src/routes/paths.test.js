import { describe, expect, test } from "vitest";
import { ROUTES, buildRoute } from "./paths";

describe("ROUTES", () => {
  test("defines application route patterns", () => {
    expect(ROUTES).toEqual({
      home: "/",
      portfolio: "/portfolio/",
      portfolioFeatured: "/portfolio/featured",
      portfolioProjects: "/portfolio/projects",
      projectDetail: "/portfolio/:slug",
      about: "/about/",
      status500: "/500/",
      notFound: "*",
    });
  });
});

describe("buildRoute", () => {
  test("builds encoded detail routes", () => {
    expect(buildRoute.projectDetail("project one")).toBe("/portfolio/project%20one/");
  });

  test("builds static portfolio listing routes", () => {
    expect(buildRoute.portfolioFeatured()).toBe("/portfolio/featured");
    expect(buildRoute.portfolioProjects()).toBe("/portfolio/projects");
  });
});
