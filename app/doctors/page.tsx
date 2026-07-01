import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ThemeToggle from '@/components/ThemeToggle'

export default async function DoctorsPage() {
  const { data: doctors } = await supabase
    .from('doctors')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center text-xl font-bold text-black">H</div>
          <span className="text-3xl font-bold tracking-tighter">helio</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm text-[var(--color-text-tertiary)]">heliohealth.app</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Doctors in Chicago</h1>
        <p className="text-[var(--color-text-secondary)] mb-10">Primary care doctors accepting new patients</p>

        <div className="flex flex-col gap-4">
          {doctors?.map(doctor => (
            <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 rounded-3xl p-6 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent-border)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg flex-shrink-0">
                      {doctor.name.split(' ').map((n: string) => n[0]).slice(1).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-[var(--color-text-primary)] text-lg">{doctor.name}</span>
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
                      <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                        {doctor.specialty?.join(', ')} · {doctor.location_city}, {doctor.location_state}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages?.map((lang: string) => (
                          <span key={lang} className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-xs px-2 py-1 rounded-lg">
                            {lang}
                          </span>
                        ))}
                        {doctor.insurance_accepted?.slice(0, 2).map((ins: string) => (
                          <span key={ins} className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-xs px-2 py-1 rounded-lg">
                            {ins}
                          </span>
                        ))}
                        {doctor.insurance_accepted?.length > 2 && (
                          <span className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] text-xs px-2 py-1 rounded-lg">
                            +{doctor.insurance_accepted.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                <p className="text-sm text-[var(--color-text-secondary)] mt-4 leading-relaxed line-clamp-2">
                  "{doctor.personal_statement}"
                </p>

                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                  {[doctor.communication_style, doctor.care_philosophy].filter(Boolean).map((trait: string) => (
                    <span key={trait} className="text-xs text-[var(--color-accent)] bg-[var(--color-accent-subtle)] border border-[var(--color-accent-border)] px-3 py-1 rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-[var(--color-border)] py-8 px-6 text-center text-sm text-[var(--color-text-tertiary)] mt-auto">
        © {new Date().getFullYear()} Helio Health · heliohealth.app
      </footer>

    </main>
  )
}