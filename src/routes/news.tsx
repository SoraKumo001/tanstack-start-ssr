import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import NewsPage, { newsLoader } from '../components/pages/news'

type NewsSearch = {
  page?: number
}

export const Route = createFileRoute('/news')({
  validateSearch: (search: Record<string, unknown>): NewsSearch => {
    return {
      page: Number(search.page) || 1,
    }
  },
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ deps: { page } }) => {
    return await newsLoader(page || 1)
  },
  component: NewsRouteComponent,
})

function NewsRouteComponent() {
  const initialData = useLoaderData({ from: '/news' })
  const { page } = Route.useSearch()
  return <NewsPage initialData={initialData} page={page || 1} />
}
