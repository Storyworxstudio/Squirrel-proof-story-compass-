import { useEffect } from 'react'

export default function HelpModal({ beat, onClose }) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Help for ${beat.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-1">
              {beat.act} &middot; Beat {beat.number} &middot; ~{beat.pacing}%
            </p>
            <h2 className="text-lg font-bold text-zinc-100">{beat.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors mt-1 flex-shrink-0"
            aria-label="Close help"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Explanation */}
          <div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {beat.help.explanation}
            </p>
          </div>

          {/* Questions */}
          <div>
            <h3 className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-3">
              Guiding Questions
            </h3>
            <ul className="space-y-2">
              {beat.help.questions.map((q, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-brand-600 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <span className="leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Example
            </h3>
            <blockquote className="border-l-2 border-zinc-700 pl-4">
              <p className="text-sm text-zinc-400 leading-relaxed italic">
                {beat.help.example}
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}
