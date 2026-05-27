import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { enableSSR } from 'react-query-ssr'
import SimplePage from '../components/pages/simple'

export const Route = createFileRoute('/simple')({
  component: SimpleRouteComponent,
})

function SimpleRouteComponent() {
  const { data } = useQuery({
    ...enableSSR,
    queryKey: ['simple'],
    queryFn: () => 'Hello world!',
  })

  if (!data) return null

  return <SimplePage data={data} />
}
