<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

import type { FacetItem, SearchFilters } from "@/types/search";

const route = useRoute();

const props = defineProps<{
  facets: Record<string, FacetItem> | null;
}>();

const emit = defineEmits<{
  (e: "filter-change", filters: SearchFilters): void;
}>();

const selectedTypes = ref<string[]>([]);
const fromYear = ref<string | null>(null);
const untilYear = ref<string | null>(null);


//
// Helper functions/Props
//
const typeOptions = computed(() => {
  if (!props.facets?.["type-name"]) return [];

  return Object.keys(props.facets["type-name"].values).sort((a, b) =>
    a.localeCompare(b),
  );
});

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  const result: string[] = [];

  for (let y = currentYear; y >= startYear; y--) {
    result.push(String(y));
  }

  return result;
});

function initializeFiltersFromUrl() {
  const filterQuery = route.query.filter as string | undefined;
  if (!filterQuery) return;

  const filters = filterQuery.split(",");

  for (const filter of filters) {
    console.log(filter);
    const [key, value] = filter.split(":");

    if (key === "type-name") {
      selectedTypes.value.push(decodeURIComponent(value));
    }

    if (key === "from-pub-date") {
      fromYear.value = value;
    }

    if (key === "until-pub-date") {
      untilYear.value = value;
    }
  }
}

//
// Event handler
//
function applyFilters() {
  const filters: {
    "from-pub-date"?: string;
    "until-pub-date"?: string;
    "type-name"?: string[];
  } = {};

  if (selectedTypes.value.length) {
    filters["type-name"] = selectedTypes.value;
  }

  if (fromYear.value) {
    filters["from-pub-date"] = fromYear.value;
  }

  if (untilYear.value) {
    filters["until-pub-date"] = untilYear.value;
  }

  emit("filter-change", filters);
}

initializeFiltersFromUrl();
</script>

<template>
  <div
    class="d-flex flex-column"
    v-if="facets"
    role="region"
    aria-labelledby="filters-heading"
  >
    <h2 id="filters-heading">Filters</h2>

    <!-- Publication type -->
    <v-combobox
      v-model="selectedTypes"
      :items="typeOptions"
      label="Publication Type"
      multiple
      chips
      clearable
      :hide-details="true"
      density="comfortable"
      class="mb-4"
      aria-label="Filter by publication type"
    />

    <!-- Year range -->
    <v-select
      v-model="fromYear"
      :items="years"
      label="Published From"
      density="comfortable"
      clearable
      aria-label="Filter results from publication year"
    />

    <v-select
      v-model="untilYear"
      :items="years"
      label="Published Until"
      density="comfortable"
      clearable
      aria-label="Filter results until publication year"
    />

    <!-- Apply button -->
    <v-btn
      color="primary"
      @click="applyFilters"
      aria-label="Apply selected filters to search results"
    >
      Apply Filters
    </v-btn>
  </div>
</template>