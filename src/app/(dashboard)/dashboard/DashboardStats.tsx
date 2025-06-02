'use client'

import { TrendingUp, DollarSign, ShoppingCart, Store } from 'lucide-react'

type Summary = {
  transacciones_totales: number
  ganancia: number
  compras: number
  ventas: number
}

type Props = {
  data: Summary
}

export default function DashboardStats({ data }: Props) {
  const stats = [
    {
      title: 'Transacciones Totales',
      value: data.transacciones_totales,
      icon: <TrendingUp className="w-10 h-10 text-orange-400 animate-pulse" />,
    },
    {
      title: 'Ganancias',
      value: `$${data.ganancia.toFixed(2)}`,
      icon: <DollarSign className="w-10 h-10 text-orange-400 animate-pulse" />,
    },
    {
      title: 'Compras',
      value: data.compras,
      icon: <ShoppingCart className="w-10 h-10 text-orange-400 animate-pulse" />,
    },
    {
      title: 'Ventas',
      value: data.ventas,
      icon: <Store className="w-10 h-10 text-orange-400 animate-pulse" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
        >
          {stat.icon}
          <h3 className="text-lg text-gray-300 font-semibold mt-4">{stat.title}</h3>
          <p className="text-3xl font-bold text-orange-400 mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
