'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  CreditCard,
  FolderKanban,
  Layers
} from 'lucide-react'
import { UserButton, SignOutButton } from '@clerk/nextjs'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transacciones', href: '/transactions', icon: FileText },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Reportes', href: '/dashboard/reports', icon: BarChart2 },
  { name: 'Bancos', href: '/dashboard/banks', icon: CreditCard },
  { name: 'Finanzas', href: '/dashboard/finances', icon: FolderKanban },
  { name: 'Categorías', href: '/dashboard/categories', icon: Layers }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white shadow-xl flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-orange-500 tracking-wide">ManagerP2P</h1>
        </div>

        {/* Navegación */}
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
                  isActive ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/30 text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer: Avatar + Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <SignOutButton redirectUrl="/sign-in">
            <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  )
}
