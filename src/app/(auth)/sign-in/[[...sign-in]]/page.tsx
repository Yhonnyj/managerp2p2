'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <SignIn
        path="/sign-in"
        routing="path"
        redirectUrl="/dashboard" // ✅ Redirige al dashboard
        appearance={{
          elements: {
            formButtonPrimary:
              'bg-orange-500 hover:bg-orange-600 text-sm normal-case',
          },
        }}
      />
    </div>
  )
}


