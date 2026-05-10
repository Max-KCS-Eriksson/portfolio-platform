import { afterEach, describe, expect, test, vi } from "vitest";
import { apiGet } from "./client";

describe("apiGet", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("prefixes API paths and returns parsed JSON", async () => {
    const payload = { ok: true };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload),
    });

    await expect(apiGet("portfolio/")).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith("/api/portfolio/");
  });

  test("does not duplicate the leading slash", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    await apiGet("/core/context/");

    expect(fetchMock).toHaveBeenCalledWith("/api/core/context/");
  });

  test("throws a detailed error for unsuccessful responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue("Server error"),
    });

    await expect(apiGet("/broken/")).rejects.toThrow("GET /api/broken/ failed with 500: Server error");
  });
});
