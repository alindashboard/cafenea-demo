'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryFormData,
} from '@/app/admin/actions'
import type { MenuCategory } from '@/types/database'

const EMPTY_FORM: CategoryFormData = {
  name: '',
  description: '',
  icon: '',
  sort_order: 0,
  visible: true,
}

interface Props {
  initialCategories: MenuCategory[]
}

export function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null)
  const [form, setForm] = useState<CategoryFormData>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function openAdd() {
    setEditingCat(null)
    setForm({ ...EMPTY_FORM, sort_order: categories.length + 1 })
    setFormError('')
    setDialogOpen(true)
  }

  function openEdit(cat: MenuCategory) {
    setEditingCat(cat)
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      icon: cat.icon ?? '',
      sort_order: cat.sort_order,
      visible: cat.visible,
    })
    setFormError('')
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim()) { setFormError('Numele categoriei este obligatoriu.'); return }

    startTransition(async () => {
      try {
        if (editingCat) {
          const result = await updateCategory(editingCat.id, form)
          if (result?.error) { setFormError(result.error); return }
        } else {
          const result = await createCategory(form)
          if (result?.error) { setFormError(result.error); return }
        }
        setDialogOpen(false)
        router.refresh()
      } catch (err) {
        setFormError(err instanceof Error ? err.message : String(err))
      }
    })
  }

  function handleDelete(cat: MenuCategory) {
    if (!confirm(`Ștergi categoria "${cat.name}"? Produsele rămân, dar pierd categoria.`)) return
    startTransition(async () => {
      await deleteCategory(cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorii meniu</h1>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Adaugă categorie
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-lg bg-white">
          <p>Nu există categorii adăugate.</p>
          <Button onClick={openAdd} variant="outline" className="mt-4">Adaugă prima categorie</Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ordine</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Categorie</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vizibilitate</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-muted-foreground">{cat.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {cat.icon && <span className="text-lg">{cat.icon}</span>}
                      <div>
                        <p className="font-medium">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {cat.visible
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><Eye className="h-3.5 w-3.5" /> Vizibil</span>
                      : <span className="flex items-center gap-1 text-slate-400 text-xs"><EyeOff className="h-3.5 w-3.5" /> Ascuns</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(cat)} className="gap-1">
                        <Pencil className="h-3.5 w-3.5" /> Editează
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(cat)} className="gap-1">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCat ? 'Editează categorie' : 'Adaugă categorie'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cat-name">Nume *</Label>
                <Input id="cat-name" value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="ex: Espresso" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-icon">Icon (emoji)</Label>
                <Input id="cat-icon" value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="☕" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Descriere (opțional)</Label>
              <Input id="cat-desc" value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Scurtă descriere..." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-order">Ordine afișare</Label>
              <Input id="cat-order" type="number" value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.visible}
                onChange={(e) => setForm((p) => ({ ...p, visible: e.target.checked }))}
                className="h-4 w-4 rounded accent-primary" />
              <span className="text-sm font-medium">Vizibilă în meniu</span>
            </label>

            {formError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{formError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>Anulează</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCat ? 'Salvează' : 'Adaugă'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
