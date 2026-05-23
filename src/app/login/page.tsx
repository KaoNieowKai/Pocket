'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { TrendingUp, Shield, Zap, PieChart } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  const features = [
    { icon: TrendingUp, title: 'Smart Analytics', desc: 'Visualize spending patterns' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data, always protected' },
    { icon: Zap, title: 'Instant Insights', desc: 'Real-time financial overview' },
    { icon: PieChart, title: 'Budget Control', desc: 'Set and track budgets' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-purple-500/8 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full bg-blue-500/8 blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hidden lg:block"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow-sm">
              <span className="text-xl">💎</span>
            </div>
            <span className="font-display font-bold text-2xl">PocketFinance</span>
          </div>

          <h1 className="font-display font-black text-5xl leading-tight mb-6">
            Take control of your{' '}
            <span className="gradient-text">financial life</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-12 leading-relaxed">
            Track income and expenses, set budgets, and gain insights into your spending habits with beautiful visualizations.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-4"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center mb-3">
                  <f.icon size={18} className="text-brand-400" />
                </div>
                <p className="font-semibold text-sm mb-1">{f.title}</p>
                <p className="text-[var(--text-secondary)] text-xs">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="glass rounded-3xl p-8 shadow-card max-w-md mx-auto">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-lg">💎</span>
              </div>
              <span className="font-display font-bold text-xl">PocketFinance</span>
            </div>

            <h2 className="font-display font-bold text-3xl mb-2">Welcome back</h2>
            <p className="text-[var(--text-secondary)] mb-8">Sign in to your account to continue</p>

            {/* Google sign in */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)] hover:bg-[var(--bg-card)] transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] px-3">
                or
              </div>
            </div>

            {/* Email demo hint */}
            <div className="rounded-2xl bg-brand-500/10 border border-brand-500/20 p-4 text-sm">
              <p className="text-brand-400 font-medium mb-1">🚀 Getting started</p>
              <p className="text-[var(--text-secondary)]">
                Sign in with Google to create your account and start tracking your finances instantly.
              </p>
            </div>

            <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
              By signing in, you agree to our{' '}
              <a href="#" className="text-brand-400 hover:underline">Terms</a> and{' '}
              <a href="#" className="text-brand-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
