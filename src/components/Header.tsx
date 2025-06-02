'use client'

import { Bell, CalendarDays, Search } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'

export default function Header() {
  const { user } = useUser()
  const username = user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Usuario'

  return (
    <header className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between text-white shadow-md sticky top-0 z-40">
      {/* 🔍 Buscador y filtros */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-gray-800 text-sm text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
          />
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-700">
          <CalendarDays className="w-4 h-4" />
          Hoy
        </button>
      </div>

      {/* 🔔 Notificación + Perfil */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700">
          <Bell className="w-5 h-5 text-gray-300" />
          {/* Notificación ejemplo */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm text-gray-300">Hola, <span className="font-semibold text-orange-400">{username}</span></div>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  )
}
