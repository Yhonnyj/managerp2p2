'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, FileText, Sheet, CloudDownload } from 'lucide-react'
import Image from 'next/image'
import paymentIcons from '@/utils/paymentIcons'
import platformIcons from '@/utils/platformIcons'
import AddTransactionModal from './AddTransactionModal'

type Transaction = {
  id: string
  transactionType: string
  usdt: number
  usd: number
  fee: number
  profit: number
  client_name: string
  date: string
  platform: string
  payment_method: string
}

type TransactionsResponse = {
  results: Transaction[]
  count: number
}

const fetchTransactions = async (page: number): Promise<TransactionsResponse> => {
  const res = await fetch(`/api/transactions?page=${page}`)
  if (!res.ok) throw new Error('Error al obtener transacciones')
  return res.json()
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', currentPage],
    queryFn: () => fetchTransactions(currentPage),
    placeholderData: () => ({ results: [], count: 0 }),
  })

  const transactions = data?.results || []
  const totalPages = Math.ceil((data?.count || 0) / 10)

  const filtered = transactions.filter((t) =>
    [t.client_name, t.platform, t.payment_method]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  )

  const handleUpload = async () => {
    if (!file) return alert('Selecciona un archivo Excel primero.')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/transaction/import/excel', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error()
      alert('✅ Importación exitosa')
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    } catch {
      alert('❌ Error al importar')
    }
  }

  const handleAddTransaction = async (tx: any) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      })
      if (!res.ok) throw new Error()
      await res.json()
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    } catch {
      alert('❌ Error al guardar transacción')
    }
  }

  const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}


  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white p-8 ml-64">
      <h1 className="text-3xl font-bold mb-8">Transacciones</h1>

      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Buscar cliente, método o plataforma"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 p-3 rounded-lg flex-grow"
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <CopyPlus className="w-5 h-5" /> Agregar
        </button>

        <button
          onClick={() => window.open('/api/transaction/export/pdf', '_blank')}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <FileText className="w-5 h-5" /> PDF
        </button>

        <button
          onClick={() => window.open('/api/transaction/export/excel', '_blank')}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <Sheet className="w-5 h-5" /> Excel
        </button>

        <label className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2">
          <CloudDownload className="w-5 h-5" /> Importar
          <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} hidden />
        </label>

        {file && (
          <button onClick={handleUpload} className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg">
            Confirmar
          </button>
        )}
      </div>

      {/* Tabla */}
<div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
  <table className="w-full text-sm text-left">
    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
      <tr>
        <th className="px-6 py-4 text-center">Price</th>
        <th className="px-6 py-4 text-center">USDT</th>
        <th className="px-6 py-4 text-center">USD</th>
        <th className="px-6 py-4 text-center">Fee</th>
        <th className="px-6 py-4 text-center">Profit</th>
        <th className="px-6 py-4 text-center">Cliente</th>
        <th className="px-6 py-4 text-center">Fecha</th>
        <th className="px-6 py-4 text-center">Plataforma</th>
        <th className="px-6 py-4 text-center">Método de Pago</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((t) => (
        <tr
          key={t.id}
          className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition"
        >
          <td className="px-6 py-4 text-center">{(t.usd / t.usdt).toFixed(2)}</td>
          <td className="px-6 py-4 text-center">{t.usdt}</td>
          <td className="px-6 py-4 text-center">{t.usd}</td>

          {/* Fee en valor monetario */}
          <td className="px-6 py-4 text-center">
            {((t.usdt * t.fee) / 100).toFixed(2)}
          </td>

          <td className="px-6 py-4 text-center">{t.profit}</td>
          <td className="px-6 py-4 text-center">{t.client_name}</td>
          <td className="px-6 py-4 text-center">{formatDate(t.date)}</td>
          <td className="px-6 py-4 text-center">
            {platformIcons[t.platform] && (
              <Image
                src={platformIcons[t.platform]}
                alt={t.platform}
                width={32}
                height={32}
                className="mx-auto rounded"
              />
            )}
          </td>
          <td className="px-6 py-4 text-center">
  {'paymentMethod' in t && typeof t.paymentMethod === 'string' && paymentIcons[t.paymentMethod as keyof typeof paymentIcons] && (
    <Image
      src={paymentIcons[t.paymentMethod as keyof typeof paymentIcons]}
      alt={t.paymentMethod}
      width={32}
      height={32}
      className="mx-auto rounded"
    />
  )}
</td>

        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-30"
        >⬅</button>
        <span className="text-sm">Página <b>{currentPage}</b> de <b>{totalPages}</b></span>
        <button
          onClick={() => setCurrentPage((p) => (currentPage < totalPages ? p + 1 : p))}
          disabled={currentPage === totalPages}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-30"
        >➡</button>
      </div>

      {/* Modal agregar transacción */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
      />
    </div>
  )
}
