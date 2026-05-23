'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Bell, Globe, Download, Trash2, LogOut } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAppStore } from '@/store/app-store'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import * as XLSX from 'xlsx'

const CURRENCIES = ['THB', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR']

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, user, currency, setCurrency, transactions } = useAppStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const exportAll = () => {
    const data = transactions.map((t) => ({
      Date: t.date,
      Type: t.type,
      Category: t.category?.name ?? '',
      Note: t.note ?? '',
      Amount: t.type === 'expense' ? -t.amount : t.amount,
      Wallet: t.wallet?.name ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'All Transactions')
    XLSX.writeFile(wb, 'pocketfinance-export.xlsx')
  }

  const saveCurrency = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('users').update({ currency }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const settings = [
    {
      section: 'Appearance',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: 'Dark Mode',
          desc: 'Toggle between light and dark theme',
          control: (
            <button
              onClick={toggleDarkMode}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors duration-200',
                darkMode ? 'bg-brand-500' : 'bg-[var(--border)]'
              )}
            >
              <div className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
                darkMode ? 'left-6' : 'left-1'
              )} />
            </button>
          ),
        },
      ],
    },
    {
      section: 'Preferences',
      items: [
        {
          icon: Globe,
          label: 'Currency',
          desc: 'Default currency for display',
          control: (
            <div className="flex items-center gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] text-sm focus:outline-none focus:border-brand-500/50"
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={saveCurrency} disabled={saving}
                className="px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-400 text-sm font-medium hover:bg-brand-500/30 transition-all disabled:opacity-50">
                {saved ? '✓ Saved' : saving ? '...' : 'Save'}
              </button>
            </div>
          ),
        },
      ],
    },
    {
      section: 'Data',
      items: [
        {
          icon: Download,
          label: 'Export All Data',
          desc: 'Download all transactions as Excel',
          control: (
            <button onClick={exportAll}
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all flex items-center gap-1.5">
              <Download size={14} />
              Export
            </button>
          ),
        },
      ],
    },
    {
      section: 'Account',
      items: [
        {
          icon: LogOut,
          label: 'Sign Out',
          desc: 'Sign out of your account',
          control: (
            <button onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all flex items-center gap-1.5">
              <LogOut size={14} />
              Sign Out
            </button>
          ),
        },
      ],
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-2xl">Settings</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your preferences</p>
        </motion.div>

        {/* Profile card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card mb-6 flex items-center gap-4"
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-14 h-14 rounded-2xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xl">
                {user.full_name?.[0] ?? user.email[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">{user.full_name ?? 'User'}</p>
              <p className="text-[var(--text-secondary)] text-sm">{user.email}</p>
              <p className="text-xs text-brand-400 mt-0.5">Free Account</p>
            </div>
          </motion.div>
        )}

        {/* Settings sections */}
        <div className="space-y-4">
          {settings.map((section, si) => (
            <motion.div
              key={section.section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + si * 0.08 }}
            >
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 px-1">
                {section.section}
              </p>
              <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-card overflow-hidden">
                {section.items.map((item, ii) => (
                  <div key={item.label}
                    className={cn('flex items-center gap-4 px-5 py-4', ii > 0 && 'border-t border-[var(--border)]')}>
                    <div className="w-9 h-9 rounded-xl bg-[var(--bg-raised)] flex items-center justify-center">
                      <item.icon size={18} className="text-[var(--text-secondary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-[var(--text-secondary)] text-xs">{item.desc}</p>
                    </div>
                    {item.control}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-8">
          PocketFinance v1.0.0 — Made with 💎
        </p>
      </div>
    </AppLayout>
  )
}
