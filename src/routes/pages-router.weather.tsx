import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import WeatherPage, { weatherLoader } from '../components/pages/weather'

export const Route = createFileRoute('/pages-router/weather')({
  loader: async () => {
    return await weatherLoader()
  },
  component: PagesRouterWeatherComponent,
})

function PagesRouterWeatherComponent() {
  const initialData = useLoaderData({ from: '/pages-router/weather' })
  return <WeatherPage initialData={initialData} />
}
