'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'patient' | 'doctor'>('patient')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit() {
    if (!email) return
    setStatus('loading')

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, type, city }])

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

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl font-bold">H</div>
          <span className="text-3xl font-bold tracking-tighter">helio</span>
        </div>
        <span className="text-sm text-zinc-500">heliohealth.app</span>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">

          <span className="inline-block bg-emerald-950 text-emerald-400 text-sm font-medium px-5 py-2 rounded-full mb-8 border border-emerald-900">
            Launching soon in select cities
          </span>

          <h1 className="text-6xl font-bold tracking-tight leading-tight mb-8">
            The doctor who actually <span className="text-emerald-400">understands you</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-lg mx-auto">
            Real matching based on communication style, values, and care philosophy — 
            not just who has an open slot next Tuesday.
          </p>

          {status === 'success' ? (
            <div className="bg-zinc-900 border border-emerald-900 rounded-3xl p-10">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-3">You're in</h3>
              <p className="text-zinc-400">
                We'll let you know as soon as Helio is available in your area.
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md mx-auto">

              {/* Toggle */}
              <div className="flex bg-zinc-950 border border-white/10 rounded-2xl p-1.5 mb-6">
                <button
                  onClick={() => setType('patient')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                    type === 'patient'
                      ? 'bg-white text-zinc-900 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  I'm a patient
                </button>
                <button
                  onClick={() => setType('doctor')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                    type === 'doctor'
                      ? 'bg-white text-zinc-900 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  I'm a doctor
                </button>
              </div>

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
                className="w-full px-5 py-4 bg-zinc-950 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-zinc-500 text-sm mb-6"
              />

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !email}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 text-black font-semibold py-4 rounded-2xl transition-all text-base"
              >
                {status === 'loading' 
                  ? 'Joining...' 
                  : type === 'doctor' 
                    ? 'Join as a doctor' 
                    : 'Join the waitlist'
                }
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm mt-4">Something went wrong. Try again.</p>
              )}

              <p className="text-xs text-zinc-500 mt-5">
                No spam. Just launch updates.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-white/10 py-20 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl font-semibold mb-3">Matched on fit</h3>
            <p className="text-zinc-400">
              Communication style, care philosophy, and background. 
              Not just insurance networks.
            </p>
          </div>
          <div>
            <div className="text-5xl mb-6">🎥</div>
            <h3 className="text-2xl font-semibold mb-3">Meet them first</h3>
            <p className="text-zinc-400">
              Watch short intro videos from doctors before booking. 
              Know who you're actually seeing.
            </p>
          </div>
          <div>
            <div className="text-5xl mb-6">💬</div>
            <h3 className="text-2xl font-semibold mb-3">Honest reviews</h3>
            <p className="text-zinc-400">
              Feedback that actually matters — did they listen? Were they thorough?
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Helio Health · heliohealth.app
      </footer>

    </main>
  )
}