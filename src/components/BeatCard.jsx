import { useState } from 'react'
import HelpModal from './HelpModal'

const ACT_ACCENT = {
  act1:  'border-l-blue-500/50',
  act2a: 'border-l-violet-500/50',
  act2b: 'border-l-rose-500/50',
  act3:  'border-l-brand-500/50',
}

const STATUS_STYLES = {
  empty:       'bg-zinc-700 hover:bg-zinc-600',
  'in-progress': 'bg-brand-500 hover:bg-brand-400',
  complete:    'bg-emerald-500 hover:bg-emerald-400',
}

const STATUS_LABELS = {
  empty:         'Empty — click to mark in progress',
  'in-progress': 'In progress — click to mark complete',
  complete:      'Complete — click to reset',
}

export default function BeatCard({ beat, beatState, onUpdate }) {
  const [showHelp, setShowHelp] = useState(false)

  const content = beatState.content ?? ''
  const isComplete = beatState.isComplete ?? false

  const status = isComplete
    ? 'complete'
    : content.trim().length > 0
    ? 'in-progress'
    : 'empty'

  function cycleStatus() {
    if (status === 'empty') {
      // nothing to cycle to unless they type something
      return
    } else if (status === 'in-progress') {
      onUpdate('isComplete', true)
    } else {
      onUpdate('isComplete', false)
    }
  }

  return (
    <>
      <div
        className={`beat-card border-l-4 ${ACT_ACCENT[beat.actKey]}`}
      >
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* Beat number badge */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <span className="text-xs font-bold text-zinc-400 font-mono">
              {beat.number}
            </span>
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-zinc-100">
                {beat.name}
              </h3>
              <span className="text-xs text-zinc-600 font-mono">
                ~{beat.pacing}% through your story
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status dot */}
            <button
              onClick={cycleStatus}
              title={STATUS_LABELS[status]}
              aria-label={STATUS_LABELS[status]}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${STATUS_STYLES[status]}`}
            />

            {/* Help button */}
            <button
              onClick={() => setShowHelp(true)}
              aria-label={`Help for ${beat.name}`}
              className="w-5 h-5 rounded-full border border-zinc-700 text-zinc-500
                         hover:border-brand-500 hover:text-brand-400 transition-all
                         flex items-center justify-center text-xs font-bold leading-none"
            >
              ?
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="mt-3 ml-11">
          <textarea
            className="w-full text-sm text-zinc-200 bg-transparent resize-none focus:outline-none
                       placeholder:text-zinc-700 leading-relaxed"
            rows={4}
            value={content}
            onChange={(e) => {
              onUpdate('content', e.target.value)
              // auto-unmark complete if they edit
              if (isComplete) onUpdate('isComplete', false)
            }}
            placeholder="What happens in this beat? Write freely — no wrong answers here."
            aria-label={`${beat.name} — your notes`}
          />
        </div>

        {/* Status bar at bottom */}
        {status !== 'empty' && (
          <div className="mt-3 ml-11 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              status === 'complete' ? 'bg-emerald-500' : 'bg-brand-500'
            }`} />
            <span className="text-xs text-zinc-600">
              {status === 'complete' ? 'Marked complete' : 'In progress'}
              {status === 'in-progress' && (
                <button
                  onClick={() => onUpdate('isComplete', true)}
                  className="ml-2 text-zinc-600 hover:text-emerald-400 transition-colors underline underline-offset-2"
                >
                  mark done
                </button>
              )}
            </span>
          </div>
        )}
      </div>

      {showHelp && (
        <HelpModal beat={beat} onClose={() => setShowHelp(false)} />
      )}
    </>
  )
}
