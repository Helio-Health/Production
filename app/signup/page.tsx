'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-client'
import ThemeToggle from '@/components/ThemeToggle'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const supabase = createSupabaseBrowser()

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  async function handleEmailSignup() {
    if (!email || !password) return
    setStatus('loading')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setErrorMessage(error.message)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="relative flex items-center justify-center mb-10">
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
          <div className="absolute right-0">
            <ThemeToggle />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Join as a doctor</h1>
        <p className="text-[var(--color-text-secondary)] text-sm text-center mb-8">Create your profile and start connecting with patients who are the right fit for how you practice.</p>

        {status === 'success' ? (
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-accent-border)] rounded-3xl p-8 text-center">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Check your email</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">We sent a confirmation link to {email}. Click it to continue setting up your profile.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">

            {/* Google */}
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-medium py-4 rounded-2xl transition-all text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.038l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/10"/>
              <span className="text-xs text-[var(--color-text-tertiary)]">or</span>
              <div className="flex-1 h-px bg-white/10"/>
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm text-[var(--color-text-primary)]"
            />

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm text-[var(--color-text-primary)]"
            />

            {status === 'error' && (
              <p className="text-red-400 text-sm">{errorMessage}</p>
            )}

            <button
              onClick={handleEmailSignup}
              disabled={status === 'loading' || !email || !password}
              className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)] text-black font-semibold py-4 rounded-2xl transition-all text-sm"
            >
              {status === 'loading' ? 'Creating account...' : 'Continue with email'}
            </button>

            <p className="text-xs text-[var(--color-text-tertiary)] text-center mt-2">
              Already have an account?{' '}
              <a href="/login" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">Sign in</a>
            </p>

          </div>
        )}

      </div>
    </main>
  )
}