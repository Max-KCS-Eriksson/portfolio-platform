import { describe, expect, test } from "vitest";
import { getBlogOverviewLimit, getProjectOverviewLimit, limitOverviewItems } from "./overviewLimits";

describe("overviewLimits", () => {
  test("limits overview items", () => {
    expect(limitOverviewItems(["one", "two", "three"], 2)).toEqual(["one", "two"]);
  });

  test("uses the hard-coded project overview limit", () => {
    expect(getProjectOverviewLimit()).toBe(3);
  });

  test("uses the hard-coded blog overview limit", () => {
    expect(getBlogOverviewLimit()).toBe(2);
  });
});
