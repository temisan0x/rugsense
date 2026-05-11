'use client'

import { ReactNode } from 'react'

type StatCardProps = {
  icon: ReactNode
  iconColor: string
  label: string
  value: string
  subLabel: string
}

export function StatCard({ icon, iconColor, label, value, subLabel }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex flex-col gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${iconColor}18`, color: iconColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-mono tracking-widest text-[#666660] mb-1">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight text-[#FAFAF5]">{value}</p>
        <p className="text-[11px] text-[#44443E] mt-0.5">{subLabel}</p>
      </div>
    </div>
  )
}