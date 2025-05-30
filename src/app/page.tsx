'use client'

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Bienvenido a ManagerP2P 2.0</h1>

      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-4">
          <UserButton />
          <SignOutButton />
        </div>
      </SignedIn>
    </main>
  )
}
