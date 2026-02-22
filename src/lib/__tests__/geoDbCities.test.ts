import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCitiesByLocation, fetchCitiesByCountryCode } from "@/lib/geoDbCities";

const mockCity = {
  id: 1,
  name: "Tokyo",
  city: "Tokyo",
  country: "Japan",
  countryCode: "JP",
  latitude: 35.6762,
  longitude: 139.6503,
};

describe("fetchCitiesByLocation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("GEO_DB_CITIES_API_KEY", "test-key");
  });

  it("resolves with data array containing a City", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [mockCity] }),
      }),
    );

    const result = await fetchCitiesByLocation("+35.6762+139.6503");
    expect(result.data).toHaveLength(1);
    const city = result.data[0];
    expect(typeof city.id).toBe("number");
    expect(typeof city.name).toBe("string");
    expect(typeof city.countryCode).toBe("string");
    expect(typeof city.latitude).toBe("number");
    expect(typeof city.longitude).toBe("number");
  });

  it("constructs URL with location, limit=1, radius=100", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [mockCity] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchCitiesByLocation("+35.6762+139.6503");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("location=");
    expect(calledUrl).toContain("limit=1");
    expect(calledUrl).toContain("radius=100");
  });

  it("forwards x-rapidapi-key header", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [mockCity] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchCitiesByLocation("+35.6762+139.6503");

    const headers = mockFetch.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["x-rapidapi-key"]).toBe("test-key");
  });

  it("rejects with error message on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      }),
    );

    await expect(fetchCitiesByLocation("+35.6762+139.6503")).rejects.toThrow(
      "GeoDB Cities API error: 429",
    );
  });
});

describe("fetchCitiesByCountryCode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("GEO_DB_CITIES_API_KEY", "test-key");
  });

  it("resolves with data array containing a City", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [mockCity] }),
      }),
    );

    const result = await fetchCitiesByCountryCode("JP", "Tokyo", "10");
    expect(result.data).toHaveLength(1);
    const city = result.data[0];
    expect(typeof city.id).toBe("number");
    expect(typeof city.name).toBe("string");
    expect(typeof city.countryCode).toBe("string");
    expect(typeof city.latitude).toBe("number");
    expect(typeof city.longitude).toBe("number");
  });

  it("constructs URL with countryIds, namePrefix, limit", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [mockCity] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchCitiesByCountryCode("JP", "Tokyo", "10");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("countryIds=");
    expect(calledUrl).toContain("namePrefix=");
    expect(calledUrl).toContain("limit=");
  });

  it("forwards x-rapidapi-key header", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [mockCity] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchCitiesByCountryCode("JP", "Tokyo", "10");

    const headers = mockFetch.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["x-rapidapi-key"]).toBe("test-key");
  });

  it("rejects with error message on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchCitiesByCountryCode("JP", "Tokyo", "10")).rejects.toThrow(
      "GeoDB Cities API error: 500",
    );
  });
});
