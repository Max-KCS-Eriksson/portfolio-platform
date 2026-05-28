import { describe, expect, test } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  test("formats date time values with short named month", () => {
    expect(formatDate("2025-12-31T08:00:00Z")).toBe("31 Dec, 2025");
  });
});
