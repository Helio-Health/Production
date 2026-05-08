'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  doctorId: string
  doctorName: string
}

export default function ConnectButton({ doctorId, doctorName }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const firstName = doctorName.split(' ')[1]

  async function handleSubmit() {
    if (!email) return
    setStatus('loading')

    const { error } = await supabase
      .from('matches')
      .insert([{
        doctor_id: doctorId,
        patient_email: email,
        patient_name: name,
        message: message,
        status: 'pending'
      }])

    if (error) {
      setStatus('error')
      return
    }

    // Notify doctor via your API route
    await fetch('/api/notify-doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId,
        doctorName,
        patientName: name,
        patientEmail: email,
        message
      })
    })

    setStatus('success')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-5 rounded-3xl transition-all text-base"
      >
        Request to connect with {firstName}
      </button>
    )
  }

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-white">Connect with {firstName}</h2>
        <button
          onClick={() => {
            setOpen(false)
            setStatus('idle')
          }}
          className="text-zinc-500 hover:text-white transition-colors text-sm"
        >
          Cancel
        </button>
      </div>

      {status === 'success' ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="font-semibold text-white mb-2">Request sent</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Dr. {firstName} has been notified. You'll hear back at {email} once they've reviewed your request.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Your name</label>
            <input
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Your email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">
              What are you looking for in a doctor?
              <span className="text-zinc-600 ml-1">(optional)</span>
            </label>
            <textarea
              placeholder="e.g. I want a doctor who takes time to explain things and is open to holistic approaches..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm text-white resize-none"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !email}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-4 rounded-2xl transition-all text-sm mt-1"
          >
            {status === 'loading' ? 'Sending...' : 'Send request'}
          </button>

          <p className="text-xs text-zinc-600 text-center">
            Your request goes directly to {firstName}. They'll decide whether to accept.
          </p>
        </div>
      )}
    </div>
  )
}