'use client'

import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, ImagePlus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

type Props = {
  isOpen: boolean
  onClose: () => void
  clientId: string
}

type ClientImage = {
  id: string
  imagen: string
  titulo: string
}

export default function ClientImagesSidebar({ isOpen, onClose, clientId }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()

  const {
    data: images = [],
    isLoading,
  } = useQuery<ClientImage[]>({
    queryKey: ['client-images', clientId],
    queryFn: async () => {
      const res = await fetch(`/api/clients/${clientId}/images`)
      if (!res.ok) throw new Error('Error al cargar imágenes')
      const data = await res.json()
      return data.results || []
    },
    enabled: isOpen && !!clientId,
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('imagen', file)
      formData.append('titulo', file.name)

      const res = await fetch(`/api/clients/${clientId}/upload-image`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Error al subir imagen')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-images', clientId] })
      toast.success('✅ Imagen subida correctamente')
    },
    onError: () => {
      toast.error('❌ Error al subir imagen')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const res = await fetch(`/api/clients/images/${imageId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar imagen')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-images', clientId] })
      toast.success('✅ Imagen eliminada')
    },
    onError: () => {
      toast.error('❌ Error al eliminar imagen')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    toast.loading('Subiendo imagen...')
    uploadMutation.mutate(file)
  }

  const handleDelete = (imageId: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    toast.loading('Eliminando imagen...')
    deleteMutation.mutate(imageId)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>

      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-gray-900 border-l border-gray-700 z-50 shadow-2xl animate-slideIn">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Documentos del Cliente</h2>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => inputRef.current?.click()}
              title="Subir imagen"
              className="text-gray-400 hover:text-white transition"
            >
              <ImagePlus className="w-6 h-6" />
            </button>

            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-4">
          {isLoading ? (
            <p className="text-gray-400 text-center">Cargando imágenes...</p>
          ) : images.length > 0 ? (
            images.map((img) => (
              <div key={img.id} className="relative w-full group">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded hover:bg-red-600 transition z-10"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>

                <img
                  src={img.imagen}
                  alt={img.titulo || 'Documento'}
                  className="w-full h-48 object-cover rounded-lg border border-gray-700 shadow"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-8">No hay imágenes disponibles.</p>
          )}
        </div>
      </div>
    </>
  )
}
