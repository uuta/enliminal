import type { APIRoute } from "astro";
import { fetchRelatedPapers } from "@/lib/semanticScholar";
import type { Paper } from "@/lib/semanticScholar";

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("query") ?? "";
  const raw = await fetchRelatedPapers(query).catch(() => null);
  const papers: Paper[] = raw
    ? (raw.data ?? []).map((p) => ({
        title: p.title,
        authors: p.authors.map((a) => a.name),
        year: p.year,
        url: `https://www.semanticscholar.org/paper/${p.paperId}`,
      }))
    : [];
  return new Response(JSON.stringify(papers), {
    headers: { "Content-Type": "application/json" },
  });
};
