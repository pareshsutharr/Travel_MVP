'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type MonthData = { month: string; bookings: number; revenue: number }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-pale-sky bg-platinum px-4 py-3 shadow-md text-xs">
      <p className="font-medium text-graphite mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-blue-slate">
          {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : `${p.value} bookings`}
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart({ data }: { data: MonthData[] }) {
  return (
    <div className="bg-platinum border border-pale-sky rounded-xl px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] tracking-widest text-blue-slate uppercase mb-0.5">ANALYTICS · 6 MONTHS</p>
          <h2 className="font-serif text-xl text-graphite">Revenue &amp; bookings</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-blue-slate">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-metallic-gold inline-block" />Revenue</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-pale-sky inline-block" />Bookings</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#BFDDE7" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#3C687C', fontFamily: 'DM Sans, sans-serif' }}
          />
          <YAxis
            yAxisId="revenue"
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#3C687C', fontFamily: 'DM Sans, sans-serif' }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="bookings"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#3C687C', fontFamily: 'DM Sans, sans-serif' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F7F8' }} />
          <Bar yAxisId="revenue" dataKey="revenue" fill="#D4AF35" radius={[4, 4, 0, 0]} name="revenue" />
          <Bar yAxisId="bookings" dataKey="bookings" fill="#BFDDE7" radius={[4, 4, 0, 0]} name="bookings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
