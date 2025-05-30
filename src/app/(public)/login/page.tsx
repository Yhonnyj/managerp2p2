'use client'

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Bienvenido de nuevo</h1>
        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary: 'bg-orange-600 hover:bg-orange-500 text-sm normal-case',
              card: 'bg-gray-800 shadow-none border border-gray-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600',
            },
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  )
}
