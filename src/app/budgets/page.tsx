'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, AlertTriangle, Check } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAppStore } from '@/store/app-store'
import { supabase } from '@/lib/supabase'
import { Budget } from '@/types'
import { formatCurrency, getPercentage } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function BudgetsPage() {
  const { budgets, setBudgets, categories, user, transactions } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', amount: '', category_id: '', period: 'monthly' as const,
  })

  // Calculate spent per budget
  const budgetsWithSpent = budgets.map((b) => {
    const spent = transactions
      .filter((t) => {
        const inPeriod = t.date >= b.start_date && t.date <= b.end_date
        const matchCat = !b.category_id || t.category_id === b.category_id
        return t.type === 'expense' && inPeriod && matchCat
      })
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...b, spent }
  })

  const handleCreate = async () => {
    if (!form.name || !form.amount || !user) return
    setLoading(true)
    const now = new Date()
    const startDate = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')
    const endDate = format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd')

    const { data } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        name: form.name,
        amount: parseFloat(form.amount),
        category_id: form.category_id || null,
        period: form.period,
        start_date: startDate,
        end_date: endDate,
        spent: 0,
      })
      .select('*, category:categories(*)')
      .single()

    if (data) setBudgets([data as Budget, ...budgets])
    setLoading(false)
    setShowForm(false)
    setForm({ name: '', amount: '', category_id: '', period: 'monthly' })
  }

  const handleDelete = async (id: string) => {
    await supabase.from('budgets').delete().eq('id', id)
    setBudgets(budgets.filter((b) => b.id !== id))
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl">Budgets</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Set spending limits by category</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium shadow-glow-sm"
          >
            <Plus size={16} />
            New Budget
          </motion.button>
        </div>

        {/* Create form */}
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
                  <h3 className="font-semibold">Create Budget</h3>
                  <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-[var(--bg-raised)]">
                    <X size={16} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Budget Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Monthly Food Budget"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-sm focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Amount (฿)</label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="5000"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-sm focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Category (optional)</label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-sm focus:outline-none focus:border-brand-500/50"
                    >
                      <option value="">All Expenses</option>
                      {categories.filter(c => c.type !== 'income').map((c) => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Period</label>
                    <select
                      value={form.period}
                      onChange={(e) => setForm({ ...form, period: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] text-sm focus:outline-none focus:border-brand-500/50"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-all disabled:opacity-50"
                >
                  <Check size={16} />
                  Create Budget
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Budget cards */}
        {budgetsWithSpent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <p className="font-medium text-lg mb-2">No budgets yet</p>
            <p className="text-[var(--text-secondary)] text-sm">Create a budget to track your spending limits</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {budgetsWithSpent.map((b, i) => {
              const pct = getPercentage(b.spent, b.amount)
              const over = pct > 100
              const warning = pct > 80 && !over
              const cat = b.category
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    'rounded-2xl bg-[var(--bg-card)] border p-5 shadow-card',
                    over ? 'border-red-500/30' : warning ? 'border-orange-500/30' : 'border-[var(--border)]'
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${cat?.color ?? '#14b8a6'}20` }}
                      >
                        {cat?.icon ?? '🎯'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{b.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] capitalize">{b.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {over && <AlertTriangle size={16} className="text-red-400" />}
                      {warning && <AlertTriangle size={16} className="text-orange-400" />}
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">Spent</span>
                      <span className={cn(
                        'font-medium',
                        over ? 'text-red-400' : warning ? 'text-orange-400' : 'text-[var(--text-primary)]'
                      )}>
                        {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ delay: 0.3 + i * 0.07, duration: 0.7 }}
                        className="h-full rounded-full"
                        style={{
                          background: over
                            ? '#f87171'
                            : warning
                              ? '#fb923c'
                              : `linear-gradient(90deg, #14b8a6, #2dd4bf)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={cn(
                        over ? 'text-red-400 font-medium' : 'text-[var(--text-secondary)]'
                      )}>
                        {over ? `${pct - 100}% over budget!` : `${pct}% used`}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {formatCurrency(Math.max(b.amount - b.spent, 0))} left
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
