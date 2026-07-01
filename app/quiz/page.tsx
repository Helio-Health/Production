'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const questions = [
  {
    id: 'communication_style',
    question: 'How do you like your doctor to communicate?',
    subtitle: 'Think about past appointments that felt right or wrong.',
    type: 'choice',
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
    type: 'choice',
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
    type: 'choice',
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
    type: 'choice',
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
    type: 'choice',
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
    type: 'choice',
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
    id: 'zip_code',
    question: 'What is your zip code?',
    subtitle: 'We will show you doctors closest to you first.',
    type: 'text',
    placeholder: 'e.g. 60614',
    options: []
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('')
  const [saving, setSaving] = useState(false)

  const current = questions[step]
  const isLast = step === questions.length - 1
  const progress = ((step) / questions.length) * 100
  const isTextQuestion = current.type === 'text'
  const hasAnswer = isTextQuestion ? textInput.length === 5 : !!selected

  function handleSelect(value: string) {
    setSelected(value)
  }

  async function handleNext() {
    if (!hasAnswer) return

    const value = isTextQuestion ? textInput : selected!
    const updatedAnswers = { ...answers, [current.id]: value }
    setAnswers(updatedAnswers)

    if (isLast) {
      setSaving(true)

      const sessionId = crypto.randomUUID()

      await supabase
        .from('patient_preferences')
        .insert([{
          session_id: sessionId,
          communication_style: updatedAnswers.communication_style,
          appointment_pace: updatedAnswers.appointment_pace,
          care_philosophy: updatedAnswers.care_philosophy,
          decision_making: updatedAnswers.decision_making,
          language: updatedAnswers.language,
          insurance: updatedAnswers.insurance,
          zip_code: updatedAnswers.zip_code,
        }])

      router.push(`/doctors?session=${sessionId}&insurance=${updatedAnswers.insurance}&language=${updatedAnswers.language}&zip=${updatedAnswers.zip_code}`)
    } else {
      const nextQuestion = questions[step + 1]
      setSelected(answers[nextQuestion.id] || null)
      setTextInput(answers[nextQuestion.id] || '')
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step === 0) return
    const prevQuestion = questions[step - 1]
    const prevAnswer = answers[prevQuestion.id] || ''
    if (prevQuestion.type === 'text') {
      setTextInput(prevAnswer)
      setSelected(null)
    } else {
      setSelected(prevAnswer || null)
      setTextInput('')
    }
    setStep(step - 1)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      <nav className="px-8 py-6 flex items-center justify-between max-w-3xl mx-auto w-full border-b border-white/10">
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
        <span className="text-sm text-zinc-500">{step + 1} of {questions.length}</span>
      </nav>

      <div className="h-0.5 bg-zinc-800">
        <div className="h-0.5 bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}/>
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">{current.question}</h1>
          {current.subtitle && <p className="text-zinc-400">{current.subtitle}</p>}
        </div>

        {isTextQuestion ? (
          <div className="flex-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder={current.placeholder}
              value={textInput}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 5)
                setTextInput(val)
              }}
              className="w-full px-6 py-5 bg-zinc-900 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-2xl text-white tracking-widest"
            />
            <p className="text-zinc-600 text-sm mt-3">5 digit US zip code</p>
          </div>
        ) : (
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
        )}

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
            disabled={!hasAnswer || saving}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-4 rounded-2xl transition-all text-base"
          >
            {saving ? 'Finding your matches...' : isLast ? 'Find my doctors →' : 'Next →'}
          </button>
        </div>

      </div>

    </main>
  )
}
