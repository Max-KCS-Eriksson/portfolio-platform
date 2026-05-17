import { describe, expect, test } from "vitest";
import {
  getFeaturedProjectOverviewLimit,
  getOtherProjectOverviewLimit,
  getProjectOverviewLayoutGroupSize,
  limitOverviewItems,
} from "./overviewLimits";

describe("overviewLimits", () => {
  test("limits overview items", () => {
    expect(limitOverviewItems(["one", "two", "three"], 2)).toEqual(["one", "two"]);
  });

  test("uses the hard-coded project overview limit", () => {
    expect(getFeaturedProjectOverviewLimit()).toBe(3);
  });

  test("uses the hard-coded other project overview limit", () => {
    expect(getOtherProjectOverviewLimit()).toBe(6);
  });

  test("keeps project overview limits aligned to layout groups", () => {
    const layoutGroupSize = getProjectOverviewLayoutGroupSize();

    expect(layoutGroupSize).toBe(3);
    expect(getFeaturedProjectOverviewLimit() % layoutGroupSize).toBe(0);
    expect(getOtherProjectOverviewLimit() % layoutGroupSize).toBe(0);
  });
});
