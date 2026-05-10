import { describe, expect, test } from "vitest";
import { mapAbout, mapCoreContext, mapHero } from "./coreMapper";

describe("mapHero", () => {
  test("maps hero content from API field names", () => {
    const hero = mapHero({
      id: 1,
      headline: "Backend Developer",
      intro: "I build maintainable services.",
      skills: ["Python", "", "Django", 42],
    });

    expect(hero).toEqual({
      id: 1,
      headline: "Backend Developer",
      intro: "I build maintainable services.",
      skills: ["Python", "Django"],
    });
  });

  test("returns an empty object for invalid hero content", () => {
    expect(mapHero(null)).toEqual({});
  });
});

describe("mapAbout", () => {
  test("maps about page content from snake case API fields", () => {
    const about = mapAbout({
      id: 2,
      intro: "About intro",
      background: "Background text",
      mindset_intro: "How I work",
      mindset_list: ["Clear code", "", "Useful tests"],
      focus_intro: "Current focus",
      focus_list: ["Django", "React", null],
    });

    expect(about).toEqual({
      id: 2,
      intro: "About intro",
      background: "Background text",
      mindsetIntro: "How I work",
      mindsetList: ["Clear code", "Useful tests"],
      focusIntro: "Current focus",
      focusList: ["Django", "React"],
    });
  });

  test("maps legacy about intro text fallback", () => {
    const about = mapAbout({
      text: "Legacy about text",
    });

    expect(about.intro).toBe("Legacy about text");
  });
});

describe("mapCoreContext", () => {
  test("maps site context and social links from API field names", () => {
    const coreContext = mapCoreContext({
      domain_name: "example.dev",
      site_owner: "Example Owner",
      social_media_links: [
        {
          id: 1,
          social_media: "GitHub",
          url: "https://github.com/example",
        },
        null,
        {
          id: 2,
          social_media: "LinkedIn",
          url: "https://linkedin.com/in/example",
        },
      ],
    });

    expect(coreContext).toEqual({
      domainName: "example.dev",
      siteOwner: "Example Owner",
      socialMediaLinks: [
        {
          id: 1,
          socialMedia: "GitHub",
          url: "https://github.com/example",
        },
        {
          id: 2,
          socialMedia: "LinkedIn",
          url: "https://linkedin.com/in/example",
        },
      ],
    });
  });

  test("returns an empty object for invalid core context", () => {
    expect(mapCoreContext(undefined)).toEqual({});
  });
});
