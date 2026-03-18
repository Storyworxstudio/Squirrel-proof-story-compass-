import { useState } from 'react'

const PRICE_LAUNCH   = import.meta.env.VITE_STRIPE_PRICE_LAUNCH
const PRICE_REGULAR  = import.meta.env.VITE_STRIPE_PRICE_REGULAR
const API_BASE       = import.meta.env.VITE_API_URL ?? ''

export default function Home() {
  const [loading, setLoading] = useState(null) // 'launch' | 'regular' | null
  const [error, setError]     = useState(null)

  async function handleCheckout(priceId, key) {
    setLoading(key)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setLoading(null)
      }
    } catch {
      setError('Could not connect. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-lg">
        <p className="text-xs text-brand-500 font-bold uppercase tracking-[0.25em] mb-4">
          Storyworx
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

        {/* Primary CTA — Launch Special */}
        <button
          onClick={() => handleCheckout(PRICE_LAUNCH, 'launch')}
          disabled={loading !== null}
          className="w-full btn-primary text-base px-8 py-4 rounded-xl mb-3
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading === 'launch' ? 'Redirecting…' : 'Get Access — Launch Special $29'}
        </button>

        {/* Secondary CTA — Regular Price */}
        <button
          onClick={() => handleCheckout(PRICE_REGULAR, 'regular')}
          disabled={loading !== null}
          className="w-full text-sm font-medium px-8 py-3 rounded-xl
                     border border-zinc-700 text-zinc-400 hover:text-zinc-200
                     hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800
                     transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading === 'regular' ? 'Redirecting…' : 'Regular Price — $49'}
        </button>

        {error && (
          <p className="text-xs text-rose-400 mt-4">{error}</p>
        )}

        <p className="text-xs text-zinc-700 mt-5">
          Secure checkout via Stripe. One-time payment, lifetime access.
        </p>
      </div>
    </div>
  )
}
