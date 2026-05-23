import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { ContactForm } from '@/components/ContactForm'
import { SITE_CONFIG } from '@/lib/config'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import { InstagramIcon } from '@/components/InstagramIcon'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactează Brew & Bean — adresă, program, telefon și formular de contact. Te așteptăm în Piața Centrală 7, Bistrița.',
  alternates: { canonical: `${SITE_CONFIG.url}/contact` },
}

const SCHEDULE = [
  { days: 'Luni – Vineri', hours: '07:30 – 21:00' },
  { days: 'Sâmbătă', hours: '09:00 – 22:00' },
  { days: 'Duminică', hours: '09:00 – 20:00' },
]

export default function ContactPage() {
  const { business } = SITE_CONFIG

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: '#FDF6EE' }}>

        {/* Header */}
        <section className="py-16 px-4 text-center"
          style={{ background: 'linear-gradient(135deg, #1A0F0A, #2C1810)' }}>
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>
            Suntem aici
          </p>
          <h1 className="text-4xl font-bold text-[#FDF6EE]" style={{ fontFamily: 'var(--font-heading)' }}>
            Contact
          </h1>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1A0F0A] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
                  Informații
                </h2>
                <div className="space-y-5">
                  <div className="flex gap-3 items-start">
                    <MapPin className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                    <div>
                      <p className="font-semibold text-[#1A0F0A] text-sm mb-0.5">Adresă</p>
                      <p className="text-[#7A5C4A] text-sm">{business.fullAddress}</p>
                      <a
                        href={business.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium mt-1 inline-block transition-colors hover:underline"
                        style={{ color: '#D4956A' }}
                      >
                        Deschide în Google Maps →
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Phone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                    <div>
                      <p className="font-semibold text-[#1A0F0A] text-sm mb-0.5">Telefon</p>
                      <a href={`tel:${business.phone}`}
                        className="text-[#7A5C4A] text-sm hover:text-[#D4956A] transition-colors">
                        {business.phoneDisplay}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Mail className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                    <div>
                      <p className="font-semibold text-[#1A0F0A] text-sm mb-0.5">Email</p>
                      <a href={`mailto:${business.email}`}
                        className="text-[#7A5C4A] text-sm hover:text-[#D4956A] transition-colors">
                        {business.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <InstagramIcon className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                    <div>
                      <p className="font-semibold text-[#1A0F0A] text-sm mb-0.5">Instagram</p>
                      <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                        className="text-[#7A5C4A] text-sm hover:text-[#D4956A] transition-colors">
                        @brewandbean.ro
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program */}
              <div>
                <div className="flex gap-3 items-start">
                  <Clock className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A0F0A] text-sm mb-3">Program</p>
                    <div className="space-y-2">
                      {SCHEDULE.map(({ days, hours }) => (
                        <div key={days} className="flex justify-between text-sm">
                          <span className="text-[#5A3D2E] font-medium">{days}</span>
                          <span className="text-[#7A5C4A]">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Eveniment banner */}
              <div className="p-5 rounded-2xl" style={{ backgroundColor: '#FFF9F0', border: '1px solid #E8D5C0' }}>
                <p className="font-semibold text-[#1A0F0A] mb-1">🎉 Organizezi un eveniment?</p>
                <p className="text-sm text-[#7A5C4A] leading-relaxed">
                  Oferim posibilitatea rezervării spațiului pentru evenimente private, sesiuni de cupping sau
                  team building-uri în jurul cafelei. Scrie-ne detaliile prin formularul de contact.
                </p>
              </div>

              {/* Maps */}
              <div className="rounded-2xl overflow-hidden border border-[#E8D5C0] h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2699.5!2d24.4993!3d47.1353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47457c3d21e29ebd%3A0x5d1000d2ea74b2f1!2sPia%C8%9Ba+Petru+Rares%2C+Bistri%C8%9Ba!5e0!3m2!1sro!2sro!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Brew & Bean pe hartă"
                />
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1A0F0A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Trimite un mesaj
              </h2>
              <div className="rounded-2xl p-6 border border-[#E8D5C0]" style={{ backgroundColor: '#FFF9F0' }}>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-[#E8D5C0] text-center text-sm text-[#9C7B6A]"
        style={{ backgroundColor: '#FDF6EE' }}>
        <p>© {new Date().getFullYear()} Brew & Bean · {business.fullAddress}</p>
      </footer>
    </>
  )
}
