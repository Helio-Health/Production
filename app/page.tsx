'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const router = useRouter()

  async function handleSubmit() {
    if (!email) return
    setStatus('loading')

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, type: 'patient', city }])

    if (error) {
      if (error.code === '23505') {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } else {
      setStatus('success')
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      <nav className="px-8 py-6 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="5.5" fill="none" stroke="#10b981" strokeWidth="2"/>
            <circle cx="14" cy="14" r="2" fill="#10b981"/>
            <line x1="14" y1="6" x2="14" y2="3.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="22" x2="14" y2="24.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="14" x2="3.5" y2="14" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="14" x2="24.5" y2="14" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8.9" y1="8.9" x2="7.1" y2="7.1" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.1" y1="19.1" x2="20.9" y2="20.9" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.1" y1="8.9" x2="20.9" y2="7.1" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8.9" y1="19.1" x2="7.1" y2="20.9" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl text-white" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>helio</span>
        </div>
        <a href="/signup" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-900 bg-emerald-950 px-4 py-2 rounded-xl">
          Are you a Doctor?
        </a>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">

          <span className="inline-block bg-emerald-950 text-emerald-400 text-sm font-medium px-5 py-2 rounded-full mb-8 border border-emerald-900">
            Launching soon in select cities
          </span>

          <h1 className="text-6xl font-bold tracking-tight leading-tight mb-8">
            The doctor who actually{' '}
            <span className="text-emerald-400">understands you</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-lg mx-auto">
            Real matching based on communication style, values, and care philosophy.
            Not just who has an open slot next Tuesday.
          </p>

          <div className="mb-6 flex gap-3 justify-center flex-wrap">
            <a href="/quiz" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-4 rounded-2xl transition-all text-base">
              Find my doctor
            </a>
            <a href="/doctors" className="inline-block bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-8 py-4 rounded-2xl transition-all text-base border border-white/10">
              Browse all doctors
            </a>
          </div>

          {status === 'success' ? (
            <div className="bg-zinc-900 border border-emerald-900 rounded-3xl p-10 max-w-md mx-auto">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-3">You are in</h3>
              <p className="text-zinc-400">We will let you know as soon as Helio is available in your area.</p>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md mx-auto">

              <p className="text-sm text-zinc-400 mb-4">Get early access when we launch in your city</p>

              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-950 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-zinc-500 text-sm mb-3"
              />

              <input
                type="text"
                placeholder="Your city (optional)"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-950 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-zinc-500 text-sm mb-4"
              />

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !email}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-4 rounded-2xl transition-all text-base mb-3"
              >
                {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm mt-4">Something went wrong. Try again.</p>
              )}

              <p className="text-xs text-zinc-500 mt-5">No spam. Just launch updates.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 py-20 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl font-semibold mb-3">Matched on fit</h3>
            <p className="text-zinc-400">Communication style, care philosophy, and background. Not just insurance networks.</p>
          </div>
          <div>
            <div className="text-5xl mb-6">🎥</div>
            <h3 className="text-2xl font-semibold mb-3">Meet them first</h3>
            <p className="text-zinc-400">Watch short intro videos from doctors before booking. Know who you are actually seeing.</p>
          </div>
          <div>
            <div className="text-5xl mb-6">💬</div>
            <h3 className="text-2xl font-semibold mb-3">Honest reviews</h3>
            <p className="text-zinc-400">Feedback that actually matters. Did they listen? Were they thorough?</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Helio Health · heliohealth.app
      </footer>

    </main>
  )
}