'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { Transaction, TransactionType } from '@/types'
import { useAppStore } from '@/store/app-store'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  editTransaction?: Transaction | null
}

export function TransactionForm({ isOpen, onClose, editTransaction }: TransactionFormProps) {
  const { wallets, categories, user, addTransaction, updateTransaction } = useAppStore()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [walletId, setWalletId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(false)

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  )

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type)
      setAmount(editTransaction.amount.toString())
      setCategoryId(editTransaction.category_id)
      setWalletId(editTransaction.wallet_id)
      setNote(editTransaction.note ?? '')
      setDate(editTransaction.date)
    } else {
      setType('expense')
      setAmount('')
      setCategoryId(filteredCategories[0]?.id ?? '')
      setWalletId(wallets[0]?.id ?? '')
      setNote('')
      setDate(format(new Date(), 'yyyy-MM-dd'))
    }
  }, [editTransaction, isOpen])

  const handleSubmit = async () => {
    if (!amount || !categoryId || !walletId || !user) return
    setLoading(true)

    const payload = {
      user_id: user.id,
      type,
      amount: parseFloat(amount),
      category_id: categoryId,
      wallet_id: walletId,
      note: note || null,
      date,
    }

    try {
      if (editTransaction) {
        const { data } = await supabase
          .from('transactions')
          .update(payload)
          .eq('id', editTransaction.id)
          .select('*, category:categories(*), wallet:wallets(*)')
          .single()
        if (data) updateTransaction(data as Transaction)
      } else {
        const { data } = await supabase
          .from('transactions')
          .insert(payload)
          .select('*, category:categories(*), wallet:wallets(*)')
          .single()
        if (data) addTransaction(data as Transaction)
      }
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-md bg-[var(--bg-card)] rounded-t-3xl sm:rounded-3xl border border-[var(--border)] shadow-card p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">
                {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-raised)] transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2 p-1.5 bg-[var(--bg-raised)] rounded-2xl mb-5">
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all',
                    type === t
                      ? t === 'expense'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-brand-500/20 text-brand-400'
                      : 'text-[var(--text-secondary)]'
                  )}
                >
                  {t === 'expense' ? '💸 Expense' : '💰 Income'}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-medium">฿</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] focus:border-brand-500/50 focus:outline-none text-lg font-display font-bold transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-2 rounded-xl border transition-all',
                      categoryId === cat.id
                        ? 'border-current text-brand-400 bg-brand-500/10'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-500/30'
                    )}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium leading-tight text-center line-clamp-1">{cat.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Wallet</label>
              <div className="flex gap-2 flex-wrap">
                {wallets.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWalletId(w.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all',
                      walletId === w.id
                        ? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-500/30'
                    )}
                  >
                    <span>{w.icon}</span>
                    <span>{w.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] focus:border-brand-500/50 focus:outline-none transition-all"
              />
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] focus:border-brand-500/50 focus:outline-none transition-all"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={loading || !amount || !categoryId || !walletId}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold transition-all shadow-glow-sm hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={18} />
                  {editTransaction ? 'Update' : 'Add'} Transaction
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
