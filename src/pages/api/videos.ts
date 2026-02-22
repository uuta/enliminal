import type { APIRoute } from "astro";
import { fetchRelatedVideos } from "@/lib/youtube";
import type { Video } from "@/lib/youtube";

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("query") ?? "";
  const raw = await fetchRelatedVideos(query).catch(() => null);
  const videos: Video[] = raw
    ? (raw.items ?? []).map((item) => ({
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.default.url,
      }))
    : [];
  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
};
