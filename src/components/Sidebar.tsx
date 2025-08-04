'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  CreditCard,
  FolderKanban,
  Layers,
  LogOut,
  Menu
} from 'lucide-react'
import { UserButton, SignOutButton, useUser } from '@clerk/nextjs'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transacciones', href: '/transactions', icon: FileText },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Reportes', href: '/reports', icon: BarChart2 },
  { name: 'Bancos', href: '/banks', icon: CreditCard, soon: true },
  { name: 'Finanzas', href: '/finances', icon: FolderKanban, soon: true },
  { name: 'Categorías', href: '/categories', icon: Layers, soon: true },
]


export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [username, setUsername] = useState('Usuario')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (user) {
      const name =
        user?.firstName ||
        user?.username ||
        user?.primaryEmailAddress?.emailAddress ||
        'Usuario'
      setUsername(name)
    }
  }, [user])

  return (
    <>
      {/* ☰ Botón hamburguesa solo en móviles */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 p-2 rounded-full shadow-lg border border-gray-700"
      >
        <Menu className="h-8 w-8 text-white" />
      </button>

      {/* Sidebar completo (siempre visible en desktop, toggleable en móvil) */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-gray-800 text-white shadow-xl flex flex-col justify-between border-r border-gray-700
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* 🔶 Logo */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-30 h-auto rounded-xl shadow"
          />
        </div>

        {/* 🔸 Navegación */}
        <nav className="mt-4 px-4 space-y-1 overflow-y-auto flex-1 text-[15px]">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'hover:bg-orange-500/30 text-gray-300'
                }`}
                onClick={() => setOpen(false)} // cerrar sidebar al hacer clic en móvil
              >
                <Icon className="w-7 h-7 text-teal-400" />
                {name}
              </Link>
            )
          })}
        </nav>

        {/* 🔻 Footer con logout */}
        <div className="px-4 py-5 border-t border-gray-700 space-y-3">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/sign-in" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-200 truncate">{username}</p>
            </div>
          </div>

          <SignOutButton redirectUrl="/sign-in">
            <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md transition">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Fondo oscuro solo en móviles cuando el sidebar está abierto */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  )
}
