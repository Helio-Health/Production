'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

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
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col">

      <nav className="px-8 py-6 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="5.5" fill="none" stroke="#7c3aed" strokeWidth="2"/>
            <circle cx="14" cy="14" r="2" fill="#7c3aed"/>
            <line x1="14" y1="6" x2="14" y2="3.5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="22" x2="14" y2="24.5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="14" x2="3.5" y2="14" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="14" x2="24.5" y2="14" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8.9" y1="8.9" x2="7.1" y2="7.1" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.1" y1="19.1" x2="20.9" y2="20.9" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.1" y1="8.9" x2="20.9" y2="7.1" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8.9" y1="19.1" x2="7.1" y2="20.9" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl text-[var(--color-text-primary)]" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>helio</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a href="/signup" className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-4 py-2 rounded-xl">
            Are you a Doctor?
          </a>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">

          <span className="inline-block bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-sm font-medium px-5 py-2 rounded-full mb-8 border border-[var(--color-accent-border)]">
            Launching soon in select cities
          </span>

          <h1 className="text-6xl font-bold tracking-tight leading-tight mb-8">
            The doctor who actually{' '}
            <span className="text-[var(--color-accent)]">understands you</span>
          </h1>

          <p className="text-xl text-[var(--color-text-secondary)] mb-12 max-w-lg mx-auto">
            Real matching based on communication style, values, and care philosophy.
            Not just who has an open slot next Tuesday.
          </p>

          <div className="mb-6 flex gap-3 justify-center flex-wrap">
            <a href="/quiz" className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-semibold px-8 py-4 rounded-2xl transition-all text-base">
              Find my doctor
            </a>
            <a href="/doctors" className="inline-block bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] font-medium px-8 py-4 rounded-2xl transition-all text-base border border-[var(--color-border)]">
              Browse all doctors
            </a>
          </div>

          {status === 'success' ? (
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-accent-border)] rounded-3xl p-10 max-w-md mx-auto">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-3">You are in</h3>
              <p className="text-[var(--color-text-secondary)]">We will let you know as soon as Helio is available in your area.</p>
            </div>
          ) : (
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-8 max-w-md mx-auto">

              <p className="text-sm text-[var(--color-text-secondary)] mb-4">Get early access when we launch in your city</p>

              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm mb-3"
              />

              <input
                type="text"
                placeholder="Your city (optional)"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-5 py-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm mb-4"
              />

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !email}
                className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)] text-black font-semibold py-4 rounded-2xl transition-all text-base mb-3"
              >
                {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm mt-4">Something went wrong. Try again.</p>
              )}

              <p className="text-xs text-[var(--color-text-tertiary)] mt-5">No spam. Just launch updates.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] py-20 px-6 bg-[var(--color-bg-secondary)]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl font-semibold mb-3">Matched on fit</h3>
            <p className="text-[var(--color-text-secondary)]">Communication style, care philosophy, and background. Not just insurance networks.</p>
          </div>
          <div>
            <div className="text-5xl mb-6">🎥</div>
            <h3 className="text-2xl font-semibold mb-3">Meet them first</h3>
            <p className="text-[var(--color-text-secondary)]">Watch short intro videos from doctors before booking. Know who you are actually seeing.</p>
          </div>
          <div>
            <div className="text-5xl mb-6">💬</div>
            <h3 className="text-2xl font-semibold mb-3">Honest reviews</h3>
            <p className="text-[var(--color-text-secondary)]">Feedback that actually matters. Did they listen? Were they thorough?</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] py-8 px-6 text-center text-sm text-[var(--color-text-tertiary)]">
        © {new Date().getFullYear()} Helio Health · heliohealth.app
      </footer>

    </main>
  )
}