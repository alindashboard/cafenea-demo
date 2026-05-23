import Link from 'next/link'
import { LayoutDashboard, Coffee, Tag, Images, MessageSquare } from 'lucide-react'
import { SignOutButton } from './SignOutButton'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'

interface AdminShellProps {
  children: React.ReactNode
  activeSection?: 'dashboard' | 'menu' | 'categories' | 'gallery' | 'contact'
}

async function getCounts() {
  const supabase = createSupabaseAdminClient()
  const unresolved = await supabase
    .from('contact_requests')
    .select('id', { count: 'exact', head: true })
    .eq('resolved', false)
  return { unresolvedContacts: unresolved.count ?? 0 }
}

export async function AdminShell({ children, activeSection }: AdminShellProps) {
  const { unresolvedContacts } = await getCounts()
  const { business } = SITE_CONFIG

  const navItem = (href: string, section: AdminShellProps['activeSection'], icon: React.ReactNode, label: string, badge?: number) => (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
        activeSection === section
          ? 'bg-[#3D2218] text-[#FDF6EE]'
          : 'text-[#D4C4B0] hover:text-[#FDF6EE] hover:bg-[#3D2218]'
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {!!badge && badge > 0 && (
        <span className="bg-[#D4956A] text-[#1A0F0A] text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </Link>
  )

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 flex flex-col shrink-0" style={{ backgroundColor: '#2C1810' }}>
        <div className="p-4 border-b border-[#3D2218]">
          <p className="font-bold text-sm text-[#FDF6EE]" style={{ fontFamily: 'var(--font-heading)' }}>
            {business.name}
          </p>
          <p className="text-xs text-[#9C7B6A] mt-0.5">Panou Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItem('/admin/dashboard', 'dashboard', <LayoutDashboard className="h-4 w-4" />, 'Mesaje contact', unresolvedContacts)}
          {navItem('/admin/menu', 'menu', <Coffee className="h-4 w-4" />, 'Meniu produse')}
          {navItem('/admin/categories', 'categories', <Tag className="h-4 w-4" />, 'Categorii')}
          {navItem('/admin/gallery', 'gallery', <Images className="h-4 w-4" />, 'Galerie')}
        </nav>

        <div className="p-4 border-t border-[#3D2218]">
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50">
        {children}
      </main>
    </div>
  )
}
