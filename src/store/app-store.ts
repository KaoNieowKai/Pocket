import { create } from 'zustand'
import { Transaction, Wallet, Category, Budget, User } from '@/types'

interface AppState {
  user: User | null
  wallets: Wallet[]
  categories: Category[]
  transactions: Transaction[]
  budgets: Budget[]
  darkMode: boolean
  currency: string

  setUser: (user: User | null) => void
  setWallets: (wallets: Wallet[]) => void
  setCategories: (categories: Category[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setBudgets: (budgets: Budget[]) => void
  toggleDarkMode: () => void
  setCurrency: (currency: string) => void

  addTransaction: (t: Transaction) => void
  updateTransaction: (t: Transaction) => void
  deleteTransaction: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  wallets: [],
  categories: [],
  transactions: [],
  budgets: [],
  darkMode: true,
  currency: 'THB',

  setUser: (user) => set({ user }),
  setWallets: (wallets) => set({ wallets }),
  setCategories: (categories) => set({ categories }),
  setTransactions: (transactions) => set({ transactions }),
  setBudgets: (budgets) => set({ budgets }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setCurrency: (currency) => set({ currency }),

  addTransaction: (t) =>
    set((s) => ({ transactions: [t, ...s.transactions] })),
  updateTransaction: (t) =>
    set((s) => ({
      transactions: s.transactions.map((x) => (x.id === t.id ? t : x)),
    })),
  deleteTransaction: (id) =>
    set((s) => ({
      transactions: s.transactions.filter((x) => x.id !== id),
    })),
}))
