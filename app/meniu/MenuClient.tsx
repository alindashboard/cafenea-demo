'use client'

import { useState, useRef } from 'react'
import type { MenuItem, MenuCategory } from '@/types/database'
import { SITE_CONFIG } from '@/lib/config'

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: 'G',
  lactoză: 'L',
  nuci: 'N',
  ouă: 'O',
}

const ALLERGEN_COLORS: Record<string, string> = {
  gluten: '#D4956A',
  lactoză: '#8B6FD4',
  nuci: '#4CAF50',
  ouă: '#FF9800',
}

function AllergenTag({ allergen }: { allergen: string }) {
  const label = ALLERGEN_LABELS[allergen] ?? allergen.slice(0, 1).toUpperCase()
  const color = ALLERGEN_COLORS[allergen] ?? '#9C7B6A'
  return (
    <span
      title={allergen}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const hasMultipleSizes = item.sizes && item.sizes.length > 1
  const singleSize = item.sizes && item.sizes.length === 1

  return (
    <div className={`flex gap-3 p-4 rounded-2xl border transition-all hover:shadow-md ${
      item.available ? 'border-[#E8D5C0] bg-[#FFF9F0]' : 'border-[#E8D5C0] bg-[#F5EDE0] opacity-60'
    }`}>
      {/* Image */}
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.name}
          className="w-[72px] h-[72px] rounded-xl object-cover shrink-0"
        />
      ) : (
        <div
          className="w-[72px] h-[72px] rounded-xl shrink-0 flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #3D2218, #D4956A)' }}
        >
          ☕
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-[#1A0F0A] text-sm leading-tight">{item.name}</h3>
            {item.is_popular && (
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: '#D4956A', color: '#1A0F0A' }}>
                ★ Popular
              </span>
            )}
            {!item.available && (
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-[#F5E8D8] text-[#9C7B6A] font-medium">
                Indisponibil
              </span>
            )}
          </div>
        </div>

        {item.description && (
          <p className="text-xs text-[#7A5C4A] mb-2 leading-relaxed">{item.description}</p>
        )}

        {/* Features */}
        {item.features && item.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.features.map((f) => (
              <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F5E8D8] text-[#7A5C4A]">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row: allergens + price */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex gap-1">
            {item.allergens?.map((a) => <AllergenTag key={a} allergen={a} />)}
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            {hasMultipleSizes ? (
              <div className="flex flex-col gap-0.5">
                {item.sizes!.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 justify-end">
                    <span className="text-[11px] text-[#9C7B6A]">{s.name}{s.ml ? ` ${s.ml}ml` : ''}</span>
                    <span className="text-sm font-bold text-[#2C1810]">{s.price} lei</span>
                  </div>
                ))}
              </div>
            ) : singleSize ? (
              <span className="text-base font-bold text-[#2C1810]">{item.sizes![0].price} lei</span>
            ) : (
              <span className="text-base font-bold text-[#2C1810]">{item.price} lei</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  categories: MenuCategory[]
  items: MenuItem[]
}

export function MenuClient({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const ALL_OPTION = { id: 'all', name: 'Toate', icon: '☰' }
  const navCategories = [ALL_OPTION, ...categories]

  const filteredItems = items.filter((item) => {
    if (showOnlyAvailable && !item.available) return false
    if (activeCategory === 'all') return true
    return item.category_id === activeCategory
  })

  function scrollToCategory(id: string) {
    setActiveCategory(id)
    if (id !== 'all') {
      const el = sectionRefs.current[id]
      if (el) {
        const offset = 130
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const displayCategories = categories.filter((c) =>
    activeCategory === 'all' || c.id === activeCategory ? true : true
  )

  return (
    <div>
      {/* Sticky category nav */}
      <div className="sticky top-16 z-40 border-b border-[#E8D5C0] px-4 py-2"
        style={{ backgroundColor: '#FDF6EE' }}>
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {navCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'text-[#FDF6EE]'
                  : 'bg-white border border-[#E8D5C0] text-[#7A5C4A] hover:border-[#D4956A]'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: '#2C1810' } : undefined}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
          <label className="flex items-center gap-1.5 shrink-0 px-4 py-1.5 rounded-full text-sm border border-[#E8D5C0] bg-white cursor-pointer text-[#7A5C4A] ml-auto">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              className="accent-[#D4956A]"
            />
            Disponibile
          </label>
        </div>
      </div>

      {/* Allergen legend */}
      <div className="px-4 py-3 border-b border-[#E8D5C0]" style={{ backgroundColor: '#FFF9F0' }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4 flex-wrap">
          <span className="text-xs text-[#9C7B6A] font-medium">Alergeni:</span>
          {Object.entries(ALLERGEN_LABELS).map(([key, abbr]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px] font-bold"
                style={{ backgroundColor: ALLERGEN_COLORS[key] ?? '#9C7B6A' }}>
                {abbr}
              </span>
              <span className="text-xs text-[#7A5C4A] capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu sections */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {activeCategory === 'all'
          ? categories.map((cat) => {
              const catItems = filteredItems.filter((i) => i.category_id === cat.id)
              if (catItems.length === 0) return null
              return (
                <section
                  key={cat.id}
                  ref={(el) => { sectionRefs.current[cat.id] = el }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                    <div>
                      <h2 className="text-2xl font-bold text-[#1A0F0A]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p className="text-sm text-[#7A5C4A]">{cat.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catItems.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )
            })
          : (() => {
              const cat = categories.find((c) => c.id === activeCategory)
              if (!cat) return null
              const catItems = filteredItems.filter((i) => i.category_id === cat.id)
              return (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                    <div>
                      <h2 className="text-2xl font-bold text-[#1A0F0A]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p className="text-sm text-[#7A5C4A]">{cat.description}</p>
                      )}
                    </div>
                  </div>
                  {catItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {catItems.map((item) => <MenuItemCard key={item.id} item={item} />)}
                    </div>
                  ) : (
                    <p className="text-[#9C7B6A] py-8 text-center">Nu există produse disponibile în această categorie.</p>
                  )}
                </section>
              )
            })()
        }

        {/* Empty state if no items at all */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-[#9C7B6A]">
            <p className="text-lg mb-2">Meniu în curând</p>
            <p className="text-sm">Contactați-ne la {SITE_CONFIG.business.phoneDisplay} pentru detalii.</p>
          </div>
        )}
      </div>
    </div>
  )
}

