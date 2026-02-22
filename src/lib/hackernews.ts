const HN_TOP = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HN_ITEM = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

interface Response {
  id: number;
  type: "job" | "story" | "comment" | "poll" | "pollopt";
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  deleted?: boolean;
  parent?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  poll?: number;
  parts?: number[];
  descendants?: number;
}

export async function fetchRandomHNKeyword(): Promise<Response> {
  const res = await fetch(HN_TOP);
  if (!res.ok) throw new Error(`HN API error: ${res.status}`);
  const ids: number[] = await res.json();
  const id = ids[Math.floor(Math.random() * Math.min(100, ids.length))];
  const itemRes = await fetch(HN_ITEM(id));
  if (!itemRes.ok) throw new Error(`HN item error: ${itemRes.status}`);
  return itemRes.json();
}
