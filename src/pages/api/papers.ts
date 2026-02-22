import type { APIRoute } from 'astro';
import { fetchRelatedPapers } from '@/lib/semanticScholar';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('query') ?? '';
  const papers = await fetchRelatedPapers(query).catch(() => []);
  return new Response(JSON.stringify(papers), {
    headers: { 'Content-Type': 'application/json' },
  });
};
