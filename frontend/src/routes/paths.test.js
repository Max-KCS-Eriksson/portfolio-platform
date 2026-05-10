import { describe, expect, test } from "vitest";
import { ROUTES, buildRoute } from "./paths";

describe("ROUTES", () => {
  test("defines application route patterns", () => {
    expect(ROUTES).toEqual({
      home: "/",
      portfolio: "/portfolio/",
      projectDetail: "/portfolio/:slug",
      blog: "/blog/",
      blogTag: "/blog/tag/:tag",
      blogPostDetail: "/blog/:slug",
      about: "/about/",
      status500: "/500/",
      notFound: "*",
    });
  });
});

describe("buildRoute", () => {
  test("builds encoded detail routes", () => {
    expect(buildRoute.projectDetail("project one")).toBe("/portfolio/project%20one/");
    expect(buildRoute.blogTag("React Testing")).toBe("/blog/tag/React%20Testing/");
    expect(buildRoute.blogPostDetail("post one")).toBe("/blog/post%20one/");
  });

  test("builds static blog route", () => {
    expect(buildRoute.blog()).toBe("/blog/");
  });
});
