'use client'

import React from 'react'
import { Users } from 'lucide-react'
import ClientsChart from './ClientsChart'
import ClientsList from './ClientsList'

type Props = {
  data: {
    monthlyClients: number[]
    topClients: {
      client_id: string
      client: string
      total: number
    }[]
  }
}

export default function ClientsSection({ data }: Props) {
  return (
    <div className="mt-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl text-white border border-gray-700 animate-fadeIn">
      {/* Encabezado con ícono */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-cyan-500/20 p-3 rounded-full animate-pulse">
          <Users className="w-7 h-7 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-1 text-cyan-400">Clientes</h2>
          <p className="text-gray-400 text-sm">Registro y crecimiento de clientes</p>
        </div>
      </div>

      {/* 📈 Gráfico de crecimiento de clientes */}
      <div className="mb-8">
        <ClientsChart data={data.monthlyClients} />
      </div>

      {/* 📋 Lista de clientes */}
      <ClientsList data={data.topClients} />
    </div>
  )
}
