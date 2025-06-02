'use client'

import DashboardStats from './DashboardStats'
import ClientsSection from './ClientsSection'
import OperationsSection from './OperationsSection'
import { useDashboard } from '@/hooks/useDashboard'

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard()

  if (isError) {
    return (
      <div className="ml-64 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error al cargar el dashboard</h1>
          <p className="text-gray-400">Verifica tu conexión o vuelve a intentar más tarde.</p>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="ml-64 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-300">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <DashboardStats data={data.summary} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ClientsSection data={data} />
          <OperationsSection data={data} />
        </div>
      </div>
    </div>
  )
}
