import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { enableSSR } from 'react-query-ssr'
import WeatherPage, { weatherLoader } from '../components/pages/weather'

export const Route = createFileRoute('/weather')({
  component: WeatherRouteComponent,
})

function WeatherRouteComponent() {
  const { data } = useQuery({
    ...enableSSR,
    queryKey: ['weather'],
    queryFn: () => weatherLoader(),
  })

  if (!data) return null

  return <WeatherPage forecasts={data} />
}
