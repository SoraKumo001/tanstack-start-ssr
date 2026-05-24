import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import NewsPage, { newsLoader } from '../components/pages/news'

type NewsSearch = {
  page?: number
}

export const Route = createFileRoute('/pages-router/news')({
  validateSearch: (search: Record<string, unknown>): NewsSearch => {
    return {
      page: Number(search.page) || 1,
    }
  },
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ deps: { page } }) => {
    return await newsLoader(page || 1)
  },
  component: PagesRouterNewsComponent,
})

function PagesRouterNewsComponent() {
  const initialData = useLoaderData({ from: '/pages-router/news' })
  const { page } = Route.useSearch()
  return <NewsPage initialData={initialData} page={page || 1} />
}
