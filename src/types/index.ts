// Database types
export type TransactionType = 'income' | 'expense'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  currency: string
  created_at: string
}

export interface Wallet {
  id: string
  user_id: string
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
  color: string
  icon: string
  created_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  icon: string
  color: string
  type: TransactionType | 'both'
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  wallet_id: string
  category_id: string
  type: TransactionType
  amount: number
  note?: string
  date: string
  created_at: string
  // joined
  wallet?: Wallet
  category?: Category
}

export interface Budget {
  id: string
  user_id: string
  category_id: string | null
  name: string
  amount: number
  spent: number
  period: 'monthly' | 'weekly' | 'yearly'
  start_date: string
  end_date: string
  created_at: string
  // joined
  category?: Category
}

export interface RecurringTransaction {
  id: string
  user_id: string
  wallet_id: string
  category_id: string
  type: TransactionType
  amount: number
  note?: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  next_date: string
  active: boolean
  created_at: string
  // joined
  wallet?: Wallet
  category?: Category
}

// UI types
export interface DashboardStats {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  remaining: number
  changePercent: number
}

export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface MonthlyChartPoint {
  month: string
  income: number
  expenses: number
}
