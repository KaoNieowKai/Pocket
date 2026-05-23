'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  amount: number
  icon: LucideIcon
  iconColor: string
  iconBg: string
  change?: number
  currency?: string
  index?: number
}

export function StatCard({
  title, amount, icon: Icon, iconColor, iconBg,
  change, currency = 'THB', index = 0
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
            isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <motion.p
        className="font-display font-bold text-2xl font-num"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.08 + 0.2 }}
      >
        {formatCurrency(amount, currency)}
      </motion.p>
    </motion.div>
  )
}
