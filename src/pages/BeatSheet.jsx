import { useState } from 'react'
import jsPDF from 'jspdf'
import BeatCard from '../components/BeatCard'
import AnalysisPanel from '../components/AnalysisPanel'
import { BEATS, ACTS } from '../utils/beats'
import { analyzeAct, isActReady } from '../utils/analysis'
import { supabase } from '../utils/supabase'

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

const ACT_SUBTITLES = {
  act1:  'Setup',
  act2a: 'New Territory',
  act2b: 'The Turn',
  act3:  'Push Through',
}

function exportPDF(title, beatStates) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const marginX = 60
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const usableWidth = pageWidth - marginX * 2
  let y = 70

  function checkNewPage(needed = 40) {
    if (y + needed > pageHeight - 60) {
      doc.addPage()
      y = 60
    }
  }

  // Branding
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#f59e0b')
  doc.text('STORYWORX', marginX, y)
  y += 22

  // Main title
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#1c1917')
  doc.text('Squirrel-Proof Beat Sheet', marginX, y)
  y += 10

  // Story title
  if (title.trim()) {
    doc.setFontSize(13)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor('#78716c')
    doc.text(title.trim(), marginX, y + 16)
    y += 30
  }

  // Divider
  y += 14
  doc.setDrawColor('#d6d3d1')
  doc.setLineWidth(0.5)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 24

  // Beats by act
  for (const act of ACTS) {
    const actBeats = BEATS.filter(b => b.actKey === act.key)

    checkNewPage(60)

    // Act header
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor('#44403c')
    doc.text(`${act.label.toUpperCase()} — ${ACT_SUBTITLES[act.key]}`, marginX, y)
    y += 20

    for (const beat of actBeats) {
      const content = beatStates[beat.number]?.content?.trim() || ''

      checkNewPage(50)

      // Beat name
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor('#1c1917')
      doc.text(`${beat.number}. ${beat.name}`, marginX, y)

      // Pacing % right-aligned
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor('#a8a29e')
      doc.text(`${beat.pacing}%`, pageWidth - marginX, y, { align: 'right' })
      y += 14

      // Content
      if (content) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor('#44403c')
        const lines = doc.splitTextToSize(content, usableWidth - 12)
        for (const line of lines) {
          checkNewPage(14)
          doc.text(line, marginX + 12, y)
          y += 14
        }
      } else {
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor('#d6d3d1')
        doc.text('(not filled in)', marginX + 12, y)
        y += 14
      }

      y += 6
    }

    y += 14
  }

  // Footer
  checkNewPage(30)
  doc.setDrawColor('#d6d3d1')
  doc.setLineWidth(0.5)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 14

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor('#a8a29e')
  doc.text(
    `Exported ${dateStr}  ·  Squirrel-Proof Beat Sheet  ·  Storyworx`,
    marginX, y
  )

  const filename = title.trim()
    ? `beat-sheet-${title.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`
    : 'beat-sheet.pdf'
  doc.save(filename)
}

function initBeatStates() {
  return BEATS.reduce((acc, beat) => {
    acc[beat.number] = { content: '', isComplete: false }
    return acc
  }, {})
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function BeatSheet() {
  const [title, setTitle] = useState('')
  const [beatStates, setBeatStates] = useState(initBeatStates)
  const [analysis, setAnalysis] = useState(null)

  const [showBanner, setShowBanner] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error
  const [savedSheets, setSavedSheets] = useState(null)  // null = not loaded yet, [] = loaded
  const [loadOpen, setLoadOpen] = useState(false)
  const [loadError, setLoadError] = useState(null)

  function updateBeat(beatNumber, field, value) {
    setBeatStates(prev => ({
      ...prev,
      [beatNumber]: { ...prev[beatNumber], [field]: value },
    }))
  }

  const filledCount = BEATS.filter(beat => {
    const s = beatStates[beat.number]
    return s.isComplete || s.content.trim().length > 0
  }).length

  const completeCount = BEATS.filter(beat => beatStates[beat.number].isComplete).length
  const progressPct = Math.round((filledCount / BEATS.length) * 100)

  function handleAnalyze(actKey, actLabel) {
    setAnalysis({ actKey, actLabel, results: analyzeAct(actKey, beatStates) })
  }

  async function handleSave() {
    setSaveStatus('saving')
    const { error } = await supabase.from('beat_sheets').insert({
      title: title.trim() || 'My Beat Sheet',
      beats: beatStates,
      updated_at: new Date().toISOString(),
    })
    if (error) {
      console.error(error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } else {
      setSaveStatus('saved')
      setSavedSheets(null) // reset so next Load fetch is fresh
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }

  async function handleLoadOpen() {
    setLoadError(null)
    setLoadOpen(true)
    if (savedSheets !== null) return // already fetched
    const { data, error } = await supabase
      .from('beat_sheets')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(20)
    if (error) {
      console.error(error)
      setLoadError('Could not load saved sheets.')
    } else {
      setSavedSheets(data)
    }
  }

  async function handleLoadSheet(id) {
    const { data, error } = await supabase
      .from('beat_sheets')
      .select('title, beats')
      .eq('id', id)
      .single()
    if (error) {
      console.error(error)
      setLoadError('Could not load that sheet.')
      return
    }
    setTitle(data.title)
    setBeatStates(data.beats)
    setLoadOpen(false)
  }

  return (
    <div>
      {/* Unsaved-work warning banner */}
      {showBanner && (
        <div className="flex items-start gap-3 mb-6 px-4 py-3 rounded-xl
                        bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
          <p className="text-sm leading-snug flex-1">
            Your work is not automatically saved. Download your beat sheet as a PDF before closing this tab.
          </p>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss warning"
            className="text-amber-500/60 hover:text-amber-300 text-lg leading-none shrink-0 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Title + Save/Load row */}
      <div className="mb-8 flex items-end gap-3">
        <input
          className="flex-1 text-2xl font-bold text-zinc-100 bg-transparent border-b border-transparent
                     hover:border-zinc-700 focus:border-brand-500 focus:outline-none
                     placeholder:text-zinc-700 pb-1 transition-colors"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Your story title"
          aria-label="Story title"
        />

        <div className="flex items-center gap-2 shrink-0">
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all
                       bg-brand-500 hover:bg-brand-400 text-zinc-950
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? 'Saving…' :
             saveStatus === 'saved'  ? 'Saved ✓' :
             saveStatus === 'error'  ? 'Error' : 'Save'}
          </button>

          {/* Load button */}
          <div className="relative">
            <button
              onClick={handleLoadOpen}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-all
                         border border-zinc-700 text-zinc-400 hover:text-zinc-200
                         hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800"
            >
              Load
            </button>

            {/* Load dropdown */}
            {loadOpen && (
              <div className="absolute right-0 top-10 z-20 w-72 bg-zinc-900 border border-zinc-700
                              rounded-xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                    Saved Sheets
                  </span>
                  <button
                    onClick={() => setLoadOpen(false)}
                    className="text-zinc-600 hover:text-zinc-300 text-base leading-none"
                  >
                    ✕
                  </button>
                </div>

                {loadError && (
                  <p className="px-4 py-3 text-xs text-rose-400">{loadError}</p>
                )}

                {!loadError && savedSheets === null && (
                  <p className="px-4 py-4 text-xs text-zinc-500">Loading…</p>
                )}

                {!loadError && savedSheets !== null && savedSheets.length === 0 && (
                  <p className="px-4 py-4 text-xs text-zinc-500">No saved sheets yet.</p>
                )}

                {!loadError && savedSheets && savedSheets.length > 0 && (
                  <ul className="max-h-64 overflow-y-auto">
                    {savedSheets.map(sheet => (
                      <li key={sheet.id}>
                        <button
                          onClick={() => handleLoadSheet(sheet.id)}
                          className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors
                                     border-b border-zinc-800/60 last:border-0"
                        >
                          <p className="text-sm text-zinc-200 truncate">
                            {sheet.title || 'My Beat Sheet'}
                          </p>
                          <p className="text-xs text-zinc-600 mt-0.5">
                            {formatDate(sheet.updated_at)}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dismiss load dropdown when clicking outside */}
      {loadOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setLoadOpen(false)} />
      )}

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

      {/* PDF Export */}
      <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-center">
        <button
          onClick={() => exportPDF(title, beatStates)}
          className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl
                     border border-zinc-700 text-zinc-400 hover:text-zinc-100
                     hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Download as PDF
        </button>
      </div>

      <div className="h-10" />

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
