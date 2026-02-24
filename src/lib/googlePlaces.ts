import type { Language } from "@/lib/lang";

interface Response {
  results: PlaceResult[];
  status: string;
  error_message?: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface Geometry {
  location: Location;
}

interface Photo {
  height?: number;
  width?: number;
  photo_reference?: string;
  html_attributions?: string[];
}

interface PlaceResult {
  business_status?: string;
  geometry: Geometry;
  icon: string;
  name: string;
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  reference?: string;
  price_level?: number;
  photos?: Photo[];
}

const NEARBY_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

interface Props {
  location: string;
  keyword: string;
  language?: Language;
}

export async function fetchNearbyPlaces({
  location,
  keyword,
  language = "en",
}: Props): Promise<Response> {
  const key = import.meta.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set");
  const params = new URLSearchParams({
    key,
    location,
    radius: "10000",
    keyword,
    language,
  });
  const res = await fetch(`${NEARBY_SEARCH_URL}?${params}`);
  if (!res.ok) throw new Error(`Google Places API error: ${res.status}`);
  const body: Response = await res.json();
  if (body.status !== "OK" && body.status !== "ZERO_RESULTS") {
    const detail = body.error_message ? ` — ${body.error_message}` : "";
    throw new Error(`Google Places API error: ${body.status}${detail}`);
  }
  return body;
}
