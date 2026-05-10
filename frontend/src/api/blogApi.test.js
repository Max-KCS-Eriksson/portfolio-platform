import { beforeEach, describe, expect, test, vi } from "vitest";
import { apiGet } from "./client";
import { getBlogPost, getBlogPosts, getBlogPostsByTag } from "./blogApi";

vi.mock("./client", () => ({
  apiGet: vi.fn(),
}));

describe("blogApi", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("loads and maps blog posts", async () => {
    apiGet.mockResolvedValue([{ id: 1, title: "First post" }]);

    await expect(getBlogPosts()).resolves.toEqual([
      expect.objectContaining({
        id: 1,
        title: "First post",
      }),
    ]);

    expect(apiGet).toHaveBeenCalledWith("/blog/");
  });

  test("loads and maps blog posts by encoded tag", async () => {
    apiGet.mockResolvedValue([{ id: 2, title: "Tagged post" }]);

    await getBlogPostsByTag("React Testing");

    expect(apiGet).toHaveBeenCalledWith("/blog/tag/React%20Testing/");
  });

  test("loads and maps a blog post by encoded slug", async () => {
    apiGet.mockResolvedValue({ id: 3, title: "Detail post" });

    await expect(getBlogPost("detail post")).resolves.toEqual(
      expect.objectContaining({
        id: 3,
        title: "Detail post",
      }),
    );

    expect(apiGet).toHaveBeenCalledWith("/blog/detail%20post/");
  });
});
