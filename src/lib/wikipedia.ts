export interface WikiKeyword {
  title: string;
  extract: string;
  pageUrl: string;
}

export async function fetchRandomKeyword(): Promise<WikiKeyword> {
  const res = await fetch(
    "https://en.wikipedia.org/api/rest_v1/page/random/summary",
  );
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);
  const data = await res.json();
  return {
    title: data.title,
    extract: data.extract,
    pageUrl: data.content_urls.desktop.page,
  };
}
