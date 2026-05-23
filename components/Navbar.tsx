'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { InstagramIcon } from '@/components/InstagramIcon'
import { SITE_CONFIG } from '@/lib/config'

const NAV_LINKS = [
  { href: '/meniu', label: 'Meniu' },
  { href: '/despre', label: 'Despre noi' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { business, branding } = SITE_CONFIG
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8D5C0] bg-[#FDF6EE]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FDF6EE]/80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 min-w-0 shrink-0" onClick={() => setOpen(false)}>
          <img src={branding.logo} alt={business.name} className="h-9 w-auto" />
          <span
            className="font-bold text-base hidden sm:inline"
            style={{ fontFamily: 'var(--font-heading)', color: branding.primaryColor }}
          >
            {business.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-[#D4956A] ${
                pathname === href || pathname.startsWith(href + '/')
                  ? 'text-[#2C1810]'
                  : 'text-[#7A5C4A]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={business.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7A5C4A] hover:text-[#D4956A] transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <Link
            href="/meniu"
            className="inline-flex items-center justify-center text-sm font-semibold px-5 py-2 rounded-full transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ backgroundColor: branding.primaryColor, color: '#FDF6EE' }}
          >
            Vezi meniul
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: branding.primaryColor }}
          onClick={() => setOpen(!open)}
          aria-label="Deschide meniu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E8D5C0] bg-[#FDF6EE] px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-base font-medium transition-colors ${
                pathname === href ? 'text-[#2C1810]' : 'text-[#7A5C4A]'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E8D5C0]">
            <Link
              href="/meniu"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm font-semibold px-5 py-3 rounded-full"
              style={{ backgroundColor: branding.primaryColor, color: '#FDF6EE' }}
            >
              Vezi meniul complet
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
