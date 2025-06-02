'use client'

import React, { useState } from 'react'

type Props = {
  data: {
    id: string
    client_name: string
    transaction_type: string
    usd: number
    date: string
    [key: string]: any // por si viene extra info como fee, usdt, etc.
  }[]
}

export default function OperationsList({ data }: Props) {
  const [showAll, setShowAll] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Props['data'][number] | null>(null)

  const visibleTransactions = showAll ? data : data.slice(0, 9)

  return (
    <>
      <div className="relative overflow-x-auto rounded-2xl shadow-lg border border-gray-700 mt-6 bg-gray-900 p-4">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Tipo</th>
              <th scope="col" className="px-6 py-3">USD</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelectedTx(t)}
                className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 cursor-pointer hover:bg-orange-700/20 transition-all"
              >
                <td className="px-6 py-4 font-semibold">{t.id}</td>
                <td className="px-6 py-4 truncate">{t.client_name}</td>
                <td className="px-6 py-4 capitalize">{t.transaction_type}</td>
                <td className="px-6 py-4 font-bold text-orange-400">
                  ${Number(t.usd).toFixed(2)}
                </td>
                <td className="px-6 py-4">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!showAll && data.length > 9 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-600 hover:border-white hover:text-white transition-all text-gray-400"
            >
              ⤢ Mostrar más transacciones
            </button>
          </div>
        )}
      </div>
    </>
  )
}
