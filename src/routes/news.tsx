import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { enableSSR } from 'react-query-ssr'
import NewsPage, { newsLoaderServer } from '../components/pages/news'

type NewsSearch = {
  page?: number
}

export const Route = createFileRoute('/news')({
  validateSearch: (search: Record<string, unknown>): NewsSearch => {
    return {
      page: Number(search.page) || 1,
    }
  },
  component: NewsRouteComponent,
})

function NewsRouteComponent() {
  const { page } = Route.useSearch()
  const currentPage = page || 1
  const { data } = useQuery({
    ...enableSSR,
    queryKey: ['news', currentPage],
    queryFn: () => newsLoaderServer({ data: { page: currentPage } }),
  })

  if (!data) return null

  return <NewsPage news={data} page={currentPage} />
}
