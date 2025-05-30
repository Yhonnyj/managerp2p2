// src/app/(dashboard)/layout.tsx
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      <Sidebar />
      <main className="flex-1 bg-gray-900 text-white">{children}</main>
    </div>
  )
}
