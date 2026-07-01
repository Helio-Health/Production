'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-client'
import ThemeToggle from '@/components/ThemeToggle'

const STEPS = ['Verify license', 'Your practice', 'How you practice', 'Your profile']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Step 1 — NPI verification
  const [npi, setNpi] = useState('')
  const [npiData, setNpiData] = useState<any>(null)
  const [npiStatus, setNpiStatus] = useState<'idle' | 'loading' | 'verified' | 'error'>('idle')

  // Step 2 — Practice info
  const [specialty, setSpecialty] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [locationState, setLocationState] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [insurance, setInsurance] = useState<string[]>([])

  // Step 3 — How you practice
  const [communicationStyle, setCommunicationStyle] = useState('')
  const [appointmentPace, setAppointmentPace] = useState('')
  const [carePhilosophy, setCarePhilosophy] = useState('')
  const [newPatientFocus, setNewPatientFocus] = useState('')

  // Step 4 — Profile
  const [personalStatement, setPersonalStatement] = useState('')

  const progress = ((step) / STEPS.length) * 100

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/signup')
      else setUserId(data.user.id)
    })
  }, [])

async function verifyNpi() {
  if (npi.length !== 10) return
  setNpiStatus('loading')

  try {
    const res = await fetch(`/api/verify-npi?npi=${npi}`)
    const data = await res.json()

    if (!data.result_count || data.result_count === 0) {
      setNpiStatus('error')
      return
    }

    const provider = data.results[0]
    setNpiData(provider)
    setNpiStatus('verified')
  } catch {
    setNpiStatus('error')
  }
}

  function toggleItem(list: string[], setList: (v: string[]) => void, value: string) {
    if (list.includes(value)) {
      setList(list.filter(i => i !== value))
    } else {
      setList([...list, value])
    }
  }

  async function handleFinish() {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Current user:', user?.id)
  
  if (!userId) return
  setSaving(true)

    const { error } = await supabase
      .from('doctors')
      .upsert({
        user_id: userId,
        npi,
        name: npiData
            ? npiData.enumeration_type === 'NPI-1'
                ? `Dr. ${npiData.basic.first_name} ${npiData.basic.last_name}`
                : npiData.basic.organization_name
            : 'Unknown',
        specialty: specialty ? [specialty] : [],
        location_city: locationCity,
        location_state: locationState,
        languages,
        insurance_accepted: insurance,
        communication_style: communicationStyle,
        appointment_pace: appointmentPace,
        care_philosophy: carePhilosophy,
        new_patient_focus: newPatientFocus,
        personal_statement: personalStatement,
        accepting_patients: true,
      })

    if (error) {
        console.error('Supabase error:', error.message, error.code, error.details)
        setSaving(false)
        return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-3xl mx-auto w-full border-b border-[var(--color-border)]">
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
          <span className="text-sm text-[var(--color-text-tertiary)]">Step {step + 1} of {STEPS.length}</span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="h-0.5 bg-[var(--color-bg-tertiary)]">
        <div className="h-0.5 bg-[var(--color-accent)] transition-all duration-500" style={{ width: `${progress}%` }}/>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 py-12 flex-1">

        {/* Step indicators */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-xs px-3 py-1 rounded-full border ${
              i === step
                ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                : i < step
                ? 'bg-[var(--color-bg-tertiary)] border-zinc-700 text-[var(--color-text-secondary)]'
                : 'border-zinc-800 text-[var(--color-text-tertiary)]'
            }`}>
              {i < step ? '✓ ' : ''}{s}
            </span>
          ))}
        </div>

        {/* Step 0 — NPI Verification */}
        {step === 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-3">Verify your medical license</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Enter your NPI number to confirm your credentials. We check against the CMS National Provider Registry instantly.</p>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="10-digit NPI number"
                value={npi}
                onChange={e => setNpi(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm text-[var(--color-text-primary)] tracking-widest"
              />
              <button
                onClick={verifyNpi}
                disabled={npi.length !== 10 || npiStatus === 'loading'}
                className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)] text-black font-semibold rounded-2xl transition-all text-sm"
              >
                {npiStatus === 'loading' ? 'Checking...' : 'Verify'}
              </button>
            </div>

            {npiStatus === 'verified' && npiData && (
                    <div className="bg-[var(--color-accent-subtle)] border border-[var(--color-accent-border)] rounded-2xl p-5 mb-6">
                    <div className="text-[var(--color-accent)] text-xs font-medium mb-2">✓ License verified</div>
                    <div className="font-semibold text-[var(--color-text-primary)]">
                        {npiData.enumeration_type === 'NPI-1'
                            ? `Dr. ${npiData.basic.first_name} ${npiData.basic.last_name}`
                            : npiData.basic.organization_name}
                        </div>
                    <div className="text-[var(--color-text-secondary)] text-sm mt-1">
                        {npiData.taxonomies?.find((t: any) => t.primary)?.desc || npiData.taxonomies?.[0]?.desc}
                    </div>
                    <div className="text-[var(--color-text-secondary)] text-sm">
                        {npiData.addresses?.[0]?.city}, {npiData.addresses?.[0]?.state}
                    </div>
                </div>
            )}

            {npiStatus === 'error' && (
              <div className="bg-red-950 border border-red-900 rounded-2xl p-4 mb-6">
                <div className="text-red-400 text-sm">NPI not found. Please check the number and try again.</div>
              </div>
            )}

            <button
              onClick={() => setStep(1)}
              disabled={npiStatus !== 'verified'}
              className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)] text-black font-semibold py-4 rounded-2xl transition-all"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 1 — Practice info */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-3">Your practice</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Tell us about your specialty and where you practice.</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-[var(--color-text-tertiary)] mb-1.5 block">Primary specialty</label>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] text-sm text-[var(--color-text-primary)]"
                >
                  <option value="">Select specialty</option>
                  <option>Family Medicine</option>
                  <option>Internal Medicine</option>
                  <option>Geriatrics</option>
                  <option>Pediatrics</option>
                  <option>Sports Medicine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--color-text-tertiary)] mb-1.5 block">City</label>
                  <input
                    type="text"
                    placeholder="Chicago"
                    value={locationCity}
                    onChange={e => setLocationCity(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm text-[var(--color-text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--color-text-tertiary)] mb-1.5 block">State</label>
                  <input
                    type="text"
                    placeholder="IL"
                    maxLength={2}
                    value={locationState}
                    onChange={e => setLocationState(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm text-[var(--color-text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--color-text-tertiary)] mb-2 block">Languages spoken</label>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Spanish', 'Mandarin', 'Hindi', 'Gujarati', 'Yoruba', 'Korean', 'Arabic'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleItem(languages, setLanguages, lang)}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                        languages.includes(lang)
                          ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                          : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-white/30'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--color-text-tertiary)] mb-2 block">Insurance accepted</label>
                <div className="flex flex-wrap gap-2">
                  {['Aetna', 'Blue Cross', 'United', 'Cigna', 'Humana', 'Medicaid', 'Medicare'].map(ins => (
                    <button
                      key={ins}
                      onClick={() => toggleItem(insurance, setInsurance, ins)}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                        insurance.includes(ins)
                          ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                          : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-white/30'
                      }`}
                    >
                      {ins}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(0)} className="px-6 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all text-sm">← Back</button>
              <button
                onClick={() => setStep(2)}
                disabled={!specialty || !locationCity || !locationState}
                className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)] text-black font-semibold py-4 rounded-2xl transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — How you practice */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-bold mb-3">How you practice</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">These answers power our matching algorithm. Patients see this on your profile.</p>

            <div className="flex flex-col gap-6">
              {[
                {
                  label: 'Communication style',
                  value: communicationStyle,
                  setValue: setCommunicationStyle,
                  options: ['Warm and collaborative', 'Clear and direct', 'Empathetic and inquisitive', 'Energetic and motivating']
                },
                {
                  label: 'Appointment pace',
                  value: appointmentPace,
                  setValue: setAppointmentPace,
                  options: ['Thorough, takes time', 'Efficient but thorough', 'Focused and efficient', 'Takes as long as needed']
                },
                {
                  label: 'Care philosophy',
                  value: carePhilosophy,
                  setValue: setCarePhilosophy,
                  options: ['Preventive and holistic', 'Evidence-based', 'Whole-person care', 'Community-centered']
                },
                {
                  label: 'New patient focus',
                  value: newPatientFocus,
                  setValue: setNewPatientFocus,
                  options: ['Long-term relationships', 'Patient education', 'Ongoing wellness', 'Underserved communities']
                },
              ].map(q => (
                <div key={q.label}>
                  <label className="text-xs text-[var(--color-text-tertiary)] mb-2 block">{q.label}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => q.setValue(opt)}
                        className={`text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                          q.value === opt
                            ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                            : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-white/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all text-sm">← Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={!communicationStyle || !appointmentPace || !carePhilosophy || !newPatientFocus}
                className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)] text-black font-semibold py-4 rounded-2xl transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Personal statement */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-bold mb-3">In your own words</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Write a short personal statement for patients. This is the most important thing on your profile — write it like you're talking to a new patient, not writing a bio.</p>

            <textarea
              placeholder="I became a family doctor because..."
              value={personalStatement}
              onChange={e => setPersonalStatement(e.target.value)}
              rows={6}
              className="w-full px-5 py-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-tertiary)] text-sm text-[var(--color-text-primary)] resize-none leading-relaxed mb-2"
            />
            <p className={`text-xs mb-8 ${personalStatement.length < 50 ? 'text-amber-500' : 'text-[var(--color-text-tertiary)]'}`}>
                {personalStatement.length} characters — {personalStatement.length < 50 ? `${50 - personalStatement.length} more to go before you can continue` : 'aim for 200-400'}
            </p>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all text-sm">← Back</button>
              <button
                onClick={handleFinish}
                disabled={personalStatement.length < 50 || saving}
                className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-tertiary)] disabled:text-[var(--color-text-tertiary)] text-black font-semibold py-4 rounded-2xl transition-all"
              >
                {saving ? 'Setting up your profile...' : 'Go live on Helio →'}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}