import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ConnectButton from '@/components/ConnectButton'

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
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-3xl mx-auto w-full border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl font-bold text-black">H</div>
          <span className="text-3xl font-bold tracking-tighter">helio</span>
        </Link>
        <Link href="/doctors" className="text-sm text-zinc-500 hover:text-white transition-colors">
          ← Back to doctors
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 w-full flex flex-col gap-4">

        {/* Header card */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-900 flex items-center justify-center text-emerald-400 font-bold text-xl flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-white">{doctor.name}</h1>
                {doctor.accepting_patients ? (
                  <span className="bg-emerald-950 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full border border-emerald-900">
                    Accepting patients
                  </span>
                ) : (
                  <span className="bg-zinc-800 text-zinc-500 text-xs font-medium px-3 py-1 rounded-full">
                    Not accepting
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                {doctor.specialty?.join(', ')} · {doctor.location_city}, {doctor.location_state}
              </p>
              <div className="flex flex-wrap gap-2">
                {doctor.insurance_accepted?.map((ins: string) => (
                  <span key={ins} className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-lg">
                    {ins}
                  </span>
                ))}
                {doctor.languages?.map((lang: string) => (
                  <span key={lang} className="bg-emerald-950 text-emerald-400 text-xs px-2 py-1 rounded-lg border border-emerald-900">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video intro */}
        {doctor.intro_video_url && (
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
            <h2 className="font-semibold text-white mb-4">
              Meet {doctor.name.split(' ')[1]}
            </h2>
            <video src={doctor.intro_video_url} controls className="w-full rounded-2xl" />
          </div>
        )}

        {/* How I practice */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
          <h2 className="font-semibold text-white mb-4">How I practice</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Communication style', value: doctor.communication_style },
              { label: 'Appointment pace', value: doctor.appointment_pace },
              { label: 'Care philosophy', value: doctor.care_philosophy },
              { label: 'New patient focus', value: doctor.new_patient_focus },
            ].map(item => item.value && (
              <div key={item.label} className="bg-zinc-950 border border-white/5 rounded-2xl p-4">
                <div className="text-xs text-zinc-500 mb-1">{item.label}</div>
                <div className="text-sm font-medium text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal statement */}
        {doctor.personal_statement && (
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
            <h2 className="font-semibold text-white mb-4">
              In {doctor.name.split(' ')[1]}'s words
            </h2>
            <p className="text-zinc-400 leading-relaxed italic text-base">
              "{doctor.personal_statement}"
            </p>
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
            <h2 className="font-semibold text-white mb-6">
              What patients say
              <span className="text-zinc-500 font-normal text-sm ml-2">
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
                          <div className="text-xs text-zinc-500 mb-1">{metric.label}</div>
                          <div className="h-1 bg-zinc-800 rounded-full">
                            <div
                              className="h-1 bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${(metric.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed border-l border-white/10 pl-4 flex-1 italic">
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

      <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-zinc-500 mt-auto">
        © {new Date().getFullYear()} Helio Health · heliohealth.app
      </footer>

    </main>
  )
}