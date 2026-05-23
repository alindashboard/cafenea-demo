import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, ArrowRight, ChevronRight } from 'lucide-react'
import { InstagramIcon } from '@/components/InstagramIcon'
import { Navbar } from '@/components/Navbar'
import { ContactForm } from '@/components/ContactForm'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { SITE_CONFIG } from '@/lib/config'
import type { MenuItem, MenuCategory, GalleryImage } from '@/types/database'

export const metadata: Metadata = {
  title: 'Brew & Bean — Cafea de Specialitate Bistrița | Meniu & Locație',
  description: SITE_CONFIG.business.description,
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: {
    title: 'Brew & Bean — Cafea de Specialitate Bistrița',
    description: SITE_CONFIG.business.description,
    url: SITE_CONFIG.url,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: SITE_CONFIG.business.name,
  description: SITE_CONFIG.business.description,
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.business.phone,
  email: SITE_CONFIG.business.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Piața Centrală 7',
    addressLocality: 'Bistrița',
    addressRegion: 'Bistrița-Năsăud',
    addressCountry: 'RO',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:30', closes: '21:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:00', closes: '20:00' },
  ],
  servesCuisine: 'Coffee',
  priceRange: '$$',
}

async function getData() {
  try {
    const supabase = await createSupabaseServerClient()
    const [popularRes, categoriesRes, galleryRes] = await Promise.all([
      supabase.from('items').select('*, menu_categories(name)').eq('is_popular', true).eq('available', true).limit(6),
      supabase.from('menu_categories').select('*').order('sort_order'),
      supabase.from('gallery').select('*').order('sort_order').limit(6),
    ])
    return {
      popular: (popularRes.data ?? []) as MenuItem[],
      categories: (categoriesRes.data ?? []) as MenuCategory[],
      gallery: (galleryRes.data ?? []) as GalleryImage[],
    }
  } catch {
    return { popular: [], categories: [], gallery: [] }
  }
}

function PopularCard({ item }: { item: MenuItem }) {
  const displayPrice = item.sizes
    ? `${item.sizes[0].price} – ${item.sizes[item.sizes.length - 1].price} lei`
    : `${item.price} lei`

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-[#E8D5C0] bg-[#FFF9F0] hover:shadow-md transition-shadow">
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-20 h-20 rounded-xl shrink-0 flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #3D2218, #D4956A)' }}>
          ☕
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-[#1A0F0A] truncate">{item.name}</h3>
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: '#D4956A', color: '#1A0F0A' }}>
            Popular
          </span>
        </div>
        {item.description && (
          <p className="text-sm text-[#7A5C4A] line-clamp-2 mb-2">{item.description}</p>
        )}
        <p className="font-bold text-[#2C1810]">{displayPrice}</p>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const { popular, categories, gallery } = await getData()
  const { business, branding, features } = SITE_CONFIG

  const BENEFITS = ['Specialty coffee', 'Prăjitorie locală', 'Lapte vegetal: +3 lei', 'Terasă în centru']

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden"
        style={{ background: '#1A0F0A' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pictures/interior-2.png" alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40" aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(26,15,10,0.55) 0%, rgba(26,15,10,0.75) 100%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: '#D4956A' }}>
            Specialty Coffee · Bistrița
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-[#FDF6EE]"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Brew & Bean
          </h1>
          <p className="text-[#D4C4B0] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Din boabe selectate manual, prăjite local,{' '}
            <br className="hidden sm:block" />
            preparate cu pasiune.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/meniu"
              className="inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-3.5 rounded-full transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#D4956A', color: '#1A0F0A' }}
            >
              Vezi meniul
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={business.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-3.5 rounded-full border border-white/30 text-white transition-all hover:bg-white/10"
            >
              <MapPin className="h-4 w-4" />
              Găsește-ne
            </a>
          </div>
        </div>
      </section>

      {/* Benefits bar */}
      <section className="border-b border-[#3D2218] py-3 px-4" style={{ backgroundColor: '#2C1810' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-8 gap-y-1 justify-center">
          {BENEFITS.map((b) => (
            <span key={b} className="text-sm font-medium text-[#D4C4B0] flex items-center gap-2">
              <span style={{ color: '#D4956A' }}>✦</span> {b}
            </span>
          ))}
        </div>
      </section>

      {/* Povestea noastră */}
      <section className="py-20 px-4" style={{ backgroundColor: '#FDF6EE' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: '#D4956A' }}>Povestea noastră</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F0A] mb-6 leading-snug"
              style={{ fontFamily: 'var(--font-heading)' }}>
              Cafea bună,{' '}
              <span style={{ color: '#D4956A' }}>fără compromis</span>
            </h2>
            <div className="space-y-4 text-[#5A3D2E] leading-relaxed">
              <p>
                Am deschis în 2021 cu o misiune simplă: să aducem specialty coffee în inima Bistriței.
                Nu coffee shop corporatist, nu franciză — o cafenea autentică, cu suflet.
              </p>
              <p>
                Lucrăm cu prăjitorii locale din România și schimbăm originile în funcție de sezon.
                Fiecare ceașcă e preparată cu atenție, fiecare rețetă e gândită să scoată
                în evidență cel mai bun din boabă.
              </p>
              <p>
                Suntem locul unde Bistrița ia cafeaua în serios.
              </p>
            </div>
            <Link
              href="/despre"
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-all hover:gap-2.5"
              style={{ color: '#D4956A' }}
            >
              Citește mai mult <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="row-span-2 rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pictures/interior-1.png" alt="Interior Brew & Bean"
                className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pictures/esspresso-bar.png" alt="Bar espresso"
                  className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pictures/cappucino.png" alt="Cappuccino"
                  className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Populare */}
      {popular.length > 0 && (
        <section className="py-20 px-4" style={{ backgroundColor: '#FFF9F0' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Cele mai iubite</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F0A]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Favoritele clienților
                </h2>
              </div>
              <Link href="/meniu" className="hidden sm:flex items-center gap-1 text-sm font-medium"
                style={{ color: '#D4956A' }}>
                Meniu complet <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((item) => (
                <Link key={item.id} href="/meniu">
                  <PopularCard item={item} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meniu preview categorii */}
      {categories.length > 0 && (
        <section className="py-20 px-4" style={{ backgroundColor: '#FDF6EE' }}>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Ce servim</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F0A] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Meniul nostru
            </h2>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href="/meniu"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E8D5C0] bg-white text-sm font-medium transition-colors hover:border-[#D4956A] hover:bg-[#FFF9F0]"
                  style={{ color: '#5A3D2E' }}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/meniu"
              className="inline-flex items-center gap-2 text-base font-semibold px-8 py-3.5 rounded-full transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#2C1810', color: '#FDF6EE' }}
            >
              Vezi meniul complet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Galerie */}
      {features.gallery && (
        <section className="py-20 px-4" style={{ backgroundColor: '#FFF9F0' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Spațiul nostru</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F0A]" style={{ fontFamily: 'var(--font-heading)' }}>
                Vino să ne vizitezi
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.length > 0
                ? gallery.map((img, i) => (
                    <div key={img.id} className={`overflow-hidden rounded-2xl ${i === 0 ? 'md:row-span-2' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.caption ?? 'Brew & Bean'}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: i === 0 ? '4/5' : '4/3' }}
                      />
                    </div>
                  ))
                : Array.from({ length: 6 }, (_, i) => (
                    <div key={i}
                      className={`overflow-hidden rounded-2xl flex items-center justify-center ${i === 0 ? 'md:row-span-2' : ''}`}
                      style={{
                        aspectRatio: i === 0 ? '4/5' : '4/3',
                        background: `linear-gradient(${135 + i * 25}deg, #3D2218, #D4956A)`,
                      }}>
                      <span className="text-[#FDF6EE]/40 text-sm">Fotografie {i + 1}</span>
                    </div>
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* Locație & Program */}
      <section className="py-20 px-4" style={{ backgroundColor: '#FDF6EE' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Unde ne găsești</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F0A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                În centrul Bistriței
              </h2>
              <div className="space-y-5">
                <div className="flex gap-3 items-start">
                  <MapPin className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                  <div>
                    <p className="font-semibold text-[#1A0F0A]">Adresă</p>
                    <p className="text-[#7A5C4A]">{business.fullAddress}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Clock className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                  <div>
                    <p className="font-semibold text-[#1A0F0A] mb-1">Program</p>
                    <p className="text-[#7A5C4A]">{business.schedule.weekdays}</p>
                    <p className="text-[#7A5C4A]">{business.schedule.saturday}</p>
                    <p className="text-[#7A5C4A]">{business.schedule.sunday}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <InstagramIcon className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#D4956A' }} />
                  <div>
                    <p className="font-semibold text-[#1A0F0A]">Instagram</p>
                    <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                      className="text-[#7A5C4A] hover:text-[#D4956A] transition-colors text-sm">
                      @brewandbean.ro
                    </a>
                  </div>
                </div>
              </div>
              <a
                href={business.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold px-6 py-3 rounded-full transition-all hover:scale-[1.02]"
                style={{ backgroundColor: '#2C1810', color: '#FDF6EE' }}
              >
                <MapPin className="h-4 w-4" />
                Deschide în Maps
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#E8D5C0] shadow-sm h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2699.5!2d24.4993!3d47.1353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47457c3d21e29ebd%3A0x5d1000d2ea74b2f1!2sPia%C8%9Ba+Petru+Rares%2C+Bistri%C8%9Ba!5e0!3m2!1sro!2sro!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Brew & Bean — Piața Centrală 7, Bistrița"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      {features.contactForm && (
        <section className="py-20 px-4" style={{ backgroundColor: '#2C1810' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>Scrie-ne</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#FDF6EE] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Contactează-ne
                </h2>
                <p className="text-[#D4C4B0] mb-8 leading-relaxed">
                  Ai întrebări despre meniu, vrei să rezervi spațiul pentru un eveniment,
                  sau pur și simplu vrei să dai bună ziua?
                </p>
                <div className="space-y-3 text-sm">
                  <a href={`mailto:${business.email}`}
                    className="flex items-center gap-2 text-[#D4C4B0] hover:text-[#D4956A] transition-colors">
                    ✉ {business.email}
                  </a>
                  <a href={`tel:${business.phone}`}
                    className="flex items-center gap-2 text-[#D4C4B0] hover:text-[#D4956A] transition-colors">
                    ☎ {business.phoneDisplay}
                  </a>
                  <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#D4C4B0] hover:text-[#D4956A] transition-colors">
                    <InstagramIcon className="h-4 w-4" /> @brewandbean.ro
                  </a>
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#3D2218', border: '1px solid #4D2E1E' }}>
                {/* ContactForm — dark background set via parent div */}
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 px-4" style={{ backgroundColor: '#1A0F0A' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#FDF6EE' }}>
              Brew & Bean
            </p>
            <p className="text-[#9C7B6A] text-sm">{business.fullAddress}</p>
            <p className="text-[#9C7B6A] text-sm">{business.schedule.weekdays}</p>
            <a href={`tel:${business.phone}`}
              className="text-sm mt-1 block hover:text-[#D4956A] transition-colors"
              style={{ color: '#D4956A' }}>
              {business.phoneDisplay}
            </a>
          </div>
          <div className="flex flex-col gap-2 text-sm text-[#9C7B6A]">
            <div className="flex gap-4">
              <Link href="/meniu" className="hover:text-[#D4956A] transition-colors">Meniu</Link>
              <Link href="/despre" className="hover:text-[#D4956A] transition-colors">Despre</Link>
              <Link href="/contact" className="hover:text-[#D4956A] transition-colors">Contact</Link>
            </div>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#D4956A] transition-colors">
              <InstagramIcon className="h-4 w-4" /> Instagram
            </a>
            <p className="mt-2">© {new Date().getFullYear()} Brew & Bean. Toate drepturile rezervate.</p>
            <p className="text-[#3D2218] text-xs">
              Site realizat de{' '}
              <a href="https://alindashboard.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-[#9C7B6A] transition-colors">
                AlindashBoard
              </a>
            </p>
            <Link href="/admin/login" className="text-[#3D2218] hover:text-[#9C7B6A] text-xs transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
