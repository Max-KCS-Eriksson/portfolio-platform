import { describe, expect, test } from "vitest";
import { asArray, asBoolean, asNumber, asOptionalNumber, asString, isObject } from "./mapperUtils";

describe("mapperUtils", () => {
  test("detects plain objects", () => {
    expect(isObject({ key: "value" })).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(["value"])).toBe(false);
    expect(isObject("value")).toBe(false);
  });

  test("coerces strings with fallbacks", () => {
    expect(asString("value")).toBe("value");
    expect(asString(42)).toBe("");
    expect(asString(42, "fallback")).toBe("fallback");
  });

  test("coerces booleans with fallbacks", () => {
    expect(asBoolean(true, false)).toBe(true);
    expect(asBoolean("true", false)).toBe(false);
  });

  test("coerces numbers with fallbacks", () => {
    expect(asNumber(5)).toBe(5);
    expect(asNumber("5")).toBe(0);
    expect(asNumber("5", 10)).toBe(10);
  });

  test("coerces optional numbers", () => {
    expect(asOptionalNumber(5)).toBe(5);
    expect(asOptionalNumber("5")).toBeUndefined();
  });

  test("coerces arrays", () => {
    expect(asArray(["value"])).toEqual(["value"]);
    expect(asArray("value")).toEqual([]);
  });
});
