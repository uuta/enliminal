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

export async function fetchRelatedVideos(query: string): Promise<Video[]> {
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];
  const url = `${YT_SEARCH}?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: Response = await res.json();
  return (data.items ?? []).map((item) => ({
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    thumbnail: item.snippet.thumbnails.default.url,
  }));
}
