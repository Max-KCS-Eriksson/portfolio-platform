import { beforeEach, describe, expect, test, vi } from "vitest";
import { apiGet } from "./client";
import { getAbout, getCoreContext, getHero } from "./coreApi";

vi.mock("./client", () => ({
  apiGet: vi.fn(),
}));

describe("coreApi", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("loads and maps core context", async () => {
    apiGet.mockResolvedValue({
      domain_name: "example.dev",
      site_owner: "Example Owner",
      social_media_links: [],
    });

    await expect(getCoreContext()).resolves.toEqual({
      domainName: "example.dev",
      siteOwner: "Example Owner",
      socialMediaLinks: [],
      projectOverviewLimit: undefined,
      blogOverviewLimit: undefined,
    });

    expect(apiGet).toHaveBeenCalledWith("/core/context/");
  });

  test("loads and maps hero content", async () => {
    apiGet.mockResolvedValue({
      headline: "Backend Developer",
      intro: "Intro",
      skills: ["Python"],
    });

    await expect(getHero()).resolves.toEqual({
      id: null,
      headline: "Backend Developer",
      intro: "Intro",
      skills: ["Python"],
    });

    expect(apiGet).toHaveBeenCalledWith("/hero/");
  });

  test("loads and maps about content", async () => {
    apiGet.mockResolvedValue({
      intro: "About intro",
      mindset_intro: "Mindset",
      mindset_list: ["Clear code"],
    });

    await expect(getAbout()).resolves.toMatchObject({
      intro: "About intro",
      mindsetIntro: "Mindset",
      mindsetList: ["Clear code"],
    });

    expect(apiGet).toHaveBeenCalledWith("/about/");
  });
});
