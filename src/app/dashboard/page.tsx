'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { ExpensePieChart } from '@/components/charts/ExpensePieChart'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import {
  useInitData,
  useDashboardStats,
  useExpenseByCategory,
  useMonthlyChart
} from '@/hooks/useData'
import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'
import { Transaction } from '@/types'

export default function DashboardPage() {
  useInitData()

  const { wallets } = useAppStore()
  const stats = useDashboardStats()
  const expenseData = useExpenseByCategory()
  const monthlyData = useMonthlyChart()
  const [formOpen, setFormOpen] = useState(false)
  const [editTxn, setEditTxn] = useState<Transaction | null>(null)

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-[var(--text-secondary)] text-sm mb-1">{greeting} 👋</p>
            <h1 className="font-display font-bold text-2xl">Dashboard</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditTxn(null); setFormOpen(true) }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium shadow-glow-sm hover:shadow-glow transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
          </motion.button>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Balance"
            amount={stats.totalBalance}
            icon={Wallet}
            iconColor="text-brand-400"
            iconBg="bg-brand-500/15"
            index={0}
          />
          <StatCard
            title="Monthly Income"
            amount={stats.monthlyIncome}
            icon={TrendingUp}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/15"
            index={1}
          />
          <StatCard
            title="Monthly Expenses"
            amount={stats.monthlyExpenses}
            icon={TrendingDown}
            iconColor="text-red-400"
            iconBg="bg-red-500/15"
            index={2}
          />
          <StatCard
            title="Remaining"
            amount={stats.remaining}
            icon={DollarSign}
            iconColor={stats.remaining >= 0 ? "text-blue-400" : "text-orange-400"}
            iconBg={stats.remaining >= 0 ? "bg-blue-500/15" : "bg-orange-500/15"}
            index={3}
          />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          {/* Monthly bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Monthly Overview</h3>
              <span className="text-xs text-[var(--text-secondary)]">Last 6 months</span>
            </div>
            <MonthlyBarChart data={monthlyData} />
          </motion.div>

          {/* Expense pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Expense Categories</h3>
              <span className="text-xs text-[var(--text-secondary)]">This month</span>
            </div>
            <ExpensePieChart data={expenseData} />
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Recent transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="lg:col-span-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="font-semibold text-sm">Recent Transactions</h3>
              <a href="/transactions" className="text-xs text-brand-400 hover:underline">View all</a>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {stats.recentTransactions.length === 0 ? (
                <div className="px-5 py-10 text-center text-[var(--text-secondary)] text-sm">
                  No transactions yet. Add your first one!
                </div>
              ) : (
                stats.recentTransactions.map((t, i) => (
                  <TransactionItem
                    key={t.id}
                    transaction={t}
                    onEdit={(tx) => { setEditTxn(tx); setFormOpen(true) }}
                    index={i}
                  />
                ))
              )}
            </div>
          </motion.div>

          {/* Wallets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">My Wallets</h3>
              <a href="/wallets" className="text-xs text-brand-400 hover:underline">Manage</a>
            </div>
            <div className="space-y-3">
              {wallets.length === 0 ? (
                <p className="text-[var(--text-secondary)] text-sm text-center py-6">No wallets yet</p>
              ) : (
                wallets.map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-raised)]"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${w.color}25` }}
                    >
                      {w.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{w.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] capitalize">{w.type}</p>
                    </div>
                    <p className="font-display font-bold text-sm font-num">{formatCurrency(w.balance)}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <TransactionForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTxn(null) }}
        editTransaction={editTxn}
      />
    </AppLayout>
  )
}
