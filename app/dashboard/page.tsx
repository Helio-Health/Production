'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-client'
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const [doctor, setDoctor] = useState<any>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signup'); return }

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!doctorData) { router.push('/onboarding'); return }

      setDoctor(doctorData)

      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .order('created_at', { ascending: false })

      setMatches(matchData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function toggleAccepting() {
    if (!doctor) return
    setToggling(true)
    const { data } = await supabase
      .from('doctors')
      .update({ accepting_patients: !doctor.accepting_patients })
      .eq('id', doctor.id)
      .select()
      .single()
    if (data) setDoctor(data)
    setToggling(false)
  }

  async function respondToMatch(matchId: string, decision: 'accepted' | 'declined') {
    await supabase.from('matches').update({ status: decision }).eq('id', matchId)
    setMatches(matches.map(m => m.id === matchId ? { ...m, status: decision } : m))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center">
        <div className="text-[var(--color-text-tertiary)] text-sm">Loading your dashboard...</div>
      </main>
    )
  }

  const pending = matches.filter(m => m.status === 'pending')
  const accepted = matches.filter(m => m.status === 'accepted')
  const displayName = doctor.name?.startsWith('Dr. ')
    ? doctor.name.split(' ')[1]
    : doctor.name

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
          <Link href={`/doctors/${doctor.id}`} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" target="_blank">
            View my profile
          </Link>
          <button onClick={handleSignOut} className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-6">

        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Welcome back, {displayName}</h1>
          <p className="text-[var(--color-text-tertiary)] text-sm mt-1">{doctor.specialty?.join(', ')} · {doctor.location_city}, {doctor.location_state}</p>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="font-semibold text-[var(--color-text-primary)] mb-1">Accepting new patients</div>
            <div className="text-sm text-[var(--color-text-secondary)]">
              {doctor.accepting_patients ? 'Patients can find and request to connect with you' : 'Your profile is hidden from new patient searches'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${doctor.accepting_patients ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)]'}`}>
              {doctor.accepting_patients ? 'Active' : 'Paused'}
            </span>
            <button onClick={toggleAccepting} disabled={toggling} className={`w-12 h-6 rounded-full transition-all relative ${doctor.accepting_patients ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bg-tertiary)]'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${doctor.accepting_patients ? 'right-0.5' : 'left-0.5'}`}/>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="text-xs text-[var(--color-text-tertiary)] mb-2">Total requests</div>
            <div className="text-3xl font-bold text-[var(--color-text-primary)]">{matches.length}</div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="text-xs text-[var(--color-text-tertiary)] mb-2">Pending</div>
            <div className="text-3xl font-bold text-amber-400">{pending.length}</div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="text-xs text-[var(--color-text-tertiary)] mb-2">Accepted</div>
            <div className="text-3xl font-bold text-[var(--color-accent)]">{accepted.length}</div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-6">
            Match requests
            {pending.length > 0 && (
              <span className="ml-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{pending.length} pending</span>
            )}
          </h2>

          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-[var(--color-text-tertiary)] text-sm">No match requests yet.</p>
              <p className="text-[var(--color-text-tertiary)] text-xs mt-1">Share your profile to start receiving requests.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {matches.map(match => (
                <div key={match.id} className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)] font-medium text-sm flex-shrink-0">
                    {match.patient_name ? match.patient_name.split(' ').map((n: string) => n[0]).join('') : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--color-text-primary)] text-sm">{match.patient_name || 'Anonymous patient'}</div>
                    <div className="text-xs text-[var(--color-text-tertiary)] mb-2">{match.patient_email}</div>
                    {match.message && <p className="text-sm text-[var(--color-text-secondary)] italic">"{match.message}"</p>}
                  </div>
                  <div className="flex-shrink-0">
                    {match.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => respondToMatch(match.id, 'accepted')} className="px-3 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black text-xs font-semibold rounded-xl transition-all">Accept</button>
                        <button onClick={() => respondToMatch(match.id, 'declined')} className="px-3 py-1.5 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-xs font-medium rounded-xl transition-all">Decline</button>
                      </div>
                    ) : (
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-xl ${match.status === 'accepted' ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]'}`}>
                        {match.status === 'accepted' ? '✓ Accepted' : 'Declined'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
