'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import countries from 'country-flag-emoji-json'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddClientModal({ isOpen, onClose, onSuccess }: Props) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        name: formData.name.trim(),
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
        country: formData.country?.trim() || '',
        address: formData.address?.trim() || '',
      }

      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al crear cliente')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      onSuccess?.()
      onClose()
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('⚠️ El nombre es obligatorio.')
      return
    }
    mutate()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 text-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative border border-gray-700"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Agregar Cliente</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nombre"
                className="w-full p-2 bg-gray-800 rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 bg-gray-800 rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full p-2 bg-gray-800 rounded"
              />
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded"
              >
                <option value="">Selecciona país</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Dirección"
                className="w-full p-2 bg-gray-800 rounded"
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-teal-500 text-teal-500 rounded-lg hover:bg-teal-500 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg"
                >
                  {isPending ? 'Guardando...' : 'Agregar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
