'use client'

import { useQuery } from '@tanstack/react-query'
import axios from '@/utils/axios'

type Summary = {
  transacciones_totales: number
  compras: number
  ventas: number
  ganancia: number
}

type DashboardData = {
  summary: Summary
  monthlyOperations: number[]
  monthlyClients: number[]
  topClients: {
    client_id: string
    client: string
    total: number
  }[]
  latestTransactions: {
    id: string
    client_id: string
    client_name: string
    usd: number
    usdt: number
    fee: number
    profit: number
    platform: string
    payment_method: string
    transaction_type: string
    date: string
  }[]
}

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await axios.get('/dashboard') // ✅ CORREGIDO (sin /api)
      return data
    },
  })
}
