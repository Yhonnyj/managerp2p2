import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header' // ✅ importar el header
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen w-full bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col bg-gray-900 text-white">
            <main className="flex-1 px-4 pt-1 pb-2">{children}</main>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </>
  )
}
