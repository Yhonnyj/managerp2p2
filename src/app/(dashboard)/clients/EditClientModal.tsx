'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import countries from 'country-flag-emoji-json'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

interface Props {
  isOpen: boolean
  onClose: () => void
  clientData: any
}

export default function EditClientModal({ isOpen, onClose, clientData }: Props) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
  })

  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        country: clientData.country || '',
        address: clientData.address || '',
      })
    }
  }, [clientData])

  const { mutate: updateClient, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.put(`/api/clients?id=${clientData.id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      onClose()
    },
    onError: (err: any) => {
      alert(err.message || '❌ Error al actualizar cliente')
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('⚠️ El nombre del cliente es obligatorio.')
      return
    }
    updateClient(formData)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 text-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative border border-gray-700"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
              Editar Cliente <span className="text-gray-400">#{clientData.id}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="text-gray-400 block mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">País</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                >
                  <option value="">Selecciona un país</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  {isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
