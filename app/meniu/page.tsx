import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { SITE_CONFIG } from '@/lib/config'
import type { MenuItem, MenuCategory } from '@/types/database'
import { MenuClient } from './MenuClient'

export const metadata: Metadata = {
  title: 'Meniu',
  description: 'Descoperă meniul complet Brew & Bean: espresso, filter coffee, băuturi reci, limonade artizanale și food. Prețuri, alergeni și detalii complete.',
  alternates: { canonical: `${SITE_CONFIG.url}/meniu` },
}

const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Meniu Brew & Bean',
  description: 'Meniu complet cafenea specialty',
  inLanguage: 'ro',
  url: `${SITE_CONFIG.url}/meniu`,
}

async function getData() {
  try {
    const supabase = await createSupabaseServerClient()
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('*').order('sort_order'),
      supabase.from('items').select('*, menu_categories(name, icon)').order('name'),
    ])
    return {
      categories: (categoriesRes.data ?? []) as MenuCategory[],
      items: (itemsRes.data ?? []) as MenuItem[],
    }
  } catch {
    return { categories: [], items: [] }
  }
}

export default async function MenuPage() {
  const { categories, items } = await getData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }} />
      <Navbar />
      <main className="flex-1 min-h-screen" style={{ backgroundColor: '#FDF6EE' }}>
        {/* Page header */}
        <div className="py-12 px-4 text-center" style={{ backgroundColor: '#2C1810' }}>
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#D4956A' }}>
            Brew & Bean
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FDF6EE]"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Meniu
          </h1>
          <p className="text-[#D4C4B0] mt-3 max-w-md mx-auto">
            Scanat QR sau vizitat online — același meniu, aceeași calitate.
          </p>
        </div>

        <MenuClient categories={categories} items={items} />
      </main>

      {/* Footer minimal */}
      <footer className="py-6 px-4 border-t border-[#E8D5C0] text-center text-sm text-[#9C7B6A]"
        style={{ backgroundColor: '#FDF6EE' }}>
        <p>Brew & Bean · {SITE_CONFIG.business.fullAddress} · {SITE_CONFIG.business.phoneDisplay}</p>
      </footer>
    </>
  )
}
