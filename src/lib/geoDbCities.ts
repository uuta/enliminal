interface Response {
  data: City[];
}

export interface City {
  id: number;
  wikiDataId?: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  regionCode?: string;
  regionWdId?: string;
  latitude: number;
  longitude: number;
  population?: number;
  distance?: number;
}

const API_HOST = "wft-geo-db.p.rapidapi.com";
const API_BASE = `https://${API_HOST}/v1/geo/cities`;

function getHeaders(): HeadersInit {
  return {
    "x-rapidapi-host": API_HOST,
    "x-rapidapi-key": import.meta.env.GEO_DB_CITIES_API_KEY,
  };
}

export async function fetchCitiesByLocation(location: string): Promise<Response> {
  const params = new URLSearchParams({ location, limit: "1", radius: "100" });
  const res = await fetch(`${API_BASE}?${params}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`GeoDB Cities API error: ${res.status}`);
  return res.json();
}

export async function fetchCitiesByCountryCode(
  countryIds: string,
  namePrefix: string,
  limit: string,
): Promise<Response> {
  const params = new URLSearchParams({ countryIds, namePrefix, limit });
  const res = await fetch(`${API_BASE}?${params}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`GeoDB Cities API error: ${res.status}`);
  return res.json();
}
