'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Download } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useAppStore } from '@/store/app-store'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types'
import { cn, formatDate } from '@/lib/utils'
import * as XLSX from 'xlsx'

export default function TransactionsPage() {
  const { transactions, categories, deleteTransaction } = useAppStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editTxn, setEditTxn] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = typeFilter === 'all' || t.type === typeFilter
      const matchSearch = !search || (t.note ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (t.category?.name ?? '').toLowerCase().includes(search.toLowerCase())
      const matchCat = !categoryFilter || t.category_id === categoryFilter
      return matchType && matchSearch && matchCat
    })
  }, [transactions, typeFilter, search, categoryFilter])

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}
    filtered.forEach((t) => {
      const key = t.date
      if (!groups[key]) groups[key] = []
      groups[key].push(t)
    })
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return
    await supabase.from('transactions').delete().eq('id', id)
    deleteTransaction(id)
  }

  const exportExcel = () => {
    const data = filtered.map((t) => ({
      Date: t.date,
      Type: t.type,
      Category: t.category?.name ?? '',
      Note: t.note ?? '',
      Amount: t.type === 'expense' ? -t.amount : t.amount,
      Wallet: t.wallet?.name ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')
    XLSX.writeFile(wb, 'transactions.xlsx')
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl">Transactions</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-brand-500/30 transition-all"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditTxn(null); setFormOpen(true) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium shadow-glow-sm"
            >
              <Plus size={16} />
              Add
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] focus:border-brand-500/50 focus:outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all',
                  typeFilter === t
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border)]'
                )}
              >
                {t}
              </button>
            ))}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] focus:outline-none focus:border-brand-500/50"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction list */}
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="font-medium text-lg mb-2">No transactions found</p>
            <p className="text-[var(--text-secondary)] text-sm mb-6">Start by adding your first income or expense</p>
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(([date, txns]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 px-1">
                  {formatDate(date, 'EEEE, dd MMM yyyy')}
                  <span className="ml-2 text-[var(--text-secondary)] font-normal normal-case tracking-normal">
                    {txns.length} transaction{txns.length > 1 ? 's' : ''}
                  </span>
                </p>
                <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
                  {txns.map((t, i) => (
                    <TransactionItem
                      key={t.id}
                      transaction={t}
                      onEdit={(tx) => { setEditTxn(tx); setFormOpen(true) }}
                      onDelete={handleDelete}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTxn(null) }}
        editTransaction={editTxn}
      />
    </AppLayout>
  )
}
