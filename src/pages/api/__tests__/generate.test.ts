import { describe, it, expect, vi } from "vitest";
import type { APIContext } from "astro";

vi.mock("openai", () => {
  const mockCreate = vi.fn().mockResolvedValue(
    (async function* () {
      yield { choices: [{ delta: { content: '{"definition":"test"}' } }] };
    })(),
  );
  const MockOpenAI = vi.fn().mockImplementation(function () {
    return {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };
  });
  return { default: MockOpenAI };
});

describe("generate API", () => {
  it("keywordを受け取り200を返す", async () => {
    const { POST } = await import("../openai/generate");
    const req = new Request("http://localhost/api/openai/generate", {
      method: "POST",
      body: JSON.stringify({ keyword: "Emergence", extract: "創発とは" }),
    });
    const res = await POST({ request: req } as APIContext);
    expect(res.status).toBe(200);
  });

  it("keywordなしで400を返す", async () => {
    const { POST } = await import("../openai/generate");
    const req = new Request("http://localhost/api/openai/generate", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST({ request: req } as APIContext);
    expect(res.status).toBe(400);
  });
});
