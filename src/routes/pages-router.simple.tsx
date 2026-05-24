import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import SimplePage from '../components/pages/simple'

export const Route = createFileRoute('/pages-router/simple')({
  loader: async () => {
    return 'Hello world!'
  },
  component: PagesRouterSimpleComponent,
})

function PagesRouterSimpleComponent() {
  const data = useLoaderData({ from: '/pages-router/simple' })
  return <SimplePage data={data} />
}
