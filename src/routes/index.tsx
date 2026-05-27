import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">TanStack Start SSR Demo</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-6xl">
          SSR Samples for TanStack Start
        </h1>
        <p className="mb-8 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          This project demonstrates Server-Side Rendering (SSR) in TanStack Start, 
          rebuilding the exact same components and behavior from the Next.js <code>next-ssr</code> project.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/about"
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            About This Starter
          </Link>
          <a
            href="https://github.com/SoraKumo001/next-ssr"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-(--sea-ink) no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
          >
            Original Source Code
          </a>
        </div>
      </section>

      {/* Samples Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-(--sea-ink) mb-4">Available Samples</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['/news', 'News Sample', 'Hacker News API implementation with custom page sizes and individual story reload.'],
            ['/weather', 'Weather Sample', 'JMA weather forecast data. Showcases multiple concurrent fetches on server.'],
            ['/simple', 'Simple Sample', 'A minimal Hello World page loaded asynchronously on the server.'],
          ].map(([to, title, desc]) => (
            <Link
              key={to}
              to={to}
              className="island-shell feature-card rise-in rounded-2xl p-5 hover:-translate-y-1 transition duration-300 group cursor-pointer no-underline block"
            >
              <h3 className="mb-2 text-base font-bold text-(--sea-ink) group-hover:text-(--lagoon-deep) flex items-center justify-between">
                <span>{title}</span>
                <span className="text-xs border border-(--chip-line) bg-(--chip-bg) rounded-full px-2.5 py-0.5 text-(--sea-ink-soft) font-mono">{to}</span>
              </h3>
              <p className="m-0 text-sm text-(--sea-ink-soft)">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Technical Overview</p>
        <p className="text-sm text-(--sea-ink-soft) leading-relaxed m-0">
          In TanStack Start, SSR works seamlessly by using route loaders. Unlike the original <code>next-ssr</code> which relied on react hooks resolving synchronously on server-side rendering passes, TanStack Start uses a clean, standard <code>loader</code> pattern. We fetch all initial data before rendering, and then instantiate components with that pre-fetched data, supporting individual client-side reloads and UI feedback states.
        </p>
      </section>
    </main>
  )
}
