<script setup lang="ts">
import { useRouter } from "vue-router";

import SearchBar from "@/components/SearchBar.vue";

const router = useRouter();

function handleSearch(query: string) {
  router.push({
    name: "search",
    query: { q: query },
  });
}
</script>

<template>
  <main class="d-flex flex-column align-center justify-center" aria-label="Search page main content">
      <h1>
        Search the metadata of journal articles, books, standards, datasets &
        more
      </h1>
      <div class="w-100">

        <SearchBar @search="handleSearch" />
      </div>
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 5rem;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
