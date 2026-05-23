import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string, fmt = 'dd MMM yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string): string {
  return formatDate(dateStr, 'dd MMM')
}

export function getMonthYear(dateStr: string): string {
  return formatDate(dateStr, 'MMM yyyy')
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  }
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export function shortenNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export const CATEGORY_ICONS: Record<string, string> = {
  food: '🍔',
  travel: '✈️',
  shopping: '🛍️',
  bills: '📋',
  salary: '💰',
  entertainment: '🎬',
  health: '🏥',
  education: '📚',
  sport: '⚽',
  gift: '🎁',
  investment: '📈',
  other: '📦',
}

export const WALLET_ICONS: Record<string, string> = {
  cash: '💵',
  bank: '🏦',
  ewallet: '📱',
}

export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#f59e0b', type: 'expense' },
  { name: 'Travel', icon: '✈️', color: '#3b82f6', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
  { name: 'Bills & Utilities', icon: '📋', color: '#6366f1', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense' },
  { name: 'Health', icon: '🏥', color: '#10b981', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#0ea5e9', type: 'expense' },
  { name: 'Other', icon: '📦', color: '#6b7280', type: 'expense' },
  { name: 'Salary', icon: '💰', color: '#14b8a6', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#22c55e', type: 'income' },
  { name: 'Investment', icon: '📈', color: '#f97316', type: 'income' },
  { name: 'Gift', icon: '🎁', color: '#a855f7', type: 'income' },
]
