'use client'

import './globals.css'
import { useEffect } from 'react'
import { useAppStore } from '@/store/app-store'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const darkMode = useAppStore((s) => s.darkMode)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <html lang="en" className={darkMode ? 'dark' : ''} suppressHydrationWarning>
      <head>
        <title>PocketFinance — Smart Money Tracker</title>
        <meta name="description" content="Track your income and expenses with beautiful analytics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  )
}
