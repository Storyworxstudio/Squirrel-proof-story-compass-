import { useState } from 'react'

const ACCESS_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD

export default function PasswordGate({ children }) {
  const [input, setInput]       = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError]       = useState(false)

  if (unlocked) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (input === ACCESS_PASSWORD) {
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-xs">
        {/* Logo */}
        <p className="text-xs text-brand-500 font-bold uppercase tracking-[0.25em] text-center mb-2">
          Storyworx
        </p>
        <p className="text-center text-zinc-500 text-sm mb-8">
          Squirrel-Proof Beat Sheet
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            placeholder="Enter access password"
            autoFocus
            className={`w-full rounded-xl bg-zinc-900 border px-4 py-3 text-sm text-zinc-100
                        placeholder:text-zinc-600 outline-none transition-colors
                        focus:border-brand-500/60
                        ${error ? 'border-rose-500/60' : 'border-zinc-800'}`}
          />

          {error && (
            <p className="text-xs text-rose-400 text-center -mt-1">
              Incorrect password. Try again.
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-3 text-sm rounded-xl"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
