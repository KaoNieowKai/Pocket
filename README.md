# 💎 PocketFinance

A modern, full-stack personal finance tracker built with Next.js, Supabase, and Recharts.

![PocketFinance](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-2.0-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- 🔐 **Google Authentication** via Supabase Auth
- 📊 **Beautiful Dashboard** with animated stat cards, pie charts, bar charts
- 💸 **Transaction Management** — Add, edit, delete income/expense with categories
- 🎯 **Budget System** — Set monthly budgets with visual progress bars & warnings
- 👛 **Multi-Wallet** — Cash, bank accounts, e-wallets
- 📈 **Analytics** — Daily spending trends, category breakdowns
- 🌙 **Dark/Light Mode** — Fintech-grade dark UI by default
- 📤 **Export** — Download transactions as Excel (XLSX)
- 📱 **Fully Responsive** — Mobile-first design

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication → Providers** and enable **Google**
   - Add your OAuth credentials from Google Cloud Console
   - Set redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

### 3. Configure environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard
│   ├── transactions/       # Transaction history & management
│   ├── analytics/          # Spending analytics
│   ├── budgets/            # Budget tracking
│   ├── wallets/            # Wallet management
│   ├── settings/           # User settings
│   ├── login/              # Authentication page
│   └── auth/callback/      # OAuth callback handler
├── components/
│   ├── layout/             # Sidebar, AppLayout
│   ├── dashboard/          # StatCard
│   ├── transactions/       # TransactionItem, TransactionForm
│   ├── charts/             # ExpensePieChart, MonthlyBarChart
│   └── ui/                 # Reusable Card component
├── hooks/
│   └── useData.ts          # Data fetching & computation hooks
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Utilities, formatters, constants
├── store/
│   └── app-store.ts        # Zustand global state
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Auth + PostgreSQL database |
| Framer Motion | Animations |
| Recharts | Charts & visualizations |
| Zustand | Global state management |
| SheetJS (xlsx) | Excel export |
| date-fns | Date manipulation |

## 🗃️ Database Schema

- **users** — Extended user profiles
- **wallets** — Cash/bank/ewallet accounts
- **categories** — Default + custom transaction categories
- **transactions** — Income and expense records
- **budgets** — Spending limit tracking
- **recurring_transactions** — Auto-recurring entries

## 🔧 Customization

- Add new categories in `src/lib/utils.ts` → `DEFAULT_CATEGORIES`
- Change default currency in Settings or via Supabase
- Extend the schema for additional features

## 📦 Build for Production

```bash
npm run build
npm start
```

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

Made with 💎 by PocketFinance
