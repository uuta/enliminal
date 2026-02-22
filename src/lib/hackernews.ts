import type { Keyword } from "@/lib/types";

const HN_TOP = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HN_ITEM = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

interface Response {
  title: string;
  text?: string;
}

export async function fetchRandomHNKeyword(): Promise<Keyword> {
  const res = await fetch(HN_TOP);
  if (!res.ok) throw new Error(`HN API error: ${res.status}`);
  const ids: number[] = await res.json();
  const id = ids[Math.floor(Math.random() * Math.min(100, ids.length))];
  const itemRes = await fetch(HN_ITEM(id));
  if (!itemRes.ok) throw new Error(`HN item error: ${itemRes.status}`);
  const item: Response = await itemRes.json();
  return {
    title: item.title,
    extract: item.text ?? "",
    pageUrl: `https://news.ycombinator.com/item?id=${id}`,
  };
}
