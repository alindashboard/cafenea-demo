'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2, Upload, Star, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMainImage,
  removeMainImage,
  type MenuItemFormData,
} from '@/app/admin/actions'
import type { MenuItem, MenuCategory, MenuItemSize } from '@/types/database'

const ALLERGEN_OPTIONS = ['gluten', 'lactoză', 'nuci', 'ouă', 'soia', 'pește', 'moluște', 'țelină']

type PendingFile = { file: File; previewUrl: string }

const EMPTY_FORM: MenuItemFormData = {
  name: '',
  description: '',
  price: 0,
  category_id: null,
  image_url: '',
  available: true,
  is_popular: false,
  features: [],
  allergens: [],
  sizes: null,
}

interface Props {
  initialItems: MenuItem[]
  categories: MenuCategory[]
}

export function MenuManager({ initialItems, categories }: Props) {
  const [items, setItems] = useState(initialItems)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<MenuItemFormData>(EMPTY_FORM)
  const [featuresInput, setFeaturesInput] = useState('')
  const [sizes, setSizes] = useState<MenuItemSize[]>([])
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null)
  const [mainImageError, setMainImageError] = useState('')
  const [isMainPending, startMainTransition] = useTransition()
  const [pendingMain, setPendingMain] = useState<PendingFile | null>(null)
  const mainInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function openAdd() {
    setEditingItem(null)
    setForm(EMPTY_FORM)
    setFeaturesInput('')
    setSizes([])
    setFormError('')
    setMainImageUrl(null)
    setMainImageError('')
    if (pendingMain) URL.revokeObjectURL(pendingMain.previewUrl)
    setPendingMain(null)
    setDialogOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: item.price,
      category_id: item.category_id,
      image_url: item.image_url ?? '',
      available: item.available,
      is_popular: item.is_popular,
      features: item.features ?? [],
      allergens: item.allergens ?? [],
      sizes: item.sizes,
    })
    setFeaturesInput((item.features ?? []).join(', '))
    setSizes(item.sizes ?? [])
    setFormError('')
    setMainImageUrl(item.image_url ?? null)
    setMainImageError('')
    if (pendingMain) URL.revokeObjectURL(pendingMain.previewUrl)
    setPendingMain(null)
    setDialogOpen(true)
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setMainImageError('')

    if (!editingItem) {
      if (pendingMain) URL.revokeObjectURL(pendingMain.previewUrl)
      setPendingMain({ file, previewUrl: URL.createObjectURL(file) })
      return
    }

    startMainTransition(async () => {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadMainImage(editingItem.id, fd)
      if (!result || 'error' in result) {
        setMainImageError((result as { error: string } | null)?.error ?? 'Eroare upload.')
        return
      }
      setMainImageUrl(result.url)
      setForm((prev) => ({ ...prev, image_url: result.url }))
    })
  }

  function handleRemoveMainImage() {
    if (!editingItem) {
      if (pendingMain) URL.revokeObjectURL(pendingMain.previewUrl)
      setPendingMain(null)
      return
    }
    if (!confirm('Ștergi fotografia?')) return
    startMainTransition(async () => {
      await removeMainImage(editingItem.id)
      setMainImageUrl(null)
      setForm((prev) => ({ ...prev, image_url: '' }))
    })
  }

  function toggleAllergen(a: string) {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(a)
        ? prev.allergens.filter((x) => x !== a)
        : [...prev.allergens, a],
    }))
  }

  function addSize() {
    setSizes((prev) => [...prev, { name: '', price: 0 }])
  }

  function updateSize(i: number, field: keyof MenuItemSize, value: string | number) {
    setSizes((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  function removeSize(i: number) {
    setSizes((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (!form.name.trim()) {
      setFormError('Numele produsului este obligatoriu.')
      return
    }

    const features = featuresInput.split(',').map((s) => s.trim()).filter(Boolean)
    const finalSizes = sizes.filter((s) => s.name.trim()).length > 0 ? sizes : null
    const finalForm: MenuItemFormData = { ...form, features, sizes: finalSizes }

    startTransition(async () => {
      try {
        if (editingItem) {
          const result = await updateMenuItem(editingItem.id, finalForm)
          if (result?.error) { setFormError(result.error); return }
        } else {
          const result = await createMenuItem(finalForm)
          if (!result || 'error' in result) {
            setFormError((result as { error: string } | null)?.error ?? 'Eroare la creare.')
            return
          }

          if (pendingMain) {
            const fd = new FormData()
            fd.append('file', pendingMain.file)
            await uploadMainImage(result.id, fd)
            URL.revokeObjectURL(pendingMain.previewUrl)
            setPendingMain(null)
          }
        }

        setDialogOpen(false)
        router.refresh()
      } catch (err) {
        setFormError(err instanceof Error ? err.message : String(err))
      }
    })
  }

  function handleDelete(item: MenuItem) {
    if (!confirm(`Ștergi "${item.name}"? Acțiune ireversibilă.`)) return
    startTransition(async () => {
      await deleteMenuItem(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      router.refresh()
    })
  }

  const displayImageUrl = editingItem ? mainImageUrl : pendingMain?.previewUrl ?? null

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meniu produse</h1>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Adaugă produs
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-lg bg-white">
          <p>Nu există produse adăugate.</p>
          <Button onClick={openAdd} variant="outline" className="mt-4">Adaugă primul produs</Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produs</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Categorie</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Preț</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                      )}
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.is_popular && (
                          <span className="ml-1.5 text-xs text-amber-600">★</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {(item as MenuItem & { menu_categories?: { name: string } | null }).menu_categories?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {item.sizes && item.sizes.length > 0
                      ? `${item.sizes[0].price}–${item.sizes[item.sizes.length - 1].price} lei`
                      : `${item.price} lei`}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.available ? 'default' : 'secondary'}>
                      {item.available ? 'Disponibil' : 'Indisponibil'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(item)} className="gap-1">
                        <Pencil className="h-3.5 w-3.5" /> Editează
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item)} className="gap-1">
                        <Trash2 className="h-3.5 w-3.5" /> Șterge
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează produs' : 'Adaugă produs nou'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Nume *</Label>
              <Input id="name" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Cappuccino" required />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category">Categorie</Label>
              <select
                id="category"
                value={form.category_id ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value || null }))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="">— Fără categorie —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Descriere</Label>
              <Textarea id="description" value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Scurtă descriere a produsului..." rows={2} />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="price">Preț de bază (RON)</Label>
              <Input id="price" type="number" min="0" step="0.5"
                value={form.price || ''}
                onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0 (folosit dacă nu există mărimi)" />
              <p className="text-xs text-muted-foreground">Dacă produsul are mărimi (mai jos), prețul de bază e ignorat.</p>
            </div>

            {/* Sizes */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label>Mărimi cu prețuri (opțional)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addSize} className="gap-1 text-xs">
                  <Plus className="h-3 w-3" /> Adaugă mărime
                </Button>
              </div>
              {sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder="Nume (ex: Small)"
                    value={s.name}
                    onChange={(e) => updateSize(i, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="ml (opțional)"
                    type="number"
                    value={(s as MenuItemSize & { ml?: number }).ml ?? ''}
                    onChange={(e) => updateSize(i, 'ml' as keyof MenuItemSize, parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Input
                    placeholder="Preț"
                    type="number"
                    value={s.price || ''}
                    onChange={(e) => updateSize(i, 'price', parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Button type="button" size="sm" variant="ghost" onClick={() => removeSize(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-1.5">
              <Label htmlFor="features">Opțiuni / Note (separate cu virgulă)</Label>
              <Input id="features" value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Decaf disponibil, Lapte vegetal: +3 lei" />
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <Label>Alergeni</Label>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergen(a)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.allergens.includes(a)
                        ? 'bg-amber-100 border-amber-400 text-amber-800'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Main image */}
            <div className="space-y-2 pt-2 border-t">
              <Label className="flex items-center gap-1.5">
                <Star className="h-4 w-4" /> Fotografie produs
              </Label>
              <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
              {displayImageUrl ? (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border group max-w-[200px]">
                  <Image src={displayImageUrl} alt="Fotografie produs" fill className="object-cover"
                    sizes="200px" unoptimized={!editingItem} />
                  {isMainPending && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                  )}
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" size="sm" variant="secondary" onClick={() => mainInputRef.current?.click()} disabled={isMainPending} className="text-xs gap-1">
                      <Upload className="h-3 w-3" /> Schimbă
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={handleRemoveMainImage} disabled={isMainPending}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => mainInputRef.current?.click()} disabled={isMainPending}
                  className="w-full aspect-square max-w-[200px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-50 text-slate-500 transition-colors text-sm">
                  {isMainPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-5 w-5" /> Încarcă fotografie</>}
                </button>
              )}
              {mainImageError && <p className="text-xs text-red-600">{mainImageError}</p>}
            </div>

            {/* Toggles */}
            <div className="flex gap-6 pt-2 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.available}
                  onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
                  className="h-4 w-4 rounded accent-primary" />
                <span className="text-sm font-medium">Disponibil</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_popular}
                  onChange={(e) => setForm((p) => ({ ...p, is_popular: e.target.checked }))}
                  className="h-4 w-4 rounded accent-amber-500" />
                <span className="text-sm font-medium">⭐ Popular</span>
              </label>
            </div>

            {formError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{formError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>
                Anulează
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : editingItem ? 'Salvează' : 'Adaugă'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
