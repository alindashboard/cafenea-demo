'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadGalleryImage, deleteGalleryImage } from '@/app/admin/actions'
import type { GalleryImage } from '@/types/database'

interface Props {
  initialImages: GalleryImage[]
}

export function GalleryManager({ initialImages }: Props) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [caption, setCaption] = useState('')
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''
    setUploadError('')
    setUploading(true)

    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('caption', caption)
      const result = await uploadGalleryImage(fd)
      if (result && 'error' in result) {
        setUploadError(result.error ?? 'Eroare la upload.')
        break
      }
    }

    setCaption('')
    setUploading(false)
    router.refresh()
  }

  function handleDelete(img: GalleryImage) {
    if (!confirm('Ștergi această fotografie din galerie?')) return
    startTransition(async () => {
      await deleteGalleryImage(img.id)
      setImages((prev) => prev.filter((i) => i.id !== img.id))
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Galerie locație</h1>
      </div>

      {/* Upload zone */}
      <div className="bg-white border rounded-xl p-5 mb-6 space-y-3">
        <h2 className="font-semibold text-sm">Adaugă fotografii</h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              placeholder="Legendă fotografie (opțional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Se încarcă...' : 'Alege fotografii'}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </div>
        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-lg bg-white">
          <p>Nu există fotografii în galerie.</p>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mt-4 gap-2">
            <Upload className="h-4 w-4" /> Încarcă prima fotografie
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border bg-slate-100 aspect-[4/3]">
              <Image
                src={img.url}
                alt={img.caption ?? 'Galerie'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                  {img.caption}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(img)}
                  disabled={isPending}
                  className="gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Șterge
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
