export const dynamic = 'force-dynamic'

import { AdminShell } from '@/components/admin/AdminShell'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { MenuManager } from './MenuManager'

export default async function AdminMenuPage() {
  const supabase = createSupabaseAdminClient()
  const [itemsRes, categoriesRes] = await Promise.all([
    supabase.from('items').select('*, menu_categories(name)').order('name'),
    supabase.from('menu_categories').select('*').order('sort_order'),
  ])

  return (
    <AdminShell activeSection="menu">
      <div className="p-6">
        <MenuManager
          initialItems={itemsRes.data ?? []}
          categories={categoriesRes.data ?? []}
        />
      </div>
    </AdminShell>
  )
}
