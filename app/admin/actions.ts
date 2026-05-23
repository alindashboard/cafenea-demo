'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { sendContactEmail } from '@/lib/email'
import type { MenuItemSize } from '@/types/database'

// ── Contact form (public) ────────────────────────────────────────────────────

export interface ContactFormState {
  success?: boolean
  error?: string
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!name || !phone || !message) {
    return { error: 'Completează câmpurile obligatorii.' }
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('contact_requests').insert({
    name,
    phone,
    email: email || null,
    message,
  })

  if (error) {
    return { error: 'Eroare la trimiterea mesajului. Încearcă din nou.' }
  }

  try {
    await sendContactEmail({ name, phone, email, message })
  } catch {
    // Email failure doesn't block the contact request
  }

  return { success: true }
}

// ── Contact request admin actions ─────────────────────────────────────────────

export async function markContactResolved(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('contact_requests').update({ resolved: true }).eq('id', id)
  revalidatePath('/admin/dashboard')
}

export async function deleteContactRequest(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('contact_requests').delete().eq('id', id)
  revalidatePath('/admin/dashboard')
}

// ── Menu item actions ─────────────────────────────────────────────────────────

export interface MenuItemFormData {
  name: string
  description: string
  price: number
  category_id: string | null
  image_url: string
  available: boolean
  is_popular: boolean
  features: string[]
  allergens: string[]
  sizes: MenuItemSize[] | null
}

export async function createMenuItem(data: MenuItemFormData) {
  const supabase = createSupabaseAdminClient()
  const { data: created, error } = await supabase
    .from('items')
    .insert({
      name: data.name,
      description: data.description || null,
      price: data.price,
      category_id: data.category_id || null,
      image_url: data.image_url || null,
      available: data.available,
      is_popular: data.is_popular,
      features: data.features.length > 0 ? data.features : null,
      allergens: data.allergens.length > 0 ? data.allergens : null,
      sizes: data.sizes && data.sizes.length > 0 ? data.sizes : null,
    })
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidatePath('/admin/menu')
  revalidatePath('/')
  revalidatePath('/meniu')
  return { id: created.id as string }
}

export async function updateMenuItem(id: string, data: MenuItemFormData) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('items')
    .update({
      name: data.name,
      description: data.description || null,
      price: data.price,
      category_id: data.category_id || null,
      image_url: data.image_url || null,
      available: data.available,
      is_popular: data.is_popular,
      features: data.features.length > 0 ? data.features : null,
      allergens: data.allergens.length > 0 ? data.allergens : null,
      sizes: data.sizes && data.sizes.length > 0 ? data.sizes : null,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/menu')
  revalidatePath('/')
  revalidatePath('/meniu')
}

export async function deleteMenuItem(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('items').delete().eq('id', id)
  revalidatePath('/admin/menu')
  revalidatePath('/')
  revalidatePath('/meniu')
}

// ── Menu item image upload ────────────────────────────────────────────────────

async function deleteFromStorage(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  imageUrl: string | null
) {
  if (!imageUrl) return
  try {
    const url = new URL(imageUrl)
    const pathInBucket = decodeURIComponent(url.pathname.replace('/storage/v1/object/public/items/', ''))
    if (pathInBucket && !pathInBucket.startsWith('/')) {
      await supabase.storage.from('items').remove([pathInBucket])
    }
  } catch {
    // ignore
  }
}

export async function uploadMainImage(itemId: string, formData: FormData) {
  try {
    const supabase = createSupabaseAdminClient()
    const file = formData.get('file') as File
    if (!file || file.size === 0) return { error: 'Fișier invalid.' }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${itemId}/main-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('items')
      .upload(path, file, { contentType: file.type || 'image/jpeg' })
    if (uploadError) return { error: uploadError.message }

    const { data: urlData } = supabase.storage.from('items').getPublicUrl(path)
    const publicUrl = urlData?.publicUrl
    if (!publicUrl) return { error: 'Nu s-a putut obține URL-ul public.' }

    const { data: oldItem } = await supabase
      .from('items')
      .select('image_url')
      .eq('id', itemId)
      .single()

    const { error: dbError } = await supabase
      .from('items')
      .update({ image_url: publicUrl })
      .eq('id', itemId)
    if (dbError) return { error: dbError.message }

    await deleteFromStorage(supabase, oldItem?.image_url ?? null)

    revalidatePath('/')
    revalidatePath('/meniu')
    revalidatePath('/admin/menu')
    return { url: publicUrl }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export async function removeMainImage(itemId: string) {
  const supabase = createSupabaseAdminClient()
  const { data: item } = await supabase
    .from('items')
    .select('image_url')
    .eq('id', itemId)
    .single()

  await supabase.from('items').update({ image_url: null }).eq('id', itemId)
  await deleteFromStorage(supabase, item?.image_url ?? null)

  revalidatePath('/')
  revalidatePath('/meniu')
  revalidatePath('/admin/menu')
}

// ── Category actions ──────────────────────────────────────────────────────────

export interface CategoryFormData {
  name: string
  description: string
  icon: string
  sort_order: number
  visible: boolean
}

export async function createCategory(data: CategoryFormData) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('menu_categories').insert({
    name: data.name,
    description: data.description || null,
    icon: data.icon || null,
    sort_order: data.sort_order,
    visible: data.visible,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/meniu')
  revalidatePath('/')
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('menu_categories')
    .update({
      name: data.name,
      description: data.description || null,
      icon: data.icon || null,
      sort_order: data.sort_order,
      visible: data.visible,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/meniu')
  revalidatePath('/')
}

export async function deleteCategory(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('menu_categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/meniu')
  revalidatePath('/')
}

// ── Gallery actions ───────────────────────────────────────────────────────────

export async function uploadGalleryImage(formData: FormData) {
  try {
    const supabase = createSupabaseAdminClient()
    const file = formData.get('file') as File
    const caption = (formData.get('caption') as string)?.trim() || null
    if (!file || file.size === 0) return { error: 'Fișier invalid.' }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `gallery/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(path, file, { contentType: file.type || 'image/jpeg' })
    if (uploadError) return { error: uploadError.message }

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path)
    const publicUrl = urlData?.publicUrl
    if (!publicUrl) return { error: 'Nu s-a putut obține URL-ul public.' }

    const { data: last } = await supabase
      .from('gallery')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { error: dbError } = await supabase.from('gallery').insert({
      url: publicUrl,
      caption,
      sort_order: (last?.sort_order ?? 0) + 1,
    })
    if (dbError) return { error: dbError.message }

    revalidatePath('/admin/gallery')
    revalidatePath('/')
    return { url: publicUrl }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export async function deleteGalleryImage(id: string) {
  const supabase = createSupabaseAdminClient()
  const { data: img } = await supabase.from('gallery').select('url').eq('id', id).single()
  await supabase.from('gallery').delete().eq('id', id)

  if (img?.url) {
    try {
      const url = new URL(img.url)
      const path = url.pathname.replace('/storage/v1/object/public/gallery/', '')
      await supabase.storage.from('gallery').remove([path])
    } catch {
      // ignore
    }
  }

  revalidatePath('/admin/gallery')
  revalidatePath('/')
}

// ── Legacy item actions (kept for compatibility with existing routes) ─────────

export type ItemFormData = MenuItemFormData
export const createItem = createMenuItem
export const updateItem = updateMenuItem
export const deleteItem = deleteMenuItem
