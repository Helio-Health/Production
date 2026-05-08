import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function DoctorsPage() {
  const { data: doctors } = await supabase
    .from('doctors')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl font-bold text-black">H</div>
          <span className="text-3xl font-bold tracking-tighter">helio</span>
        </Link>
        <span className="text-sm text-zinc-500">heliohealth.app</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Doctors in Chicago</h1>
        <p className="text-zinc-400 mb-10">Primary care doctors accepting new patients</p>

        <div className="flex flex-col gap-4">
          {doctors?.map(doctor => (
            <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
              <div className="bg-zinc-900 border border-white/10 hover:border-emerald-500/40 rounded-3xl p-6 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-900 flex items-center justify-center text-emerald-400 font-bold text-lg flex-shrink-0">
                      {doctor.name.split(' ').map((n: string) => n[0]).slice(1).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-white text-lg">{doctor.name}</span>
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
                      <p className="text-sm text-zinc-400 mb-3">
                        {doctor.specialty?.join(', ')} · {doctor.location_city}, {doctor.location_state}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages?.map((lang: string) => (
                          <span key={lang} className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-lg">
                            {lang}
                          </span>
                        ))}
                        {doctor.insurance_accepted?.slice(0, 2).map((ins: string) => (
                          <span key={ins} className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-lg">
                            {ins}
                          </span>
                        ))}
                        {doctor.insurance_accepted?.length > 2 && (
                          <span className="bg-zinc-800 text-zinc-500 text-xs px-2 py-1 rounded-lg">
                            +{doctor.insurance_accepted.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                <p className="text-sm text-zinc-400 mt-4 leading-relaxed line-clamp-2">
                  "{doctor.personal_statement}"
                </p>

                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                  {[doctor.communication_style, doctor.care_philosophy].filter(Boolean).map((trait: string) => (
                    <span key={trait} className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-900 px-3 py-1 rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-zinc-500 mt-auto">
        © {new Date().getFullYear()} Helio Health · heliohealth.app
      </footer>

    </main>
  )
}