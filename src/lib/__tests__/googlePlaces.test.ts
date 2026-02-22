import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchNearbyPlaces } from "@/lib/googlePlaces";

const mockPlace = {
  geometry: { location: { lat: 35.6762, lng: 139.6503 } },
  icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
  name: "Tokyo Ramen",
  place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
};

describe("fetchNearbyPlaces", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
  });

  it("resolves with results array containing a PlaceResult", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [mockPlace], status: "OK" }),
      }),
    );

    const result = await fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen" });
    expect(result.results).toHaveLength(1);
    const place = result.results[0];
    expect(typeof place.name).toBe("string");
    expect(typeof place.place_id).toBe("string");
    expect(typeof place.geometry.location.lat).toBe("number");
    expect(typeof place.geometry.location.lng).toBe("number");
  });

  it("constructs URL with location, keyword, radius=10000, language=en", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockPlace], status: "OK" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen" });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("location=");
    expect(calledUrl).toContain("keyword=");
    expect(calledUrl).toContain("radius=10000");
    expect(calledUrl).toContain("language=en");
  });

  it("forwards key query param", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockPlace], status: "OK" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen" });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("key=test-key");
  });

  it("resolves without throwing when status is ZERO_RESULTS", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [], status: "ZERO_RESULTS" }),
      }),
    );

    const result = await fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen" });
    expect(result.results).toHaveLength(0);
  });

  it("throws on API-level error status (HTTP 200)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [], status: "REQUEST_DENIED" }),
      }),
    );

    await expect(
      fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen" }),
    ).rejects.toThrow("Google Places API error: REQUEST_DENIED");
  });

  it("throws when GOOGLE_PLACES_API_KEY is not set", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "");

    await expect(
      fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen" }),
    ).rejects.toThrow("GOOGLE_PLACES_API_KEY is not set");
  });

  it("forwards custom language param", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockPlace], status: "OK" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen", language: "ja" });

    const url = new URL(mockFetch.mock.calls[0][0] as string);
    expect(url.searchParams.get("language")).toBe("ja");
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      }),
    );

    await expect(
      fetchNearbyPlaces({ location: "35.6762,139.6503", keyword: "ramen" }),
    ).rejects.toThrow("Google Places API error: 403");
  });
});
