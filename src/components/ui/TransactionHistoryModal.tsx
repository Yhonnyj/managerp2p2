'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, FileSpreadsheet, X, Images } from 'lucide-react'
import countries from 'country-flag-emoji-json'
import platformIcons from '@/utils/platformIcons'
import paymentIcons from '@/utils/paymentIcons'
import axios from 'axios'

type Props = {
  isOpen: boolean
  onClose: () => void
  clientId: string
}

export default function TransactionHistoryModal({ isOpen, onClose, clientId }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [showImagesSidebar, setShowImagesSidebar] = useState(false)
  const rowsPerPage = 9
  const queryClient = useQueryClient()

  const { data: transactionsData = { results: [] }, isLoading } = useQuery({
    queryKey: ['transactions-client', clientId],
    queryFn: async () => {
      const res = await axios.get(`/api/transactions?clientId=${clientId}`)
      return res.data
    },
    enabled: !!clientId && isOpen,
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await axios.get('/api/clients')
      return res.data
    },
    enabled: isOpen,
  })

  const transactions = transactionsData.results
  const totalPages = Math.ceil(transactions.length / rowsPerPage)
  const client = clients.find((c: any) => c.id === clientId)

  const getCountryCode = (name: string) => {
    const country = countries.find((c) => c.name.toLowerCase() === name?.toLowerCase())
    return country?.code?.toLowerCase() || null
  }

  const exportToPDF = () => {
    window.open(`/api/clients/export/pdf?id=${clientId}`, '_blank')
  }

  const exportToExcel = () => {
    window.open(`/api/clients/export/excel?id=${clientId}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-gray-900 text-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 relative border border-gray-700">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>

          <div className="absolute top-16 right-4">
            <button
              onClick={() => setShowImagesSidebar(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg"
              title="Ver documentos del cliente"
            >
              <Images className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 border-b border-gray-700 pb-4 mb-6 mt-2">
            <img
              src={
                client?.country
                  ? `https://flagcdn.com/h40/${getCountryCode(client.country)}.png`
                  : '/icons/white-flag.svg'
              }
              alt="País"
              className="w-8 h-6 rounded border border-gray-900 shadow"
            />
            <div>
              <h2 className="text-2xl font-bold">
                {client?.name || 'Cliente'}{' '}
                <span className="text-gray-400">ID {clientId}</span>
              </h2>
              <p className="text-sm text-gray-400">
                Total operaciones: <span className="font-semibold">{transactions.length}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-4 text-sm space-y-3">
              <InfoItem label="Teléfono" value={client?.phone} />
              <InfoItem label="Dirección" value={client?.address} />
              <InfoItem label="Correo" value={client?.email} />
              <InfoItem label="País" value={client?.country} />
            </div>

            <div className="col-span-2 max-h-96 overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-400">
                  <tr>
                    <th className="px-3 py-2">USDT</th>
                    <th className="px-3 py-2">USD</th>
                    <th className="px-3 py-2">Profit</th>
                    <th className="px-3 py-2">Pago</th>
                    <th className="px-3 py-2">Plataforma</th>
                    <th className="px-3 py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                    .map((tx: any) => (
                      <tr
                        key={tx.id}
                        className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer transition"
                        onClick={() => setSelectedTx(tx)}
                      >
                        <td className="px-3 py-2">{tx.usdt}</td>
                        <td className="px-3 py-2">{tx.usd}</td>
                        <td className="px-3 py-2">{tx.profit}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            {tx.paymentMethod && paymentIcons[tx.paymentMethod] ? (
                              <>
                                <img
                                  src={paymentIcons[tx.paymentMethod]}
                                  className="w-5 h-5 object-contain shrink-0"
                                  alt={tx.paymentMethod}
                                />
                                <span>{tx.paymentMethod}</span>
                              </>
                            ) : (
                              <span>{tx.paymentMethod || '-'}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            {tx.platform && platformIcons[tx.platform] ? (
                              <>
                                <img
                                  src={platformIcons[tx.platform]}
                                  className="w-5 h-5 object-contain shrink-0"
                                  alt={tx.platform}
                                />
                                <span>{tx.platform}</span>
                              </>
                            ) : (
                              <span>{tx.platform || '-'}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {new Intl.DateTimeFormat("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(tx.date))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {transactions.length === 0 && !isLoading && (
                <div className="text-center text-gray-400 py-8">No hay transacciones disponibles.</div>
              )}

              {transactions.length > rowsPerPage && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-gray-300 hover:text-white disabled:opacity-30"
                    >
                      &lt;
                    </button>
                    <span className="px-3 py-1 bg-orange-500 rounded-lg text-white font-bold">{currentPage}</span>
                    <button
                      onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
                      disabled={currentPage === totalPages}
                      className="text-gray-300 hover:text-white disabled:opacity-30"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}:</p>
      <p className="font-semibold">{value || '-'}</p>
    </div>
  )
}
