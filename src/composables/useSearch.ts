import { searchWorks } from "@/services/crossrefService";
import type { FacetItem, SearchFilters, SearchItem } from "@/types/search";
import { ref } from "vue";

export function useSearch() {
  const ROWS_PER_PAGE = 20;
  const FACET_LIST = ["type-name", "published", "license"]

  const query = ref("");
  const results = ref<SearchItem[]>([]);
  const resultFacets = ref<Record<string, FacetItem> | null>(null);
  const queryInfo = ref<{
    "total-results": number;
    "items-per-page": number;
    "start-index": number;
  } | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const controller = ref<AbortController | null>(null);
  let currentRequestId = 0;

  async function callSearchApi(
    searchQuery: string,
    selectedFilters?: SearchFilters | null,
    offset: number = 0,
    refreshFacetValues: boolean = true,
  ) {
    const requestId = ++currentRequestId;

    // cancel previous request
    controller.value?.abort();

    // create new controller
    controller.value = new AbortController();

    query.value = searchQuery;
    loading.value = true;
    error.value = null;

    try {
      const response = await searchWorks(
        {
          query: searchQuery,
          rows: ROWS_PER_PAGE,
          facet: FACET_LIST,
          filters: selectedFilters,
          offset: offset,
        },
        controller.value.signal,
      );

      // ignore if this is not the latest request
      if (requestId !== currentRequestId) return;

      results.value = response.message.items;

      if (refreshFacetValues) {
        resultFacets.value = response.message.facets ?? null;
      }

      queryInfo.value = {
        "total-results": response.message["total-results"],
        "items-per-page": response.message["items-per-page"],
        "start-index": response.message.query["start-index"],
      };
    } catch (err: any) {
      if (err.name === "AbortError") return;

      if (requestId !== currentRequestId) return;

      error.value = "Failed to fetch results";
    } finally {
      // only the latest request can toggle loading
      if (requestId === currentRequestId) {
        loading.value = false;
      }
    }
  }

  return {
    query,
    queryInfo,
    results,
    resultFacets,
    loading,
    error,
    callSearchApi,
  };
}
