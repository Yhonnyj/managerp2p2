'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryProvider } from '@/lib/react-query-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ClerkProvider>
  )
}
