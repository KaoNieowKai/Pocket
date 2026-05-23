'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { ChartDataPoint } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface ExpensePieChartProps {
  data: ChartDataPoint[]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-brand-400 font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-52 text-[var(--text-secondary)] text-sm">
        No expense data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs text-[var(--text-secondary)]">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
