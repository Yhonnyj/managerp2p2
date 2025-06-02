// components/ExportExcelPdfModal.tsx
"use client"

import { useState } from "react"
import { X } from "lucide-react"
import axios from "@/utils/axios"
import toast from "react-hot-toast"

interface Props {
  isOpen: boolean
  onClose: () => void
  tipo: "pdf" | "excel"
  endpoint: string // ej: "/reports/export/excel"
}

export default function ExportExcelPdfModal({ isOpen, onClose, tipo, endpoint }: Props) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isFullExport, setIsFullExport] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleDownload = async () => {
    if (!isFullExport && (!startDate || !endDate)) {
      toast.error("Selecciona un rango o marca 'Total histórico'")
      return
    }

    try {
      setLoading(true)

      const params = isFullExport
        ? { todo: 1 }
        : { start: startDate, end: endDate }

      const res = await axios.get(endpoint, {
        params,
        responseType: "blob",
      })

      const fileType = tipo === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf"

      const fileExtension = tipo === "excel" ? "xlsx" : "pdf"

      const blob = new Blob([res.data], { type: fileType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `reporte.${fileExtension}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      onClose()
    } catch {
      toast.error("Error al generar el reporte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-md p-6 relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Selecciona un rango</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Desde:</label>
            <input
              type="date"
              className="bg-gray-800 p-2 rounded w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isFullExport}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Hasta:</label>
            <input
              type="date"
              className="bg-gray-900 p-2 rounded w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isFullExport}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <input
            id="fullExport"
            type="checkbox"
            className="accent-orange-600"
            checked={isFullExport}
            onChange={() => setIsFullExport(!isFullExport)}
          />
          <label htmlFor="fullExport" className="text-sm text-gray-300">
            Total histórico
          </label>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-500 w-full py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Generando..." : `Generar ${tipo === "excel" ? "Excel" : "PDF"}`}
        </button>
      </div>
    </div>
  )
}