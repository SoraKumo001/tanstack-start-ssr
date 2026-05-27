# TanStack Start SSR & React Query SSR Project

This project is built on **TanStack Start** (SSR) and **TanStack Router**, utilizing **`react-query-ssr`** to achieve Server-Side Rendering (SSR) and client hydration directly within components without using router `loader`s.

---

## 🚀 Getting Started

### Run the Development Server

Install dependencies and start the local development server:

```bash
pnpm install
pnpm run dev
```

### Build for Production

Run typescript check and build for production:

```bash
pnpm run typecheck
pnpm run build
```

### Deploy to Cloudflare Workers

This project is pre-configured and optimized for deployment to Cloudflare Workers:

```bash
pnpm run deploy
```

---

## 🛠️ Tech Stack & Architecture Explanation

### 1. Removing RSC in favor of React Query SSR

This project has removed the complex React Server Components (RSC) configurations, opting for a simpler, highly-stable SSR solution using the **`react-query-ssr`** package.

#### Key Mechanics:

- **Wrapped with `SSRProvider`**:  
  In `src/routes/__root.tsx`, the entire application tree is wrapped under `<QueryClientProvider>` and `<SSRProvider>`. This automatically serializes the data fetched on the server and transfers the state seamlessly to the client side.
- **Seamless Fetching with `enableSSR`**:  
  By spreading the `enableSSR` options within the `useQuery` hooks inside components, queries are automatically evaluated and fetched on the server side during SSR. The client hydrates this state without doing duplicate fetches, reducing the need for route-level `prefetchQuery`, `dehydrate`, and `HydrationBoundary` boilerplate.

---

## 📂 Codebase Overview & Key Features

### 📰 News Page (`/news`)

A paginated Hacker News demonstration.

- **Server Function (`src/components/pages/news.tsx`)**:
  `newsLoaderServer` is created via `createServerFn` and handles fetching the paginated news data on the server side.
- **Route & Data Loading (`src/routes/news.tsx`)**:

  ```tsx
  const { page } = Route.useSearch()
  const currentPage = page || 1

  const { data } = useQuery({
    ...enableSSR,
    queryKey: ['news', currentPage],
    queryFn: () => newsLoaderServer({ data: { page: currentPage } }),
  })
  ```

  Spreading `enableSSR` inside `useQuery` ensures that data for the requested page is pre-fetched on the server during the initial render.

---

### 🌤️ Weather Forecast Page (`/weather`)

A Japanese Meteorological Agency (JMA) weather forecasting demonstration.

- **Server Function (`src/components/pages/weather.tsx`)**:
  `weatherLoader` is a server function that asynchronously fetches weather overview data from the JMA API for multiple areas (Tokyo, Kanagawa, etc.) at once.
- **Route & Data Loading (`src/routes/weather.tsx`)**:
  ```tsx
  const { data } = useQuery({
    ...enableSSR,
    queryKey: ['weather'],
    queryFn: () => weatherLoader(),
  })
  ```
  Just like the news page, combining `useQuery` and `enableSSR` creates a fully SSR-rendered HTML shell for the user. When users trigger the reload-all button, the weather query is invalidated and refetched on the client side.

---

## 📝 Developer Guide

### Adding New Routes

TanStack Router utilizes file-based routing.
When you add new `.tsx` files inside `src/routes/`, the route tree definitions (`src/routeTree.gen.ts`) are automatically updated and compiled.

### SPA Navigation (Linking)

To perform fast client-side SPA navigations, use the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'

;<Link to="/news" search={{ page: 1 }}>
  Read News
</Link>
```
