<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const emit = defineEmits<{
  (e: "search", value: string): void;
}>();

const query = ref((route.query.q as string) || "");

function submitSearch() {
  const formattedQuery = query.value.trim();

  emit("search", formattedQuery);
}
</script>
<template>
  <v-text-field
    data-testid="search-input"
    label="Search"
    placeholder="Title, author, DOI, ORCID iD, etc."
    autocomplete="off"
    v-model="query"
    aria-label="Search publications"
    role="searchbox"
    class="search-bar"
    @keyup.enter="submitSearch"
  ></v-text-field>
</template>

<style scoped>
.search-bar {
  max-width: 800px;
}
</style>
