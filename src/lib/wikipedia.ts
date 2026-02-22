interface Response {
  type: string;
  title: string;
  displaytitle: string;
  pageid: number;
  lang: string;
  dir: string;
  revision: string;
  tid: string;
  timestamp: string;
  description?: string;
  content_urls: {
    desktop: { page: string; revisions: string; edit: string; talk: string };
    mobile: { page: string; revisions: string; edit: string; talk: string };
  };
  extract: string;
  extract_html?: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
}

export async function fetchRandomKeyword(): Promise<Response> {
  const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary");
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);
  return res.json();
}

export async function fetchKeywordByTitle(title: string): Promise<Response> {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  );
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);
  return res.json();
}
