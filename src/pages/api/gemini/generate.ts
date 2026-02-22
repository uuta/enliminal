import type { APIRoute } from "astro";
import { generateKeywordContent } from "@/lib/generateContent";

export const POST: APIRoute = async ({ request }) => {
  const { keyword, extract, pageUrl } = await request.json();
  if (!keyword) return new Response("keyword required", { status: 400 });
  const content = await generateKeywordContent(keyword, extract ?? "", pageUrl ?? "");
  return new Response(JSON.stringify(content), {
    headers: { "Content-Type": "application/json" },
  });
};
