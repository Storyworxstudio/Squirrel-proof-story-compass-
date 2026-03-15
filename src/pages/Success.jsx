import { useNavigate } from 'react-router-dom'

export default function Success() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
      <div className="max-w-md">
        {/* Check mark */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#514d9f22', border: '1px solid #514d9f66' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ color: '#8b88c9' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: '#8b88c9' }}>
          Payment Confirmed
        </p>

        <h1 className="text-3xl font-bold text-zinc-100 mb-4 leading-tight">
          Welcome to the Squirrel-Proof Beat Sheet!
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed mb-8">
          You're in. Time to wrangle your story into 12 manageable beats.
          Your brain can handle this — one chunk at a time.
        </p>

        <button
          onClick={() => navigate('/sheet')}
          className="btn-primary text-base px-8 py-3 rounded-xl"
        >
          Start Writing
        </button>

        <p className="text-xs text-zinc-700 mt-5">
          A receipt has been sent to your email by Stripe.
        </p>
      </div>
    </div>
  )
}
