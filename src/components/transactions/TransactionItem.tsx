'use client'

import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TransactionItemProps {
  transaction: Transaction
  onEdit?: (t: Transaction) => void
  onDelete?: (id: string) => void
  index?: number
}

export function TransactionItem({ transaction, onEdit, onDelete, index = 0 }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'
  const category = transaction.category
  const wallet = transaction.wallet

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--bg-raised)] transition-all duration-150 group"
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${category?.color ?? '#6b7280'}20` }}
      >
        {category?.icon ?? '📦'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{transaction.note || category?.name || 'Transaction'}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--text-secondary)]">{formatDate(transaction.date, 'dd MMM')}</span>
          {wallet && (
            <>
              <span className="text-[var(--border)]">·</span>
              <span className="text-xs text-[var(--text-secondary)]">{wallet.name}</span>
            </>
          )}
          {category && (
            <>
              <span className="text-[var(--border)]">·</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-md"
                style={{
                  color: category.color,
                  backgroundColor: `${category.color}15`
                }}
              >
                {category.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2">
        <p className={cn(
          'font-display font-bold text-sm font-num',
          isIncome ? 'text-income' : 'text-expense'
        )}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>

        {/* Actions */}
        <div className="hidden group-hover:flex items-center gap-1 ml-2">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-[var(--text-secondary)] hover:text-blue-400 transition-all"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-all"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
