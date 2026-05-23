'use client'

import { Sidebar } from '@/components/layout/Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
