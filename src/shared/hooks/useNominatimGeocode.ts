import { useState, useEffect, useRef, useCallback } from "react";

export interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  address: NominatimAddress;
}

interface UseNominatimGeocodeOptions {
  debounceMs?: number;
  limit?: number;
}

interface UseNominatimGeocodeReturn {
  results: NominatimResult[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearResults: () => void;
  parseAddressFields: (result: NominatimResult) => {
    city: string;
    state: string;
    zip_code: string;
  };
}

export function useNominatimGeocode(
  options: UseNominatimGeocodeOptions = {},
): UseNominatimGeocodeReturn {
  const { debounceMs = 600, limit = 50 } = options;

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track whether the component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmed = searchQuery.trim();

    // Don't search if query is too short
    if (trimmed.length < 3) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    debounceTimer.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();

        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "json");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("limit", String(limit));
        url.searchParams.set("q", trimmed);

        const response = await fetch(url.toString(), {
          signal: abortControllerRef.current.signal,
          headers: {
            // Nominatim requires a User-Agent header
            "User-Agent": "ModelJaiApp/1.0 (web)",
          },
        });

        if (!mountedRef.current) return;

        if (!response.ok) {
          throw new Error(`Nominatim API error: ${response.status}`);
        }

        const data: NominatimResult[] = await response.json();

        if (!mountedRef.current) return;

        setResults(data);
        setIsLoading(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Request was aborted — this is expected when user types quickly
          return;
        }

        if (!mountedRef.current) return;

        setError(
          err instanceof Error ? err.message : "Failed to fetch address data",
        );
        setResults([]);
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, debounceMs, limit]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  /**
   * Parse a Nominatim result into city, state, zip_code fields
   * for our form fields.
   */
  const parseAddressFields = useCallback(
    (
      result: NominatimResult,
    ): { city: string; state: string; zip_code: string } => {
      const addr = result.address;

      // Nominatim uses different keys for city depending on the region
      // "city" "town" "village" "county" are common
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.county ||
        addr.state_district ||
        "";

      const state = addr.state || "";
      const zip_code = addr.postcode || "";

      return { city, state, zip_code };
    },
    [],
  );

  return {
    results,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    clearResults,
    parseAddressFields,
  };
}
