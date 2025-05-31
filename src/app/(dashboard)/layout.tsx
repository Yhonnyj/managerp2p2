import Sidebar from '@/components/Sidebar'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen w-full bg-gray-900">
          <Sidebar />
          <main className="flex-1 bg-gray-900 text-white">{children}</main>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </>
  )
}
