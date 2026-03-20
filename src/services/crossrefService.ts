import type { SearchFilters, SearchResponse } from "@/types/search";

const CROSSREF_API_URL = "https://api.crossref.org/works";

export interface SearchParams {
  query: string;
  rows?: number;
  offset?: number;
  facet?: string[];
  filters?: SearchFilters | null;
}

export async function searchWorks(
  params: SearchParams,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const url = buildSearchUrl(params);
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Crossref API error: ${response.statusText}`);
  }

  return response.json() as Promise<SearchResponse>;
}

function buildSearchUrl(params: SearchParams): string {
  const url = new URL(CROSSREF_API_URL);

  url.searchParams.append("query", params.query);

  if (params.rows) {
    url.searchParams.append("rows", params.rows.toString());
  }

  if (params.offset) {
    url.searchParams.append("offset", params.offset.toString());
  }

  if (params.facet) {
    url.searchParams.append(
      "facet",
      params.facet.map((f) => `${f}:*`).join(","),
    );
  }

  if (params.filters) {
    const filterParts: string[] = [];

    for (const [key, value] of Object.entries(params.filters)) {
      if (Array.isArray(value)) {
        value.forEach((v) => filterParts.push(`${key}:${v}`));
      } else {
        filterParts.push(`${key}:${value}`);
      }
    }

    if (filterParts.length) {
      url.searchParams.append("filter", filterParts.join(","));
    }
  }

  return url.toString();
}
