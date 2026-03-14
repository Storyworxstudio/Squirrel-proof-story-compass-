import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-lg">
        <p className="text-xs text-brand-500 font-bold uppercase tracking-[0.25em] mb-4">
          Your Framework
        </p>

        <h1 className="text-4xl font-bold text-zinc-100 mb-4 leading-tight tracking-tight">
          Squirrel-Proof<br />Beat Sheet
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed mb-8">
          12 beats. 4 acts. One story at a time. Built for writers whose brains
          go sideways — each beat is a contained, manageable chunk with guidance
          when you need it.
        </p>

        <div className="flex items-center justify-center gap-4 mb-10 text-xs text-zinc-600 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500/60" />
            Act 1 — 3 beats
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500/60" />
            Act 2a — 3 beats
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500/60" />
            Act 2b — 3 beats
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-500/60" />
            Act 3 — 3 beats
          </span>
        </div>

        <button
          onClick={() => navigate('/sheet')}
          className="btn-primary text-base px-8 py-3 rounded-xl"
        >
          Start Writing
        </button>

        <p className="text-xs text-zinc-700 mt-4">
          No account needed. Your work stays in your browser.
        </p>
      </div>
    </div>
  )
}
