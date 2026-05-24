import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import WeatherPage, { weatherLoader } from '../components/pages/weather'

export const Route = createFileRoute('/weather')({
  loader: async () => {
    return await weatherLoader()
  },
  component: WeatherRouteComponent,
})

function WeatherRouteComponent() {
  const initialData = useLoaderData({ from: '/weather' })
  return <WeatherPage initialData={initialData} />
}
