import { useState } from 'react'
import BeatCard from '../components/BeatCard'
import AnalysisPanel from '../components/AnalysisPanel'
import { BEATS, ACTS } from '../utils/beats'
import { analyzeAct, isActReady } from '../utils/analysis'

const ACT_LABEL_STYLES = {
  act1:  'text-blue-400 bg-blue-500/10 border border-blue-500/20',
  act2a: 'text-violet-400 bg-violet-500/10 border border-violet-500/20',
  act2b: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
  act3:  'text-brand-400 bg-brand-500/10 border border-brand-500/20',
}

const ACT_DESCRIPTIONS = {
  act1:  'Setup — establish who your protagonist is before the world changes.',
  act2a: 'New territory — early wins, growing obstacles, stakes rising.',
  act2b: 'The turn — midpoint revelation, regrouping, the darkest moment.',
  act3:  'Push through — the final plan, the climax, the new world.',
}

function initBeatStates() {
  return BEATS.reduce((acc, beat) => {
    acc[beat.number] = { content: '', isComplete: false }
    return acc
  }, {})
}

export default function BeatSheet() {
  const [title, setTitle] = useState('')
  const [beatStates, setBeatStates] = useState(initBeatStates)
  const [analysis, setAnalysis] = useState(null) // { actKey, actLabel, results }

  function updateBeat(beatNumber, field, value) {
    setBeatStates(prev => ({
      ...prev,
      [beatNumber]: { ...prev[beatNumber], [field]: value },
    }))
  }

  // Progress: beats with any content or marked complete
  const filledCount = BEATS.filter(beat => {
    const s = beatStates[beat.number]
    return s.isComplete || s.content.trim().length > 0
  }).length

  const completeCount = BEATS.filter(beat => beatStates[beat.number].isComplete).length

  const progressPct = Math.round((filledCount / BEATS.length) * 100)

  function handleAnalyze(actKey, actLabel) {
    setAnalysis({ actKey, actLabel, results: analyzeAct(actKey, beatStates) })
  }

  return (
    <div>
      {/* Title input */}
      <div className="mb-8">
        <input
          className="text-2xl font-bold text-zinc-100 bg-transparent border-b border-transparent
                     hover:border-zinc-700 focus:border-brand-500 focus:outline-none w-full
                     placeholder:text-zinc-700 pb-1 transition-colors"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Your story title"
          aria-label="Story title"
        />
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500 font-medium">
            {filledCount} of {BEATS.length} beats filled
          </span>
          <span className="text-xs text-zinc-600">
            {completeCount} complete
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {filledCount === BEATS.length && (
          <p className="text-xs text-brand-400 mt-2 font-medium">
            All beats filled. Nice work.
          </p>
        )}
      </div>

      {/* Beats grouped by act */}
      <div className="space-y-12">
        {ACTS.map(act => {
          const actBeats = BEATS.filter(b => b.actKey === act.key)
          return (
            <section key={act.key} aria-labelledby={`act-${act.key}`}>
              {/* Act header */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  id={`act-${act.key}`}
                  className={`text-xs font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full ${ACT_LABEL_STYLES[act.key]}`}
                >
                  {act.label}
                </span>
                <span className="text-xs text-zinc-600 hidden sm:block">
                  {ACT_DESCRIPTIONS[act.key]}
                </span>
              </div>

              <div className="space-y-3">
                {actBeats.map(beat => (
                  <BeatCard
                    key={beat.number}
                    beat={beat}
                    beatState={beatStates[beat.number]}
                    onUpdate={(field, value) => updateBeat(beat.number, field, value)}
                  />
                ))}
              </div>

              {/* Analyze Act footer */}
              <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/60">
                {isActReady(act.key, beatStates) ? (
                  <button
                    onClick={() => handleAnalyze(act.key, act.label)}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300
                               border border-brand-500/30 hover:border-brand-400/50
                               px-4 py-2 rounded-lg transition-all bg-brand-500/5 hover:bg-brand-500/10"
                  >
                    Analyze {act.label}
                  </button>
                ) : (
                  <p className="text-xs text-zinc-700 italic">
                    Complete all beats in this act before analyzing
                  </p>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* Bottom spacer */}
      <div className="h-16" />

      {/* Analysis panel */}
      {analysis && (
        <AnalysisPanel
          actLabel={analysis.actLabel}
          results={analysis.results}
          onClose={() => setAnalysis(null)}
        />
      )}
    </div>
  )
}
