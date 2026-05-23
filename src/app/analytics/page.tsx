'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import { AppLayout } from '@/components/layout/AppLayout'
import { ExpensePieChart } from '@/components/charts/ExpensePieChart'
import { useAppStore } from '@/store/app-store'
import { formatCurrency, shortenNumber } from '@/lib/utils'
import { format, parseISO, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns'

export default function AnalyticsPage() {
  const { transactions, categories } = useAppStore()

  const now = new Date()

  // Daily spending this month
  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({
      start: startOfMonth(now),
      end: endOfMonth(now),
    })
    return days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayTxns = transactions.filter((t) => t.date === dayStr)
      return {
        day: format(day, 'd'),
        expenses: dayTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        income: dayTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      }
    })
  }, [transactions])

  // Category breakdown
  const catData = useMemo(() => {
    const monthTxns = transactions.filter((t) => {
      const d = new Date(t.date)
      return t.type === 'expense' && d.getMonth() === now.getMonth()
    })
    const byCategory: Record<string, number> = {}
    monthTxns.forEach((t) => {
      byCategory[t.category_id] = (byCategory[t.category_id] ?? 0) + t.amount
    })
    return Object.entries(byCategory)
      .map(([catId, value]) => {
        const cat = categories.find((c) => c.id === catId)
        return { name: cat?.name ?? 'Other', value, color: cat?.color ?? '#6b7280', icon: cat?.icon ?? '📦' }
      })
      .sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  const totalExpenses = catData.reduce((s, c) => s + c.value, 0)

  // Avg daily spending
  const avgDaily = totalExpenses / now.getDate()

  // Top category
  const topCat = catData[0]

  const stats = [
    { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: '💸', color: 'text-red-400' },
    { label: 'Avg Daily Spend', value: formatCurrency(avgDaily), icon: '📅', color: 'text-orange-400' },
    { label: 'Top Category', value: topCat?.name ?? 'N/A', icon: topCat?.icon ?? '📦', color: 'text-purple-400' },
    { label: 'Transactions', value: String(transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth()
    }).length), icon: '📊', color: 'text-blue-400' },
  ]

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-2xl mb-1">Analytics</h1>
          <p className="text-[var(--text-secondary)] text-sm">{format(now, 'MMMM yyyy')} spending overview</p>
        </motion.div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-4 shadow-card"
            >
              <span className="text-2xl mb-3 block">{s.icon}</span>
              <p className="text-[var(--text-secondary)] text-xs mb-1">{s.label}</p>
              <p className={`font-display font-bold text-lg font-num ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Daily spending chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card mb-6"
        >
          <h3 className="font-semibold text-sm mb-4">Daily Spending — {format(now, 'MMMM yyyy')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="incGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => shortenNumber(v)} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="income" stroke="#2dd4bf" strokeWidth={2} fill="url(#incGradient)" />
              <Area type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} fill="url(#expGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category breakdown */}
        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card"
          >
            <h3 className="font-semibold text-sm mb-4">Spending by Category</h3>
            <ExpensePieChart data={catData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card"
          >
            <h3 className="font-semibold text-sm mb-4">Top Spending Categories</h3>
            <div className="space-y-3">
              {catData.slice(0, 6).map((c, i) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{c.icon}</span>
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-secondary)] text-xs">
                        {totalExpenses > 0 ? Math.round(c.value / totalExpenses * 100) : 0}%
                      </span>
                      <span className="font-display font-bold text-sm font-num">{formatCurrency(c.value)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${totalExpenses > 0 ? (c.value / totalExpenses) * 100 : 0}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
