const SS_SEARCH = "https://api.semanticscholar.org/graph/v1/paper/search";

interface Response {
  data: Array<{
    paperId: string;
    title: string;
    authors: Array<{ name: string }>;
    year: number | null;
  }>;
}

export interface Paper {
  title: string;
  authors: string[];
  year: number | null;
  url: string;
}

export async function fetchRelatedPapers(query: string): Promise<Response> {
  const url = `${SS_SEARCH}?query=${encodeURIComponent(query)}&fields=title,authors,year&limit=5`;
  const res = await fetch(url);
  if (!res.ok) return { data: [] };
  return res.json();
}
