import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
        <nav className="mx-auto max-w-3xl flex items-center justify-between">
          <Link to="/" className="text-base font-bold text-zinc-100 tracking-tight hover:text-brand-400 transition-colors">
            Squirrel-Proof Beat Sheet
          </Link>
          <span className="text-xs text-zinc-600 font-medium uppercase tracking-widest hidden sm:block">
            Story Structure for ADHD Writers
          </span>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-5 py-10">
        {children}
      </main>

      <footer className="border-t border-zinc-800/60 py-5 text-center text-xs text-zinc-700">
        Squirrel-Proof Beat Sheet &mdash; your framework, your story
      </footer>
    </div>
  )
}
