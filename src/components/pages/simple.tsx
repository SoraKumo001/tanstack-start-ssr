import React from 'react'

export interface SimpleProps {
  data: string
}

export default function SimplePage({ data }: SimpleProps) {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.2),transparent_66%)]" />
        <h1 className="text-3xl font-bold tracking-tight text-[var(--sea-ink)] mb-4">
          Simple Sample
        </h1>
        <div className="text-lg text-[var(--sea-ink-soft)] bg-white/40 dark:bg-black/10 rounded-xl p-4 border border-[var(--chip-line)] inline-block">
          {data}
        </div>
      </section>
    </main>
  )
}
