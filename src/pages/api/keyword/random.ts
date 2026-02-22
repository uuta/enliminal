import type { APIRoute } from 'astro';
import { fetchRandomKeyword } from '@/lib/wikipedia';
import { fetchRandomHNKeyword } from '@/lib/hackernews';

export const GET: APIRoute = async ({ url }) => {
  const sources = url.searchParams.get('sources')?.split(',') ?? ['wikipedia'];
  const pick = sources[Math.floor(Math.random() * sources.length)];
  const keyword = pick === 'hackernews'
    ? await fetchRandomHNKeyword()
    : await fetchRandomKeyword();
  return new Response(JSON.stringify(keyword), {
    headers: { 'Content-Type': 'application/json' },
  });
};
