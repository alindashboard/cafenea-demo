import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { SITE_CONFIG } from '@/lib/config'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Despre noi',
  description: 'Povestea Brew & Bean — specialty coffee în Bistrița din 2021. Aflați despre valorile noastre, echipa și prăjitoriile partenere.',
  alternates: { canonical: `${SITE_CONFIG.url}/despre` },
}

const TEAM = [
  {
    name: 'Mihai Popa',
    role: 'Head Barista & Co-fondator',
    bio: 'Pasionat de cafea de specialitate de peste 8 ani, Mihai a studiat extracția espresso-ului la Viena și Varșovia. Visul lui a fost mereu o cafenea în Bistrița natală.',
  },
  {
    name: 'Ioana Rus',
    role: 'Barista & Latte Artist',
    bio: 'Câștigătoare a competiției regionale de latte art în 2022, Ioana transformă fiecare ceașcă într-o mică operă de artă. Specialitatea ei: matcha latte cu lapte de ovăz.',
  },
  {
    name: 'Alex Morar',
    role: 'Barista & Responsabil Food',
    bio: 'Alex se ocupă de meniul de food — rețetele sunt în mare parte ale lui. Banana bread-ul pe care îl iubesc toți clienții? Al lui.',
  },
]

const VALUES = [
  {
    icon: '☕',
    title: 'Specialty Coffee',
    description: 'Lucrăm exclusiv cu boabe specialty (85+ puncte SCA), achiziționate direct de la prăjitorii cu relații directe cu fermierii.',
  },
  {
    icon: '🌱',
    title: 'Sustenabilitate',
    description: 'Ceștile noastre sunt biodegradabile, ofertele de reîncărcare reduc deșeurile, iar zaharurile provin de la producători locali.',
  },
  {
    icon: '🤝',
    title: 'Comunitate',
    description: 'Organizăm lunar cupping sessions și latte art throwdown-uri deschise publicului. Credem că specialty coffee e pentru toți.',
  },
]

const ROASTERS = [
  {
    name: 'Origo Coffee',
    city: 'București',
    description: 'Pionieri ai specialty coffee în România, Origo lucrează cu origini din Etiopia, Colombia și Guatemala.',
  },
  {
    name: 'Sloane Coffee',
    city: 'Cluj-Napoca',
    description: 'Prăjitorie de referință din Cluj, cu focus pe single origin și procese naturale și honey.',
  },
]

export default function DesprePage() {
  const { business, branding } = SITE_CONFIG

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="py-20 px-4 text-center"
          style={{ background: 'linear-gradient(135deg, #1A0F0A, #2C1810)' }}>
          <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: '#D4956A' }}>
            Povestea noastră
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FDF6EE] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Despre Brew & Bean
          </h1>
          <p className="text-[#D4C4B0] max-w-xl mx-auto leading-relaxed">
            O cafenea de specialitate fondată cu o misiune simplă: cafea bună, fără compromis, în Bistrița.
          </p>
        </section>

        {/* Povestea */}
        <section className="py-20 px-4" style={{ backgroundColor: '#FDF6EE' }}>
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: '#D4956A' }}>Cum a început</p>
            <h2 className="text-3xl font-bold text-[#1A0F0A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              2021 — Un vis din Bistrița
            </h2>
            <div className="space-y-5 text-[#5A3D2E] leading-relaxed text-[15px]">
              <p>
                Brew & Bean a luat naștere dintr-o frustrare simplă: în Bistrița nu existau opțiuni bune de
                specialty coffee. Mihai Popa, după ani în care a explorat cafenele din toată Europa,
                s-a întors acasă cu o misiune.
              </p>
              <p>
                Am deschis în martie 2021, la câteva luni după pandemie, cu 6 mese, un espressor La Marzocco
                și o gramolă de curaj. Primele luni au fost grele — dar oamenii din Bistrița ne-au primit cu
                brațele deschise. Astăzi avem 40+ locuri (incluzând terasa), o echipă de 3 barisți pasionați
                și o comunitate de cafea care crește în fiecare lună.
              </p>
              <p>
                Schimbăm originile în funcție de sezon — vara preferăm cafele cu note fructate,
                iarna trecem pe profiluri mai calde, ciocolatoase. Nu servim o cafea standard.
                Servim <em>cafeaua momentului</em>.
              </p>
            </div>
          </div>
        </section>

        {/* Valori */}
        <section className="py-20 px-4" style={{ backgroundColor: '#FFF9F0' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Ce ne ghidează</p>
              <h2 className="text-3xl font-bold text-[#1A0F0A]" style={{ fontFamily: 'var(--font-heading)' }}>
                Valorile noastre
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="p-6 rounded-2xl border border-[#E8D5C0] bg-[#FFF9F0]">
                  <span className="text-4xl mb-4 block">{v.icon}</span>
                  <h3 className="font-bold text-[#1A0F0A] text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#7A5C4A] leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Echipa */}
        <section className="py-20 px-4" style={{ backgroundColor: '#FDF6EE' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Oamenii din spatele ceștii</p>
              <h2 className="text-3xl font-bold text-[#1A0F0A]" style={{ fontFamily: 'var(--font-heading)' }}>
                Echipa noastră
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                    style={{ background: 'linear-gradient(135deg, #3D2218, #D4956A)' }}>
                    👤
                  </div>
                  <h3 className="font-bold text-[#1A0F0A] mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mb-3" style={{ color: '#D4956A' }}>{member.role}</p>
                  <p className="text-sm text-[#7A5C4A] leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prăjitorii partenere */}
        <section className="py-20 px-4" style={{ backgroundColor: '#2C1810' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Originea boabelor</p>
              <h2 className="text-3xl font-bold text-[#FDF6EE]" style={{ fontFamily: 'var(--font-heading)' }}>
                Prăjitoriile partenere
              </h2>
              <p className="text-[#D4C4B0] mt-3 max-w-lg mx-auto text-sm leading-relaxed">
                Nu folosim cafea la vrac. Lucrăm cu două prăjitorii locale care împărtășesc valorile noastre
                — trasabilitate, calitate și relații directe cu producătorii.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ROASTERS.map((r) => (
                <div key={r.name} className="p-6 rounded-2xl" style={{ backgroundColor: '#3D2218', border: '1px solid #4D2E1E' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: '#D4956A', color: '#1A0F0A' }}>
                      ☕
                    </div>
                    <div>
                      <h3 className="font-bold text-[#FDF6EE]">{r.name}</h3>
                      <p className="text-xs text-[#9C7B6A]">{r.city}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#D4C4B0] leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center" style={{ backgroundColor: '#FDF6EE' }}>
          <h2 className="text-2xl font-bold text-[#1A0F0A] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Vino să ne cunoști
          </h2>
          <p className="text-[#7A5C4A] mb-6">{business.fullAddress} · {business.schedule.weekdays}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/meniu"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#2C1810', color: '#FDF6EE' }}
            >
              Vezi meniul <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-full border border-[#E8D5C0] transition-all hover:border-[#D4956A]"
              style={{ color: '#2C1810' }}
            >
              Contactează-ne
            </Link>
          </div>
        </section>

      </main>

      {/* Footer minimal */}
      <footer className="py-6 px-4 border-t border-[#E8D5C0] text-center text-sm text-[#9C7B6A]"
        style={{ backgroundColor: '#FDF6EE' }}>
        <p>© {new Date().getFullYear()} Brew & Bean · {business.fullAddress}</p>
      </footer>
    </>
  )
}
