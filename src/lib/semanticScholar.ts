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

export async function fetchRelatedPapers(query: string): Promise<Paper[]> {
  const url = `${SS_SEARCH}?query=${encodeURIComponent(query)}&fields=title,authors,year&limit=5`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: Response = await res.json();
  return (data.data ?? []).map((p) => ({
    title: p.title,
    authors: p.authors.map((a) => a.name),
    year: p.year,
    url: `https://www.semanticscholar.org/paper/${p.paperId}`,
  }));
}
