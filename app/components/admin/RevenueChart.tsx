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
    <div className="rounded-xl border border-[#E8E3D9] bg-white px-4 py-3 shadow-md text-xs">
      <p className="font-medium text-[#1C1917] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-[#9C9589]">
          {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : `${p.value} bookings`}
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart({ data }: { data: MonthData[] }) {
  return (
    <div className="bg-white border border-[#E8E3D9] rounded-xl px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] tracking-widest text-[#9C9589] uppercase mb-0.5">ANALYTICS · 6 MONTHS</p>
          <h2 className="font-serif text-xl text-[#1C1917]">Revenue &amp; bookings</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#9C9589]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#B89A4E] inline-block" />Revenue</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#E8E3D9] inline-block" />Bookings</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#F5F0E8" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9C9589', fontFamily: 'DM Sans, sans-serif' }}
          />
          <YAxis
            yAxisId="revenue"
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9C9589', fontFamily: 'DM Sans, sans-serif' }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="bookings"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9C9589', fontFamily: 'DM Sans, sans-serif' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FAFAF8' }} />
          <Bar yAxisId="revenue" dataKey="revenue" fill="#B89A4E" radius={[4, 4, 0, 0]} name="revenue" />
          <Bar yAxisId="bookings" dataKey="bookings" fill="#E8E3D9" radius={[4, 4, 0, 0]} name="bookings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
