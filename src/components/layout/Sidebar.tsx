'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, Wallet,
  Target, Settings, LogOut, Moon, Sun, Plus, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions',  icon: ArrowLeftRight,  label: 'Transactions' },
  { href: '/analytics',     icon: BarChart3,       label: 'Analytics' },
  { href: '/budgets',       icon: Target,          label: 'Budgets' },
  { href: '/wallets',       icon: Wallet,          label: 'Wallets' },
  { href: '/settings',      icon: Settings,        label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { darkMode, toggleDarkMode, user } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow-sm flex-shrink-0">
          <span className="text-base">💎</span>
        </div>
        <span className="font-display font-bold text-lg">PocketFinance</span>
      </div>

      {/* Add transaction button */}
      <div className="px-4 mb-6">
        <Link href="/transactions?add=true">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm shadow-glow-sm hover:shadow-glow transition-all"
          >
            <Plus size={16} />
            Add Transaction
          </motion.button>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
                  active
                    ? 'bg-brand-500/15 text-brand-400 shadow-glow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)]'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 w-0.5 h-6 bg-brand-400 rounded-r"
                  />
                )}
                <item.icon size={18} />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-6 space-y-1 border-t border-[var(--border)] pt-4 mt-4">
        {/* User */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                {user.full_name?.[0] ?? user.email[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user.full_name ?? 'User'}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-all"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen fixed left-0 top-0 bg-[var(--bg-card)] border-r border-[var(--border)] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span className="text-sm">💎</span>
          </div>
          <span className="font-display font-bold">PocketFinance</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-[var(--bg-raised)]">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="lg:hidden fixed inset-0 z-40 flex"
        >
          <div className="w-72 bg-[var(--bg-card)] h-full overflow-y-auto pt-16">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </motion.div>
      )}
    </>
  )
}
