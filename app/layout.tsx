import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SITE_CONFIG } from '@/lib/config'

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'Brew & Bean — Cafea de Specialitate Bistrița | Meniu & Locație',
    template: `%s | ${SITE_CONFIG.business.name}`,
  },
  description: SITE_CONFIG.business.description,
  keywords: SITE_CONFIG.seo.keywords as string[],
  authors: [{ name: SITE_CONFIG.business.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: SITE_CONFIG.business.name,
    title: 'Brew & Bean — Cafea de Specialitate Bistrița',
    description: SITE_CONFIG.business.description,
    url: SITE_CONFIG.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brew & Bean — Cafea de Specialitate Bistrița',
    description: SITE_CONFIG.business.description,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
