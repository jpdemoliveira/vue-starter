# Vue Starter

Vue 3 + TypeScript + Vite starter.

## Setup

```bash
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | Lint and fix |

## Tech stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript
- Vite
- Vue Router
- Vitest (unit)
- Playwright (E2E)

# Search Interface

## Overview

This project implements a search interface using the Crossref API, supporting:

- Search by query
- Facet filtering
- Pagination
- URL synchronization (shareable/searchable state)

Built with **Vue 3**, **TypeScript**, and **Vuetify**.

---
## Disclaimer on AI Usage

The overall project decisions — including architecture, implementation order, component design, styling, and feature set — were made independently.

AI tools were used to support the implementation with the goal of improving efficiency and reducing development time. Usage included:

- Reasoning support and research assistance
- Writing small utility functions and computed properties  
  (e.g. formatting helpers like `formatAuthors`, `formatYear`, pagination helpers, query string handling)
- Assisting with accessibility improvements (ARIA labels)
- Supporting documentation writing

AI was used as a productivity aid, while all design and technical decisions remained under my control.

---

## Architecture

### Components (self-contained)

All components are **data-independent and reusable**, communicating via props/events.

- **SearchBar**
  - Text input for search
  - Emits: `search`

- **FacetMenu**
  - Displays filters (publication type + year range)
  - Emits: `filter-change`

- **SearchResults**
  - Displays results
  - Emits: `page-change`

---

### Views

- **HomeView**
  - Contains only SearchBar
  - Redirects to SearchView on search

- **SearchView**
  - Composes all components
  - Handles:
    - search
    - filtering
    - pagination
    - URL sync

---

## UI / Styling

**Vuetify** was used to:

- Speed up development
- Provide accessible UI components
- Reduce styling overhead

Tree-shaking was applied to reduce bundle size in production-like build.

Tree-shaking can be simplified with packages, but that was discarded for this assignment

⚠️ Vuetify tree-shaking only applies in a production-like build:

```bash
npm run build
npm run preview
```
---

## Data Layer

### Services

- `searchWorks`
  - Handles API requests
  - Builds query params:
    - query
    - rows
    - offset
    - facets
    - filters

---

### Composables

- **useSearch**
  - Manages:
    - results
    - facets
    - loading state
    - pagination
  - Chosen over global state (e.g. Pinia):
    - Scope is local
    - No shared global state needed
    - Faster to implement for this use case

---

### Types

Defined in `types/search.ts`.

Only necessary API fields were modeled to keep the solution simple and focused.

---

## Development Strategy

The first **2 hours** were dedicated to implementing the **core functionalities** of the application, focusing on delivering a working end-to-end solution (search, API integration, and UI structure).

The additional time was used for **polishing, UX improvements, and documentation**.

### First hour

- Define TypeScript types from API
- Implement API service
- Create `useSearch`
- Setup Vuetify

### Second hour

- Build SearchBar + HomeView
- Build FacetMenu + SearchView
- Build SearchResults

### Additional time (~2h)

#### First ~1h30

- URL synchronization (query, filters, pagination)
- Accessibility improvements
- Pagination
- Styling

#### Last ~30 minutes

- Documentation
- Adding comments to codebase

---

## Performance

- API returns **20 items per request**
- Pagination implemented
- Requests use **AbortController** to prevent race conditions
- Minimal page reloads:
  - Full reload only on new search
  - Other interactions are reactive

⚠️ Vuetify tree-shaking only applies in a production-like build:

```bash
npm run build
npm run preview
```

## Accessibility

- Semantic HTML (`main`, `header`, etc.)
- Full keyboard navigation support
- ARIA labels for improved screen reader usability

### Design Decision

Facet filtering requires explicit confirmation (button / Enter).

Reason:
- Debounced interactions can negatively impact users with motor impairments
- Improves predictability and control over filtering actions

---

## Challenges & Possible Improvements

### 1. Dynamic Facet Mapping

Initial goal: implement a fully dynamic FacetMenu based on API response.

Issue:
- API facet names do not directly map to filter parameters  
  Example:
  - `published` facet → `from-pub-date` / `until-pub-date` filters

Solution:
- Implemented a fixed UI for date range filtering

Possible improvements:

- Data Filters are hard coded and could show only available date range years

**Frontend mapping layer:**
```ts
{
  published: {
    type: 'range',
    filters: ['from-pub-date', 'until-pub-date']
  }
}
```
**API enhancement (ideal):**
```ts
facets: Record<string, {
  "value-count": number
  values: Record<string, number>
  filterOptions?: {
    inputType: "range" | "multi-select"
    mapping: Record<string, string>
  }
}>
```

### 2. Pagination Limitation

Crossref API constraint:
`offset ≤ 9980 (rows = 20)`
This limits pagination to ~500 pages using offset, but for some queries the page number could go way above that.

---

### 3. UX Improvement Opportunities

1. After a new search on `SearchView`:

- Filters should reset visually
- URL is updated correctly and page is refreshed, but UI state could be better synchronized and avoid page refresh.

2. Sorting by relevance, date, authors and other properties could be implemented for better usage of the search engine.
---

## Testing

Due to time constraints, I implemented a basic end-to-end (E2E) test focusing on the search bar functionality.

I recognize that the current test coverage is minimal and could be significantly expanded. As a next step, I would:

- Add E2E tests for facet filtering and pagination  
- Include unit tests for composables and state management (e.g., `useSearch`, filters logic)  
- Improve edge case coverage (empty results, API errors, loading states)  
- Integrate accessibility testing (e.g., keyboard navigation, ARIA validation)

This initial test serves as a foundation to build a more comprehensive testing strategy.

---

## API Feedback

- Easy to use
- Well documented
- Good performance overall

### Inconsistency Noticed on Documentation

Swagger documentation defines `facets` incorrectly, is appears only as `string`.

Actual response structure:

```ts
facets: Record<string, {
  "value-count": number
  values: Record<string, number>
}>