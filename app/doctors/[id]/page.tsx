import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ConnectButton from '@/components/ConnectButton'
import ThemeToggle from '@/components/ThemeToggle'

export default async function DoctorProfilePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: doctor } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single()

  if (!doctor) notFound()

  const { data: reviews } = await supabase
    .from('doctor_reviews')
    .select('*')
    .eq('doctor_id', doctor.id)
    .order('created_at', { ascending: false })

  const initials = doctor.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(1)
    .join('')

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-3xl mx-auto w-full border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center text-xl font-bold text-black">H</div>
          <span className="text-3xl font-bold tracking-tighter">helio</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/doctors" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
            ← Back to doctors
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 w-full flex flex-col gap-4">

        {/* Header card */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6">
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent-border)] flex items-center justify-center text-[var(--color-accent)] font-bold text-xl flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{doctor.name}</h1>
                {doctor.accepting_patients ? (
                  <span className="bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--color-accent-border)]">
                    Accepting patients
                  </span>
                ) : (
                  <span className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] text-xs font-medium px-3 py-1 rounded-full">
                    Not accepting
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {doctor.specialty?.join(', ')} · {doctor.location_city}, {doctor.location_state}
              </p>
              <div className="flex flex-wrap gap-2">
                {doctor.insurance_accepted?.map((ins: string) => (
                  <span key={ins} className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-xs px-2 py-1 rounded-lg">
                    {ins}
                  </span>
                ))}
                {doctor.languages?.map((lang: string) => (
                  <span key={lang} className="bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-xs px-2 py-1 rounded-lg border border-[var(--color-accent-border)]">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video intro */}
        {doctor.intro_video_url && (
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6">
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">
              Meet {doctor.name.split(' ')[1]}
            </h2>
            <video src={doctor.intro_video_url} controls className="w-full rounded-2xl" />
          </div>
        )}

        {/* How I practice */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">How I practice</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Communication style', value: doctor.communication_style },
              { label: 'Appointment pace', value: doctor.appointment_pace },
              { label: 'Care philosophy', value: doctor.care_philosophy },
              { label: 'New patient focus', value: doctor.new_patient_focus },
            ].map(item => item.value && (
              <div key={item.label} className="bg-[var(--color-bg-primary)] border border-white/5 rounded-2xl p-4">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">{item.label}</div>
                <div className="text-sm font-medium text-[var(--color-text-primary)]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal statement */}
        {doctor.personal_statement && (
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6">
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">
              In {doctor.name.split(' ')[1]}'s words
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed italic text-base">
              "{doctor.personal_statement}"
            </p>
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6">
            <h2 className="font-semibold text-[var(--color-text-primary)] mb-6">
              What patients say
              <span className="text-[var(--color-text-tertiary)] font-normal text-sm ml-2">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </h2>
            <div className="flex flex-col gap-6">
              {reviews.map((review, i) => (
                <div key={review.id}>
                  {i > 0 && <div className="border-t border-white/5 mb-6" />}
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-3 min-w-[100px]">
                      {[
                        { label: 'Felt heard', score: review.felt_heard_score },
                        { label: 'Communication', score: review.communication_score },
                        { label: 'Trust', score: review.trust_score },
                      ].map(metric => (
                        <div key={metric.label}>
                          <div className="text-xs text-[var(--color-text-tertiary)] mb-1">{metric.label}</div>
                          <div className="h-1 bg-[var(--color-bg-tertiary)] rounded-full">
                            <div
                              className="h-1 bg-[var(--color-accent)] rounded-full transition-all"
                              style={{ width: `${(metric.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed border-l border-[var(--color-border)] pl-4 flex-1 italic">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {doctor.accepting_patients && (
            <ConnectButton doctorId={doctor.id} doctorName={doctor.name} />
        )}

      </div>

      <footer className="border-t border-[var(--color-border)] py-8 px-6 text-center text-sm text-[var(--color-text-tertiary)] mt-auto">
        © {new Date().getFullYear()} Helio Health · heliohealth.app
      </footer>

    </main>
  )
}