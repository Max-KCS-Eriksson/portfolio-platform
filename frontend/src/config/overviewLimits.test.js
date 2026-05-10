import { describe, expect, test } from "vitest";
import { getBlogOverviewLimit, getProjectOverviewLimit, limitOverviewItems } from "./overviewLimits";

describe("overviewLimits", () => {
  test("limits overview items", () => {
    expect(limitOverviewItems(["one", "two", "three"], 2)).toEqual(["one", "two"]);
  });

  test("uses configured project overview limits", () => {
    expect(getProjectOverviewLimit({ projectOverviewLimit: 5 })).toBe(5);
  });

  test("uses configured blog overview limits", () => {
    expect(getBlogOverviewLimit({ blogOverviewLimit: 4 })).toBe(4);
  });

  test("falls back for missing, negative, and non-integer limits", () => {
    expect(getProjectOverviewLimit(null)).toBe(3);
    expect(getProjectOverviewLimit({ projectOverviewLimit: -1 })).toBe(3);
    expect(getBlogOverviewLimit({ blogOverviewLimit: 1.5 })).toBe(2);
  });
});
