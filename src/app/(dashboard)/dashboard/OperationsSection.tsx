'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'
import OperationsChart from './OperationsChart'
import OperationsList from './OperationsList'

type Props = {
  data: {
    monthlyOperations: number[]
    latestTransactions: any[] // lo tiparemos luego si quieres
  }
}

export default function OperationsSection({ data }: Props) {
  return (
    <div className="mt-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl text-white border border-gray-700 animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-orange-500/20 p-3 rounded-full animate-pulse">
          <TrendingUp className="w-7 h-7 text-orange-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-1 text-orange-400">Operaciones</h2>
          <p className="text-gray-400 text-sm">Últimas transacciones registradas</p>
        </div>
      </div>

      {/* 📊 Gráfico de operaciones */}
      <div className="mb-8">
        <OperationsChart data={data.monthlyOperations} />
      </div>

      {/* 📋 Lista de últimas transacciones */}
      <OperationsList data={data.latestTransactions} />
    </div>
  )
}
