export const dynamic = 'force-dynamic'

import { AdminShell } from '@/components/admin/AdminShell'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { GalleryManager } from './GalleryManager'

export default async function AdminGalleryPage() {
  const supabase = createSupabaseAdminClient()
  const { data: images } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order')

  return (
    <AdminShell activeSection="gallery">
      <div className="p-6">
        <GalleryManager initialImages={images ?? []} />
      </div>
    </AdminShell>
  )
}
