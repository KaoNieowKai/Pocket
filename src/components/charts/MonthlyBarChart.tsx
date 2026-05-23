'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { MonthlyChartPoint } from '@/types'
import { formatCurrency, shortenNumber } from '@/lib/utils'

interface MonthlyBarChartProps {
  data: MonthlyChartPoint[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 text-sm space-y-1">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-[var(--text-secondary)] capitalize">{p.dataKey}:</span>
            <span className="font-medium">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-52 text-[var(--text-secondary)] text-sm">
        No monthly data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4} barSize={16}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => shortenNumber(v)}
          tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs capitalize text-[var(--text-secondary)]">{value}</span>
          )}
        />
        <Bar dataKey="income" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
        <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
