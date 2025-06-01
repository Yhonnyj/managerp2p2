'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { X, UserRoundPlus } from 'lucide-react'
import platformIcons from '@/utils/platformIcons'
import paymentIcons from '@/utils/paymentIcons'
import AddClientModal from '../clients/AddClientModal'

type Client = {
  id: string
  name: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export default function AddTransactionModal({ isOpen, onClose, onSave }: Props) {
  const [tipo, setTipo] = useState('Compra')
  const [usdt, setUsdt] = useState('')
  const [usd, setUsd] = useState('')
  const [platform, setPlatform] = useState('')
  const [fee, setFee] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [client, setClient] = useState('')
  const [clientesData, setClientesData] = useState<Client[]>([])
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('/api/clients')
        setClientesData(res.data)
      } catch {
        toast.error('Error cargando clientes')
      }
    }

    if (isOpen) fetchClients()
  }, [isOpen])

  useEffect(() => {
    setFee(
      platform === 'Dorado' ? 0.3 :
      platform === 'Apolo Pay' ? 0.2 :
      platform === 'Binance' ? 0.28 : 0
    )
  }, [platform])

  const handleSubmit = () => {
    if (!usdt || !usd || !client || !platform || !paymentMethod) {
      toast.error('Todos los campos son obligatorios.')
      return
    }

    const localDate = new Date()
    localDate.setHours(12, 0, 0, 0)

    const newTransaction = {
      transactionType: tipo.toLowerCase(),
      usdt: parseFloat(usdt),
      usd: parseFloat(usd),
      platform,
      fee,
      paymentMethod,
      clientId: client,
      date: localDate,
    }

    onSave(newTransaction)
    onClose()
  }

  const handleClientCreated = async () => {
    try {
      const res = await axios.get('/api/clients')
      setClientesData(res.data)
      if (res.data.length > 0) {
        setClient(res.data[0].id)
      }
    } catch {
      toast.error('Error actualizando clientes')
    } finally {
      setIsAddClientOpen(false)
    }
  }

  if (!isOpen) return null

  const platforms = ['Apolo Pay', 'Binance', 'Bitget', 'Bybit', 'Dorado', 'Kucoin', 'Paxful', 'Otro']
  const paymentMethods = ['Banesco', 'BOA', 'Chase', 'Facebank', 'Mercantil', 'Mony', 'Paypal', 'Zelle', 'Zinli', 'Wally Tech', 'Otro']

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border-b border-gray-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-orange-400">Nueva Transacción</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div>
            <label className="text-gray-400 mb-1 block">Tipo de transacción</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
            >
              <option>Compra</option>
              <option>Venta</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-gray-400 mb-1">
              <span>Cliente</span>
              <button
                onClick={() => setIsAddClientOpen(true)}
                className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1"
              >
                <UserRoundPlus className="w-5 h-5" />
              </button>
            </div>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
            >
              <option value="">Clientes</option>
              {clientesData?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 mb-1 block">Monto (USDT)</label>
            <input
              type="number"
              value={usdt}
              onChange={(e) => setUsdt(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
              placeholder="USDT"
            />
          </div>

          <div>
            <label className="text-gray-400 mb-1 block">Monto (USD)</label>
            <input
              type="number"
              value={usd}
              onChange={(e) => setUsd(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
              placeholder="USD"
            />
          </div>

          <div className="col-span-2">
            <label className="text-gray-400 mb-2 block">Plataforma</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                    platform === p
                      ? 'bg-orange-800 border-orange-600'
                      : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <img src={platformIcons[p]} alt={p} className="w-5 h-5" />
                  <span className="text-sm">{p}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-gray-400 mb-2 block">Método de Pago</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                    paymentMethod === m
                      ? 'bg-orange-800 border-orange-600'
                      : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <img src={paymentIcons[m]} alt={m} className="w-5 h-5" />
                  <span className="text-sm">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 mb-1 block">Fee (%)</label>
            <input
              value={fee}
              readOnly
              className="bg-gray-700 p-2 rounded-lg w-full cursor-not-allowed text-gray-300"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-700 pt-6 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-orange-700 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg transition"
          >
            Guardar
          </button>
        </div>
      </div>

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSuccess={handleClientCreated}
      />
    </div>
  )
}
