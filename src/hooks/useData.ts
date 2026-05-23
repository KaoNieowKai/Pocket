import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store/app-store'
import { Transaction, Wallet, Category, Budget } from '@/types'

export function useInitData() {
  const { setUser, setWallets, setCategories, setTransactions, setBudgets } = useAppStore()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profile) setUser(profile)

      // Load wallets
      const { data: wallets } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at')
      if (wallets) setWallets(wallets as Wallet[])

      // Load categories
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${user.id},is_default.eq.true`)
        .order('name')
      if (categories) setCategories(categories as Category[])

      // Load transactions (last 100)
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*, category:categories(*), wallet:wallets(*)')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(200)
      if (transactions) setTransactions(transactions as Transaction[])

      // Load budgets
      const { data: budgets } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (budgets) setBudgets(budgets as Budget[])
    }

    init()
  }, [])
}

export function useDashboardStats() {
  const { transactions, wallets } = useAppStore()

  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  const monthlyTxns = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === month && d.getFullYear() === year
  })

  const monthlyIncome = monthlyTxns
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = monthlyTxns
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    remaining: monthlyIncome - monthlyExpenses,
    recentTransactions: transactions.slice(0, 5),
  }
}

export function useExpenseByCategory() {
  const { transactions, categories } = useAppStore()

  const now = new Date()
  const monthlyExpenses = transactions.filter((t) => {
    const d = new Date(t.date)
    return (
      t.type === 'expense' &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  })

  const byCategory: Record<string, number> = {}
  monthlyExpenses.forEach((t) => {
    const catId = t.category_id
    byCategory[catId] = (byCategory[catId] ?? 0) + t.amount
  })

  return Object.entries(byCategory).map(([catId, value]) => {
    const cat = categories.find((c) => c.id === catId)
    return {
      name: cat?.name ?? 'Other',
      value,
      color: cat?.color ?? '#6b7280',
    }
  }).sort((a, b) => b.value - a.value)
}

export function useMonthlyChart() {
  const { transactions } = useAppStore()

  const months: Record<string, { income: number; expenses: number }> = {}

  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleDateString('en-US', { month: 'short' })
    months[key] = { income: 0, expenses: 0 }
  }

  transactions.forEach((t) => {
    const d = new Date(t.date)
    const key = d.toLocaleDateString('en-US', { month: 'short' })
    if (months[key]) {
      if (t.type === 'income') months[key].income += t.amount
      else months[key].expenses += t.amount
    }
  })

  return Object.entries(months).map(([month, data]) => ({
    month,
    ...data,
  }))
}
