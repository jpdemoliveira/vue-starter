export interface SearchResponse {
  message: {
    facets?: Record<string, FacetItem>;
    items: SearchItem[];
    "total-results": number;
    "items-per-page": number;
    query: Query;
  };
}

export interface Query {
  "start-index": number;
  "search-terms": string;
}

export interface SearchItem {
  type?: string;
  title?: string[];
  author?: { given?: string; family?: string }[];
  URL?: string;
  published?: { "date-parts": number[][] };
}

export interface FacetItem {
  "value-count": number;
  values: Record<string, number>;
}

export interface SearchFilters {
  "from-pub-date"?: string
  "until-pub-date"?: string
  "type-name"?: string[]
}

