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
  { name: 'Bancos', href: '/banks', icon: CreditCard },
  { name: 'Finanzas', href: '/finances', icon: FolderKanban },
  { name: 'Categorías', href: '/categories', icon: Layers }
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
      {/* ☰ Toggle para móviles */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 p-2 rounded-full shadow-lg border border-gray-700"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-gray-950 text-white shadow-xl flex flex-col justify-between border-r border-gray-800 transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* 🔶 Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-orange-500 tracking-wide">ManagerP2P</h1>
        </div>

        {/* 🔸 Navegación */}
        <nav className="mt-6 px-4 space-y-1 overflow-y-auto flex-1">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'hover:bg-orange-500/30 text-gray-300'
                }`}
                onClick={() => setOpen(false)} // Cierra el menú en móvil al navegar
              >
                <Icon className="w-5 h-5 text-teal-400" />
                {name}
              </Link>
            )
          })}
        </nav>

        {/* 🔻 Footer con avatar, nombre y logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/sign-in" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-200 truncate">{username}</p>
            </div>
          </div>
          <div className="mt-3">
            <SignOutButton redirectUrl="/sign-in">
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Fondo oscuro cuando está abierto en móvil */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  )
}
