import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import SimplePage from '../components/pages/simple'

export const Route = createFileRoute('/simple')({
  loader: async () => {
    return 'Hello world!'
  },
  component: SimpleRouteComponent,
})

function SimpleRouteComponent() {
  const data = useLoaderData({ from: '/simple' })
  return <SimplePage data={data} />
}
