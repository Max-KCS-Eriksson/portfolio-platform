import { describe, expect, test } from "vitest";
import { slugifyTag } from "./slugifyTag";

describe("slugifyTag", () => {
  test("lowercases and hyphenates tag names", () => {
    expect(slugifyTag("React Testing")).toBe("react-testing");
  });

  test("trims leading and trailing separators", () => {
    expect(slugifyTag("  Python + Django! ")).toBe("python-django");
  });
});
