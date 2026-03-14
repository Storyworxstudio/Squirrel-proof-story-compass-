import { useState, useEffect } from 'react'

const STATUS_CONFIG = {
  pass: {
    icon: '✅',
    label: 'Strong',
    labelClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/20',
    bgClass: 'bg-emerald-500/5',
  },
  warn: {
    icon: '⚠️',
    label: 'Needs attention',
    labelClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/20',
    bgClass: 'bg-yellow-500/5',
  },
  fail: {
    icon: '❌',
    label: 'Missing',
    labelClass: 'text-red-400',
    borderClass: 'border-red-500/20',
    bgClass: 'bg-red-500/5',
  },
}

function CheckItem({ check }) {
  const cfg = STATUS_CONFIG[check.status]
  return (
    <div className={`rounded-xl border p-4 ${cfg.borderClass} ${cfg.bgClass}`}>
      <div className="flex items-start gap-3">
        <span className="text-base leading-none mt-0.5 flex-shrink-0" aria-hidden="true">
          {cfg.icon}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.labelClass}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-zinc-500">{check.label}</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{check.message}</p>
        </div>
      </div>
    </div>
  )
}

export default function AnalysisPanel({ actLabel, results, onClose }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  function handleClose() {
    setIsOpen(false)
    setTimeout(onClose, 280)
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const passCount = results.filter(r => r.status === 'pass').length
  const total = results.length

  return (
    <>
      {/* Backdrop — subtle, click to close, doesn't block left side visually */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 60%)' }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-label={`Analysis: ${actLabel}`}
        aria-modal="true"
        className={`fixed right-0 top-0 bottom-0 z-50 w-[420px] max-w-[92vw]
                    bg-zinc-900 border-l border-zinc-700/80 shadow-2xl
                    flex flex-col transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-1">
              Act Analysis
            </p>
            <h2 className="text-lg font-bold text-zinc-100">{actLabel}</h2>
            <p className="text-xs text-zinc-500 mt-1">
              {passCount} of {total} checks passed
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors mt-1 flex-shrink-0 p-1"
            aria-label="Close analysis panel"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Score bar */}
        <div className="px-6 py-4 border-b border-zinc-800/60">
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.round((passCount / total) * 100)}%` }}
            />
          </div>
        </div>

        {/* Checks */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {results.map(check => (
            <CheckItem key={check.id} check={check} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800">
          <button
            onClick={handleClose}
            className="btn-ghost w-full justify-center text-center"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
