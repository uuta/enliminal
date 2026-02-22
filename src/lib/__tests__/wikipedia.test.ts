import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchRandomKeyword } from "@/lib/wikipedia";

describe("Wikipedia API client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("ランダムなキーワードを取得できる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          title: "Emergence",
          extract: "創発とは複雑系において...",
          content_urls: {
            desktop: { page: "https://ja.wikipedia.org/wiki/創発" },
          },
        }),
      }),
    );

    const result = await fetchRandomKeyword();
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("extract");
    expect(typeof result.title).toBe("string");
  });

  it("APIエラー時にthrowする", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchRandomKeyword()).rejects.toThrow("Wikipedia API error: 500");
  });
});
