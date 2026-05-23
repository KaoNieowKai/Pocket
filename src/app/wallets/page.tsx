'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Check, Pencil } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAppStore } from '@/store/app-store'
import { supabase } from '@/lib/supabase'
import { Wallet } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const WALLET_TYPES = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'bank', label: 'Bank Account', icon: '🏦' },
  { value: 'ewallet', label: 'E-Wallet', icon: '📱' },
]

const COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316', '#6366f1']

export default function WalletsPage() {
  const { wallets, setWallets, user } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [editWallet, setEditWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'cash', balance: '', color: '#14b8a6', icon: '💵',
  })

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0)

  const openCreate = () => {
    setEditWallet(null)
    setForm({ name: '', type: 'cash', balance: '', color: '#14b8a6', icon: '💵' })
    setShowForm(true)
  }

  const openEdit = (w: Wallet) => {
    setEditWallet(w)
    setForm({ name: w.name, type: w.type, balance: w.balance.toString(), color: w.color, icon: w.icon })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !user) return
    setLoading(true)
    const payload = {
      user_id: user.id,
      name: form.name,
      type: form.type as Wallet['type'],
      balance: parseFloat(form.balance || '0'),
      color: form.color,
      icon: form.icon,
    }
    if (editWallet) {
      const { data } = await supabase.from('wallets').update(payload).eq('id', editWallet.id).select().single()
      if (data) setWallets(wallets.map((w) => w.id === editWallet.id ? data as Wallet : w))
    } else {
      const { data } = await supabase.from('wallets').insert(payload).select().single()
      if (data) setWallets([...wallets, data as Wallet])
    }
    setLoading(false)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wallet?')) return
    await supabase.from('wallets').delete().eq('id', id)
    setWallets(wallets.filter((w) => w.id !== id))
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl">Wallets</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your accounts and balances</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium shadow-glow-sm"
          >
            <Plus size={16} />
            Add Wallet
          </motion.button>
        </div>

        {/* Total balance card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #134e4a 100%)'
          }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'
            }}
          />
          <p className="text-teal-200 text-sm font-medium mb-2 relative">Total Balance</p>
          <p className="font-display font-black text-4xl text-white relative font-num">{formatCurrency(totalBalance)}</p>
          <p className="text-teal-200 text-sm mt-2 relative">{wallets.length} wallet{wallets.length !== 1 ? 's' : ''}</p>
        </motion.div>

        {/* Wallet form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl bg-[var(--bg-card)] border border-brand-500/20 p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{editWallet ? 'Edit Wallet' : 'Add Wallet'}</h3>
                  <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-[var(--bg-raised)]"><X size={16} /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Wallet Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="My Wallet" className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-sm focus:outline-none focus:border-brand-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Balance (฿)</label>
                    <input type="number" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })}
                      placeholder="0" className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-sm focus:outline-none focus:border-brand-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-2">Type</label>
                    <div className="flex gap-2">
                      {WALLET_TYPES.map((t) => (
                        <button key={t.value} onClick={() => setForm({ ...form, type: t.value, icon: t.icon })}
                          className={cn('flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs transition-all',
                            form.type === t.value ? 'border-brand-500/50 bg-brand-500/10 text-brand-400' : 'border-[var(--border)] text-[var(--text-secondary)]'
                          )}>
                          <span className="text-lg">{t.icon}</span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map((c) => (
                        <button key={c} onClick={() => setForm({ ...form, color: c })}
                          className={cn('w-7 h-7 rounded-lg transition-all', form.color === c && 'ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-card)]')}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={handleSave} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                  <Check size={16} />
                  {editWallet ? 'Update' : 'Create'} Wallet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card hover:border-brand-500/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${w.color}20` }}>
                  {w.icon}
                </div>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-[var(--text-secondary)] hover:text-blue-400 transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(w.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-all">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <p className="font-semibold mb-0.5">{w.name}</p>
              <p className="text-xs text-[var(--text-secondary)] capitalize mb-3">{w.type}</p>
              <p className="font-display font-bold text-xl font-num" style={{ color: w.color }}>
                {formatCurrency(w.balance)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
