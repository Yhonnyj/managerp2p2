'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { UserRoundPlus, FileText, FileSpreadsheet, UserRoundPen, UserRoundX } from 'lucide-react'
import TransactionHistoryModal from '@/components/ui/TransactionHistoryModal'
import EditClientModal from '@/app/(dashboard)/clients/EditClientModal'
import AddClientModal from './AddClientModal'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import countries from 'country-flag-emoji-json'

const getFlagEmoji = (countryName: string) => {
  if (!countryName) return '🏳️'
  const country = countries.find((c) => c.name.toLowerCase() === countryName.toLowerCase())
  return country ? country.emoji : '🏳️'
}

export default function ClientsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [clientToDelete, setClientToDelete] = useState<any>(null)
  const clientsPerPage = 10

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await axios.get('/api/clients')
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/clients?id=${id}`)
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

  const filteredClients = clients.filter((c: any) =>
    [c.id, c.name, c.country].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  )

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)

  const handleDelete = async () => {
    if (!clientToDelete) return
    await deleteMutation.mutateAsync(clientToDelete.id)
    setClientToDelete(null)
  }

  return (
    <div className="bg-gray-900 via-gray-800 to-gray-900 min-h-screen text-white p-8 ml-64">
      <h1 className="text-3xl font-bold mb-8">Clientes</h1>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Buscar cliente o país"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 p-3 rounded-lg flex-grow"
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <UserRoundPlus className="w-5 h-5" /> Agregar
        </button>

        <button
          onClick={() => window.open('/api/clients/export/pdf', '_blank')}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <FileText className="w-5 h-5" /> PDF
        </button>
        <button
          onClick={() => window.open('/api/clients/export/excel', '_blank')}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <FileSpreadsheet className="w-5 h-5" /> Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="w-full text-base text-left">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th className="px-6 py-4 text-center">ID</th>
              <th className="px-6 py-4 text-center">Nombre</th>
              <th className="px-6 py-4 text-center">País</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6">
                  No hay clientes.
                </td>
              </tr>
            ) : (
              paginatedClients.map((client: any) => (
                <tr
                  key={client.id}
                  className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4 text-center">{client.id}</td>
                  <td
                    className="px-6 py-4 text-center hover:text-orange-400 cursor-pointer"
                    onClick={() => {
                      setSelectedClient(client)
                      setIsHistoryModalOpen(true)
                    }}
                  >
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-3xl">{getFlagEmoji(client.country)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedClient(client)
                          setIsEditModalOpen(true)
                        }}
                        className="text-green-400 hover:text-green-300"
                      >
                        <UserRoundPen className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setClientToDelete(client)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <UserRoundX className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-30"
        >⬅</button>
        <span className="text-sm">
          Página <b>{currentPage}</b> de <b>{totalPages}</b>
        </span>
        <button
          onClick={() => setCurrentPage((p) => (currentPage < totalPages ? p + 1 : p))}
          disabled={currentPage === totalPages}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-30"
        >➡</button>
      </div>

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['clients'] })
          setIsAddModalOpen(false)
        }}
      />

      {selectedClient && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          clientData={selectedClient}
        />
      )}

      {selectedClient && (
        <TransactionHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          clientId={selectedClient.id}
        />
      )}

      {clientToDelete && (
        <ConfirmDeleteModal
          isOpen={!!clientToDelete}
          onClose={() => setClientToDelete(null)}
          onConfirm={handleDelete}
          item={`cliente ${clientToDelete.name}`}
        />
      )}
    </div>
  )
}
