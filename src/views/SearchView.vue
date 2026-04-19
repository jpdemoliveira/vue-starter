<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import FacetMenu from "@/components/FacetMenu.vue";
import SearchBar from "@/components/SearchBar.vue";
import SearchResults from "@/components/SearchResults.vue";
import { useSearch } from "@/composables/useSearch";
import type { SearchFilters } from "@/types/search";

const route = useRoute();
const router = useRouter();

const { results, queryInfo, resultFacets, loading, error, callSearchApi } =
  useSearch();

const offset = computed(() => {
  const page = Number(route.query.page) || 1;
  const itemsPerPage = queryInfo.value?.["items-per-page"] || 20;

  return (page - 1) * itemsPerPage;
});

onMounted(() => {
  const searchQuery = (route.query.q as string) || "";
  const parsedFilters = parseFilterQuery(route.query.filter as string);

  if (searchQuery) {
    callSearchApi(searchQuery, parsedFilters, offset.value, true);
  }
});

//
// Helper functions
//
function buildFilterQuery(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters["type-name"]) {
    filters["type-name"].forEach((type) => {
      parts.push(`type-name:${type}`);
    });
  }

  if (filters["license.url"]) {
    filters["license.url"].forEach((type) => {
      parts.push(`license.url:${type}`);
    });
  }

  if (filters["from-pub-date"]) {
    parts.push(`from-pub-date:${filters["from-pub-date"]}`);
  }

  if (filters["until-pub-date"]) {
    parts.push(`until-pub-date:${filters["until-pub-date"]}`);
  }

  return parts.join(",");
}

function parseFilterQuery(filterQuery?: string): SearchFilters | null {
  if (!filterQuery) return null

  const filters: SearchFilters = {}

  const entries = filterQuery.split(",")

  for (const entry of entries) {
    const [key, value] = entry.split(":")

    if (!key || !value) continue

    if (key === "type-name") {
      if (!filters["type-name"]) {
        filters["type-name"] = []
      }

      filters["type-name"]!.push(decodeURIComponent(value))
    }

    if (key === "from-pub-date") {
      filters["from-pub-date"] = value
    }

    if (key === "until-pub-date") {
      filters["until-pub-date"] = value
    }
  }

  return Object.keys(filters).length ? filters : null
}

function calculateOffset(page: number, itemsPerPage: number): number {
  return (page - 1) * itemsPerPage;
}

//
// Event handlers
//
function handleSearch(query: string) {
  router
    .push({
      name: "search",
      query: {
        q: query,
      },
    })

    callSearchApi(query, null, 0, true);
}

function handleFilterChange(selectedFilters: SearchFilters) {
  const searchQuery = (route.query.q as string) || "";
  const filterString = buildFilterQuery(selectedFilters);

  router.push({
    name: "search",
    query: {
      ...route.query,
      q: searchQuery,
      filter: filterString || undefined,
    },
  });

  callSearchApi(searchQuery, selectedFilters, offset.value, false);
}

function handlePageChange(page: number) {
  const searchQuery = (route.query.q as string) || "";
  const filterString = (route.query.filter as string) || "";
  const updatedOffset = calculateOffset(
    page,
    queryInfo.value?.["items-per-page"] || 20,
  );

  const parsedFilters = parseFilterQuery(filterString);

  router.push({
    name: "search",
    query: {
      ...route.query,
      q: searchQuery,
      // Only include the filter query if it exists to keep the URL clean
      ...(filterString ? { filter: filterString } : {}),
      page: page.toString(),
    },
  });

  callSearchApi(searchQuery, parsedFilters, updatedOffset, false);
}
</script>
<template>
  <v-container class="w-80">
    <header aria-label="Search page header">
      <h1>CrossRef Search</h1>
      <SearchBar @search="handleSearch" />
    </header>
    <div class="d-md-flex ga-md-12">
      <aside class="facet-menu" aria-label="Search filters">
        <FacetMenu :facets="resultFacets" @filter-change="handleFilterChange" />
      </aside>
      <main aria-label="Search results">
        <SearchResults :results="results" :queryInfo="queryInfo" :loading="loading" :error="error" @page-change="handlePageChange"/>
      </main>
    </div>
  </v-container>
</template>

<style scoped>
.facet-menu {
  min-width: 30%;
}
</style>
