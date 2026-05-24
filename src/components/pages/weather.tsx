import React, { useState, useEffect } from 'react'

export interface WeatherType {
  publishingOffice: string
  reportDatetime: string
  targetArea: string
  headlineText: string
  text: string
}

export const FETCH_CODES = [120000, 130000, 140000]

export const fetchWeather = (id: number): Promise<WeatherType> =>
  fetch(`https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${id}.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
      return r.json()
    })
    .then(
      (r) => new Promise<WeatherType>((resolve) => setTimeout(() => resolve(r), 500))
    )

export const weatherLoader = async () => {
  const results = await Promise.all(
    FETCH_CODES.map(async (code) => {
      try {
        const data = await fetchWeather(code)
        return { code, data, error: null }
      } catch (e) {
        return { code, data: null, error: (e as Error).message }
      }
    })
  )
  return results
}

export interface WeatherProps {
  initialData: Awaited<ReturnType<typeof weatherLoader>>
}

function WeatherCard({ code, initialData, initialError }: { code: number; initialData: WeatherType | null; initialError: string | null }) {
  const [data, setData] = useState<WeatherType | null>(initialData)
  const [error, setError] = useState<string | null>(initialError)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setData(initialData)
    setError(initialError)
  }, [initialData, initialError])

  const handleReload = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetchWeather(code)
      setData(res)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="island-shell p-6 rounded-2xl border border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2 text-red-700 dark:text-red-400">Area Code: {code}</h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">Error loading weather: {error}</p>
        </div>
        <button 
          onClick={handleReload}
          className="self-start rounded-full border border-red-300 dark:border-red-900 bg-red-100 dark:bg-red-900/40 px-4 py-2 text-xs font-semibold text-red-700 dark:text-red-300 transition hover:bg-red-200 dark:hover:bg-red-900/60"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="island-shell p-6 rounded-2xl flex items-center justify-center min-h-[200px]">
        <div className="text-[var(--sea-ink-soft)] font-medium animate-pulse">Loading...</div>
      </div>
    )
  }

  const { targetArea, reportDatetime, headlineText, text } = data

  return (
    <div 
      className={`island-shell p-6 rounded-[1.5rem] flex flex-col justify-between transition-all duration-300 ${
        isLoading ? 'opacity-60 saturate-50' : ''
      }`}
      style={{ position: 'relative' }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px] rounded-[1.5rem] flex items-center justify-center z-10">
          <div className="bg-[var(--chip-bg)] border border-[var(--chip-line)] px-4 py-2 rounded-full text-xs font-semibold shadow-md text-[var(--sea-ink)] animate-bounce">
            loading
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-[var(--sea-ink)]">{targetArea}</h2>
          <button 
            onClick={handleReload}
            disabled={isLoading}
            className="rounded-full border border-[rgba(50,143,151,0.25)] bg-[rgba(79,184,178,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--lagoon-deep)] transition hover:bg-[rgba(79,184,178,0.18)] disabled:opacity-50"
          >
            Reload
          </button>
        </div>
        <div className="text-xs text-[var(--sea-ink-soft)] mb-4">
          {new Date(reportDatetime).toLocaleString('ja-JP', {
            timeZone: 'JST',
          })}
        </div>
        <div className="font-semibold text-sm mb-3 text-[var(--sea-ink)]">{headlineText}</div>
        <div className="text-sm whitespace-pre-wrap text-[var(--sea-ink-soft)] leading-relaxed">{text}</div>
      </div>
    </div>
  )
}

export default function WeatherPage({ initialData }: WeatherProps) {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="mb-8">
        <h1 className="display-title mb-3 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          Weather Forecast
        </h1>
        <p className="text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Data obtained from the JMA (Japan Meteorological Agency) website. (SSR + Client-side reloading)
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {FETCH_CODES.map((code) => {
          const item = initialData.find((d) => d.code === code)
          return (
            <WeatherCard
              key={code}
              code={code}
              initialData={item?.data || null}
              initialError={item?.error || null}
            />
          )
        })}
      </section>
    </main>
  )
}
