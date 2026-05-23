export const dynamic = 'force-dynamic'

import { AdminShell } from '@/components/admin/AdminShell'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { CategoryManager } from './CategoryManager'

export default async function AdminCategoriesPage() {
  const supabase = createSupabaseAdminClient()
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order')

  return (
    <AdminShell activeSection="categories">
      <div className="p-6">
        <CategoryManager initialCategories={categories ?? []} />
      </div>
    </AdminShell>
  )
}
