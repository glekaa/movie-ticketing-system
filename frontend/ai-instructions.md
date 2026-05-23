# AI Agent Instructions & Development Guidelines

This document serves as the system prompt and operational guide for the AI Agent working within the **Antigravity IDE** for the Movie Ticketing System frontend project. All generated code, refactoring tasks, and component creation must strictly adhere to these architectural rules, styling guidelines, and state management practices.

---

## 1. Project Stack & Core Technologies
* **Framework:** React 18+ (Vite-powered)
* **Language:** TypeScript (Strict Mode)
* **Styling:** Tailwind CSS (Utility-first, semantic approach)
* **Data Fetching & Server State:** TanStack Query v5 (React Query) & Axios

---

## 2. Repository Directory Structure
The AI agent must respect and enforce the following structure when creating or moving files. Do not introduce root-level folders inside `src/` without explicit authorization.

```
frontend/
├── node_modules/
├── public/
└── src/
    ├── assets/          # Static media (images, icons, svgs)
    ├── components/      # Reusable, atomic global UI components
    ├── constants/       # Global application constants (routes, config, enums)
    ├── Layout/          # Layout wrappers (Navbar, Sidebar, Footer wrappers)
    ├── Pages/           # Feature-driven page views/screens
    │   ├── AllMovies/   # Screen displaying full movie catalog
    │   ├── Movies/      # Pages related to movies (main and details page)
    │   └── NotFound/    # Fallback 404 error page
    ├── services/        # API layer, divided by domain/data type
    │   ├── api.ts            # Base Axios instance & configuration
    │   ├── movieServices.ts  # TanStack Query hooks/functions for movies
    │   └── theaterServices.ts# TanStack Query hooks/functions for theaters
    ├── types/           # Shared TypeScript interfaces & types
    │   └── index.ts
    ├── utils/           # Helper functions, formatters, and validators
    │   └── index.ts
    ├── App.tsx          # App entrypoint, routing layer
    ├── index.css        # Tailwind directives & global style overrides
    └── main.tsx         # React DOM rendering root
```

## 3. Component Architecture & Reusability Rules
### 3.1 Reuse-First Paradigm
- Check Before Building: Before creating any UI element (buttons, modals, input cards, tables, loading spinners), scan the src/components/ directory to see if a reusable implementation already exists.
- Parameterize for Context: If a component matches 80% of your requirements, refactor the existing component to accept optional configuration props rather than duplicating the file.
- Atomic Isolation: Keep components small. If a page component exceeds 150 lines of layout code, decompose it into smaller functional elements or extract reusable sub-components into src/components/.

## 4. Server Connection & State Management (Axios & TanStack Query)
### 4.1 Base Client Configuration
All network connections must transit through the configured Axios base client in src/services/api.ts. Do not instantiate individual axios.get or fetch requests inside pages or UI components.

### 4.2 Service Segmentation Rule
Query and mutation configurations must reside inside src/services/ and be divided logically by data types / models.
- movieServices.ts: Managing movie schemas, showtimes, ratings.
- theaterServices.ts: Managing auditoriums, seating maps, venues.
- userServices.ts (or relevant service): Handling authentication, profile configurations, ticket history.

## 5. Markup Cleanliness & Styling Standards (Tailwind CSS)
### 5.1 Eliminating "Divitis" (Excessive DOM Nesting)
The AI agent must minimize excessive DOM tree nesting. Deeply nested, redundant wrapper elements degrade readability and DOM tree performance.
- Rule: Avoid using generic `<div>` blocks purely for spacing, flex alignment, or single-child wrappers unless semantically or structurally mandatory.
- Semantic HTML First: Use precise semantic elements to naturally define layout structures:
  - Use `<main>` for primary workspace areas.
  - Use `<section>` for content divisions within a screen.
  - Use `<article>` for separate layout clusters (e.g., individual Movie Cards).
  - Use `<header>` and `<footer>` for semantic wrapping boundaries.
  - Use React Fragments <></> instead of <div> tags when returning adjacent elements without structural styling.

### 5.2 Tailwind Layout Efficiency
Leverage built-in flexbox and grid styling properties natively to save structural wrappers:
Bad (Excessive nesting):
```
{/* Anti-pattern */}
<div className="flex flex-col">
  <div className="mb-4">
    <h1 className="text-xl">Movie Title</h1>
  </div>
  <div>
    <p className="text-sm">Description text goes here.</p>
  </div>
</div>

Good (Concise):

{/* Correct Pattern */}
<section className="space-y-4">
  <h1 className="text-xl">Movie Title</h1>
  <p className="text-sm">Description text goes here.</p>
</section>
```
### 6. TypeScript & Code Quality Enforcement
- No Explicit any: All variables, arguments, hooks, and API returns must have dedicated explicit type mappings inside src/types/index.ts.
- Immutability: Treat states as read-only. Avoid programmatic direct mutations; always rely on state setters or specialized dispatch actions.
- Error Boundaries: Ensure all generated data-fetching sequences cleanly evaluate the state variables isLoading, isError, and error from TanStack Query, rendering corresponding fallbacks gracefully.
