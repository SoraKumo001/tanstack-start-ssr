import React, { useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

const FETCH_WAIT = 50
export const PAGE_SIZE = 30

export interface NewsType {
  id: number
  title: string
  time: number
  url: string
  by: string
  score: number
  descendants: number
  kids?: number[]
  text?: string
}

export const newsFetch = async (id: number): Promise<NewsType> => {
  const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
  const data = await r.json()
  return new Promise<NewsType>((resolve) => setTimeout(() => resolve(data), FETCH_WAIT))
}

export const newsListFetch = (): Promise<number[]> => {
  return fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`)
    .then((v) => {
      if (!v.ok) throw new Error(`HTTP error! status: ${v.status}`)
      return v.json()
    })
    .then((v) => new Promise<number[]>((resolve) => setTimeout(() => resolve(v), FETCH_WAIT)))
}

export const newsLoader = async (page: number) => {
  try {
    const allIds = await newsListFetch()
    const maxPage = Math.max(1, Math.floor(allIds.length / PAGE_SIZE))
    const currentPage = Math.min(Math.max(1, page), maxPage)
    const targetIds = allIds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    
    const newsItems = await Promise.all(
      targetIds.map(async (id) => {
        try {
          const item = await newsFetch(id)
          return { id, data: item, error: null }
        } catch (e) {
          return { id, data: null, error: (e as Error).message }
        }
      })
    )

    return {
      newsItems,
      totalStories: allIds.length,
      currentPage,
      maxPage
    }
  } catch (e) {
    return {
      newsItems: [],
      totalStories: 0,
      currentPage: page,
      maxPage: 1,
      error: (e as Error).message
    }
  }
}

export interface NewsPageProps {
  initialData: Awaited<ReturnType<typeof newsLoader>>
  page: number
}

function NewsCard({ id, initialData, initialError }: { id: number; initialData: NewsType | null; initialError: string | null }) {
  const [data, setData] = useState<NewsType | null>(initialData)
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
      const res = await newsFetch(id)
      setData(res)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="py-3 border-b border-[var(--line)]">
        <div className="flex gap-2 items-center text-sm text-red-500">
          <span>Failed to load news {id}: {error}</span>
          <button 
            onClick={handleReload}
            className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-600 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { title, time, url, by, score, descendants } = data

  return (
    <div className={`py-4 border-b border-[var(--line)] last:border-b-0 transition-opacity duration-200 ${isLoading ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-2 mb-1.5">
        <button 
          onClick={handleReload}
          disabled={isLoading}
          className="flex-shrink-0 rounded border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-medium text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition disabled:opacity-50"
        >
          {isLoading ? '...' : 'Reload'}
        </button>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-base font-semibold text-[var(--sea-ink)] hover:text-[var(--lagoon-deep)] transition decoration-[var(--chip-line)] underline-offset-4"
        >
          {title}
        </a>
      </div>
      <div className="text-xs text-[var(--sea-ink-soft)] pl-16">
        {score} points by <span className="font-semibold text-[var(--sea-ink)]">{by}</span> | {new Date(time * 1000).toLocaleString('en-US', { timeZone: 'UTC' })} UTC | {descendants} comments
      </div>
    </div>
  )
}

export default function NewsPage({ initialData, page }: NewsPageProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleReloadAll = async () => {
    setIsRefreshing(true)
    await router.invalidate()
    setIsRefreshing(false)
  }

  const navigateToPage = (newPage: number) => {
    router.navigate({
      search: (prev: any) => ({ ...prev, page: newPage }),
    })
  }

  const { newsItems, maxPage, error } = initialData

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="display-title mb-1.5 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
            Hacker News
          </h1>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            Hacker News SSR demonstration with custom page size and lazy item loading.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReloadAll}
            disabled={isRefreshing}
            className="rounded-full bg-[rgba(79,184,178,0.12)] border border-[rgba(50,143,151,0.25)] px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:bg-[rgba(79,184,178,0.22)] disabled:opacity-50"
          >
            {isRefreshing ? 'Reloading...' : 'Reload All'}
          </button>
          
          <div className="flex items-center gap-1 border border-[var(--line)] rounded-full bg-[var(--chip-bg)] p-1">
            <button 
              disabled={page <= 1}
              onClick={() => navigateToPage(Math.max(1, page - 1))}
              className="rounded-full px-3 py-1 text-xs font-semibold text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-xs font-medium text-[var(--sea-ink)] px-2">
              {page} / {maxPage}
            </span>
            <button 
              disabled={page >= maxPage}
              onClick={() => navigateToPage(Math.min(maxPage, page + 1))}
              className="rounded-full px-3 py-1 text-xs font-semibold text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="island-shell p-6 rounded-2xl border border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 mb-6">
          <p className="text-red-600 dark:text-red-400">Failed to load news list: {error}</p>
        </div>
      )}

      <section className="island-shell p-6 sm:p-8 rounded-[2rem]">
        {newsItems.length === 0 && !error ? (
          <div className="text-center py-12 text-[var(--sea-ink-soft)] font-medium">
            No stories found.
          </div>
        ) : (
          <div className="flex flex-col">
            {newsItems.map(({ id, data, error: itemError }) => (
              <NewsCard 
                key={id} 
                id={id} 
                initialData={data} 
                initialError={itemError} 
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
