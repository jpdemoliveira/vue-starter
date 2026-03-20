<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

import type { SearchItem } from "@/types/search";

const route = useRoute();

const props = defineProps<{
  results: SearchItem[];
  queryInfo: {
    "total-results": number;
    "items-per-page": number;
    "start-index": number;
  } | null;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "page-change", page: number): void;
}>();

//
// Helper functions/Props
//
const currentPage = ref(Number(route.query.page) || 1);

const totalPages = computed(() => {
  if (!props.queryInfo) return 0;

  const calculatedPages = Math.ceil(
    props.queryInfo["total-results"] / props.queryInfo["items-per-page"],
  );
  const maxPages = 500;

  return Math.min(calculatedPages, maxPages);
});

const { xs, sm, md } = useDisplay();

const totalVisiblePages = computed(() => {
  if (xs.value) return 3;
  if (sm.value) return 5;
  if (md.value) return 7;

  return 9;
});

function formatAuthors(authors?: { given?: string; family?: string }[]) {
  if (!authors || authors.length === 0) return "Unknown author";

  return authors
    .map((a) => `${a.given ?? ""} ${a.family ?? ""}`.trim())
    .join(", ");
}

function formatYear(published?: { "date-parts": number[][] }) {
  if (!published?.["date-parts"]?.[0]?.[0]) return "";

  return published["date-parts"][0][0];
}

//
// Event handler
//
function handlePageChange(page: number) {
  emit("page-change", page);
}
</script>

<template>
  <div class="d-flex flex-column justify-center">
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      role="status"
      aria-label="Loading search results"
    />

    <div
      v-else-if="error"
      role="alert"
      aria-live="assertive"
      aria-label="Search error"
    >
      {{ error }}
    </div>

    <v-list
      v-else
      aria-label="Search results"
      aria-labelledby="search-results-heading"
    >
      <h2 id="search-results-heading">Search Results</h2>

      <v-list-item v-for="item in results" :key="item.URL">
        <v-list-item-title
          class="text-title-large my-2"
          :aria-label="
            'Open article: ' +
            (item.title?.[0] ?? 'Untitled') +
            ' (opens in new tab)'
          "
        >
          <a
            :href="item.URL"
            target="_blank"
            rel="noopener"
            :aria-label="
              'Open ' + (item.title?.[0] ?? 'Untitled') + ' in new tab'
            "
          >
            {{ item.title?.[0] ?? "Untitled" }}
          </a>
        </v-list-item-title>

        <v-list-item-subtitle class="my-2 text-title-medium">
          <span v-if="item.type" class=" text-uppercase">
            {{ item.type }}
          </span>

          <span v-if="formatYear(item.published)">
            published in
            {{ formatYear(item.published) }}
          </span>
        </v-list-item-subtitle>

        <div class="text-body-medium">
          <strong>Authors:</strong>
          {{ formatAuthors(item.author) }}
        </div>
        <v-divider class="mt-2"></v-divider>
      </v-list-item>
    </v-list>
    <!-- Pagination -->
    <div v-if="queryInfo" class="d-flex justify-center mt-6">
      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        :total-visible="totalVisiblePages"
        @update:modelValue="handlePageChange"
        aria-label="Search results pages"
      />
    </div>
  </div>
</template>
