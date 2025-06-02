'use client'

import React from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

const months = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

type Props = {
  data: number[]
}

export default function ClientsChart({ data }: Props) {
  const options = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 300,
        animateGradually: { enabled: true, delay: 50 },
        dynamicAnimation: { enabled: true, speed: 300 },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '50%',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: months,
      labels: { style: { colors: '#E5E7EB', fontWeight: 500 } },
      axisBorder: { color: '#4B5563' },
      axisTicks: { color: '#4B5563' },
    },
    yaxis: {
      title: {
        text: 'Clientes Nuevos',
        style: { color: '#E5E7EB' },
      },
      labels: { style: { colors: '#E5E7EB' } },
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 5,
    },
    colors: ['#45B4B0'],
    tooltip: { theme: 'dark' },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.65, // Forzado por TypeScript
        },
      },
    },
  } as ApexOptions

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 text-white">
      <h2 className="text-xl font-bold mb-4">Clientes Nuevos por Mes</h2>
      <Chart
        options={options}
        series={[{ name: 'Clientes Nuevos', data }]}
        type="bar"
        height={360}
      />
    </div>
  )
}
