'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const questions = [
  {
    id: 'communication_style',
    question: 'How do you like your doctor to communicate?',
    subtitle: 'Think about past appointments that felt right or wrong.',
    options: [
      { value: 'Warm and collaborative', label: 'Warm and conversational', description: 'They take time to build a relationship and check in on you as a person' },
      { value: 'Clear and direct', label: 'Clear and efficient', description: 'They get to the point, respect your time, and give direct answers' },
      { value: 'Empathetic and inquisitive', label: 'Empathetic and curious', description: 'They ask lots of questions and really want to understand your situation' },
      { value: 'Energetic and motivating', label: 'Energetic and motivating', description: 'They bring positive energy and help you feel inspired about your health' },
    ]
  },
  {
    id: 'appointment_pace',
    question: 'What kind of appointments work best for you?',
    subtitle: 'There is no right answer — it depends on your life and schedule.',
    options: [
      { value: 'Thorough, takes time', label: 'Long and thorough', description: 'I want plenty of time to cover everything, even if it means waiting longer' },
      { value: 'Efficient but thorough', label: 'Efficient but complete', description: 'Covers everything important without unnecessary time' },
      { value: 'Focused and efficient', label: 'Short and focused', description: 'I am busy and want quick focused visits that respect my schedule' },
      { value: 'Takes as long as needed', label: 'However long it takes', description: 'I want the doctor to take as long as my situation requires' },
    ]
  },
  {
    id: 'care_philosophy',
    question: 'What matters most to you in how a doctor approaches care?',
    subtitle: 'This helps us find someone whose values align with yours.',
    options: [
      { value: 'Preventive and holistic', label: 'Preventive and holistic', description: 'Focus on keeping me healthy long term and treating me as a whole person' },
      { value: 'Evidence-based', label: 'Evidence-based and scientific', description: 'I want a doctor who follows the latest research and clinical guidelines' },
      { value: 'Whole-person care', label: 'Whole-person care', description: 'My mental health, lifestyle, and environment matter as much as my physical symptoms' },
      { value: 'Community-centered', label: 'Community and culturally aware', description: 'I want a doctor who understands my background and community' },
    ]
  },
  {
    id: 'decision_making',
    question: 'How do you want to make decisions about your health?',
    subtitle: 'Some people want guidance, others want to be equal partners.',
    options: [
      { value: 'Patient education', label: 'Teach me everything', description: 'I want to fully understand my options and make informed decisions myself' },
      { value: 'Long-term relationships', label: 'Guide me', description: 'I trust my doctor to recommend what is best and explain their reasoning' },
      { value: 'Ongoing wellness', label: 'True partnership', description: 'I want us to decide together with equal input from both sides' },
      { value: 'Underserved communities', label: 'Advocate for me', description: 'I want a doctor who will fight for my care and navigate the system for me' },
    ]
  },
  {
    id: 'language',
    question: 'Do you need a doctor who speaks a specific language?',
    subtitle: 'We will prioritize doctors who speak your preferred language.',
    options: [
      { value: 'English', label: 'English only is fine', description: null },
      { value: 'Spanish', label: 'Spanish', description: null },
      { value: 'Mandarin', label: 'Mandarin', description: null },
      { value: 'Hindi', label: 'Hindi or Gujarati', description: null },
    ]
  },
  {
    id: 'insurance',
    question: 'What insurance do you have?',
    subtitle: 'We will only show doctors who accept your plan.',
    options: [
      { value: 'Aetna', label: 'Aetna', description: null },
      { value: 'Blue Cross', label: 'Blue Cross Blue Shield', description: null },
      { value: 'United', label: 'United Healthcare', description: null },
      { value: 'Cigna', label: 'Cigna', description: null },
      { value: 'Medicaid', label: 'Medicaid', description: null },
      { value: 'Medicare', label: 'Medicare', description: null },
    ]
  },
  {
    id: 'location_city',
    question: 'What neighborhood are you in?',
    subtitle: 'We will show you doctors closest to you first.',
    options: [
      { value: 'Chicago', label: 'Chicago', description: null },
      { value: 'Lincoln Park', label: 'Lincoln Park', description: null },
      { value: 'Wicker Park', label: 'Wicker Park', description: null },
      { value: 'Hyde Park', label: 'Hyde Park', description: null },
    ]
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const current = questions[step]
  const isLast = step === questions.length - 1
  const progress = ((step) / questions.length) * 100

  function handleSelect(value: string) {
    setSelected(value)
  }

  async function handleNext() {
    if (!selected) return

    const updatedAnswers = { ...answers, [current.id]: selected }
    setAnswers(updatedAnswers)

    if (isLast) {
      setSaving(true)

      const sessionId = crypto.randomUUID()

      await supabase
        .from('patient_preferences')
        .insert([{
          session_id: sessionId,
          ...updatedAnswers
        }])

      router.push(`/doctors?session=${sessionId}&insurance=${updatedAnswers.insurance}&language=${updatedAnswers.language}`)
    } else {
      setSelected(null)
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step === 0) return
    setSelected(answers[questions[step - 1].id] || null)
    setStep(step - 1)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-3xl mx-auto w-full border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl font-bold text-black">H</div>
          <span className="text-3xl font-bold tracking-tighter">helio</span>
        </div>
        <span className="text-sm text-zinc-500">{step + 1} of {questions.length}</span>
      </nav>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-800">
        <div
          className="h-0.5 bg-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">

        {/* Question */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            {current.question}
          </h1>
          {current.subtitle && (
            <p className="text-zinc-400">{current.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 flex-1">
          {current.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`text-left p-5 rounded-2xl border transition-all ${
                selected === option.value
                  ? 'bg-emerald-950 border-emerald-500 text-white'
                  : 'bg-zinc-900 border-white/10 hover:border-white/30 text-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  selected === option.value
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-zinc-600'
                }`}>
                  {selected === option.value && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-zinc-400 mt-1">{option.description}</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-4 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selected || saving}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-4 rounded-2xl transition-all text-base"
          >
            {saving ? 'Finding your matches...' : isLast ? 'Find my doctors →' : 'Next →'}
          </button>
        </div>

      </div>

    </main>
  )
}