import type { APIRoute } from "astro";
import { fetchRelatedVideos } from "@/lib/youtube";

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("query") ?? "";
  const videos = await fetchRelatedVideos(query).catch(() => []);
  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
};
