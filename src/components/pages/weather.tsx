import { useState } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'

export interface WeatherType {
  publishingOffice: string
  reportDatetime: string
  targetArea: string
  headlineText: string
  text: string
}

export const FETCH_CODES = [120000, 130000, 140000]

type WeatherResult = {
  code: number
  data: WeatherType | null
  error: string | null
}

export const fetchWeatherServer = createServerFn({ method: 'GET' })
  .inputValidator((input: number) => input)
  .handler(async ({ data: id }) => {
    const r = await fetch(
      `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${id}.json`,
    )
    if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
    const data = (await r.json()) as WeatherType
    return new Promise<WeatherType>((resolve) =>
      setTimeout(() => resolve(data), 500),
    )
  })

const fetchWeatherResults = async (): Promise<Array<WeatherResult>> => {
  return await Promise.all(
    FETCH_CODES.map(async (code) => {
      try {
        const data = await fetchWeatherServer({ data: code })
        return { code, data, error: null }
      } catch (e) {
        return { code, data: null, error: (e as Error).message }
      }
    }),
  )
}

export const getWeatherDataServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await fetchWeatherResults()
  },
)

export const weatherLoader = async () => {
  return await getWeatherDataServer()
}

export interface WeatherProps {
  initialData: Awaited<ReturnType<typeof weatherLoader>>
}

function WeatherReloadButton({
  code,
  label,
  isLoading,
  onReload,
}: {
  code: number
  label: string
  isLoading: boolean
  onReload: () => Promise<void>
}) {
  return (
    <button
      onClick={onReload}
      disabled={isLoading}
      className="rounded-full border border-[rgba(50,143,151,0.25)] bg-[rgba(79,184,178,0.08)] px-3 py-1.5 text-xs font-semibold text-(--lagoon-deep) transition hover:bg-[rgba(79,184,178,0.18)] disabled:opacity-50"
      aria-label={`Reload weather for area ${code}`}
    >
      {isLoading ? 'Reloading...' : label}
    </button>
  )
}

function WeatherCards({
  results,
  refreshingCodes,
  onReload,
}: {
  results: Array<WeatherResult>
  refreshingCodes: Record<number, boolean>
  onReload: (code: number) => Promise<void>
}) {
  return (
    <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
      {results.map(({ code, data, error }) => {
        if (error) {
          return (
            <div
              key={code}
              className="island-shell p-6 rounded-2xl border border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 text-red-700 dark:text-red-400">
                  Area Code: {code}
                </h2>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  Error loading weather: {error}
                </p>
              </div>
              <WeatherReloadButton
                code={code}
                label="Retry"
                isLoading={!!refreshingCodes[code]}
                onReload={() => onReload(code)}
              />
            </div>
          )
        }

        if (!data) {
          return (
            <div
              key={code}
              className="island-shell p-6 rounded-2xl flex items-center justify-center min-h-50"
            >
              <div className="text-(--sea-ink-soft) font-medium animate-pulse">
                Loading...
              </div>
            </div>
          )
        }

        const { targetArea, reportDatetime, headlineText, text } = data

        return (
          <div
            key={code}
            className="island-shell p-6 rounded-3xl flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-2">
                <h2 className="text-2xl font-bold text-(--sea-ink)">
                  {targetArea}
                </h2>
                <WeatherReloadButton
                  code={code}
                  label="Reload"
                  isLoading={!!refreshingCodes[code]}
                  onReload={() => onReload(code)}
                />
              </div>
              <div className="text-xs text-(--sea-ink-soft) mb-4">
                {new Date(reportDatetime).toLocaleString('ja-JP', {
                  timeZone: 'JST',
                })}
              </div>
              <div className="font-semibold text-sm mb-3 text-(--sea-ink)">
                {headlineText}
              </div>
              <div className="text-sm whitespace-pre-wrap text-(--sea-ink-soft) leading-relaxed">
                {text}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default function WeatherPage({ initialData }: WeatherProps) {
  const queryClient = useQueryClient()
  const [refreshingCodes, setRefreshingCodes] = useState<
    Record<number, boolean>
  >({})

  const handleReload = async (code: number) => {
    setRefreshingCodes((prev) => ({ ...prev, [code]: true }))
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['weather'] }),
        new Promise((resolve) => setTimeout(resolve, 400)),
      ])
    } finally {
      setRefreshingCodes((prev) => ({ ...prev, [code]: false }))
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="mb-8">
        <h1 className="display-title mb-3 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-5xl">
          Weather Forecast
        </h1>
        <p className="text-base text-(--sea-ink-soft) sm:text-lg">
          Data obtained from the JMA (Japan Meteorological Agency) website.
        </p>
      </section>

      <WeatherCards
        results={initialData}
        refreshingCodes={refreshingCodes}
        onReload={handleReload}
      />
    </main>
  )
}
