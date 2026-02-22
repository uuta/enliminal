const YT_SEARCH = "https://www.googleapis.com/youtube/v3/search";

interface Response {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails: { default: { url: string } };
    };
  }>;
}

export interface Video {
  title: string;
  channelTitle: string;
  url: string;
  thumbnail: string;
}

export async function fetchRelatedVideos(query: string): Promise<Response> {
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  if (!apiKey) return { items: [] };
  const url = `${YT_SEARCH}?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return { items: [] };
  return res.json();
}
