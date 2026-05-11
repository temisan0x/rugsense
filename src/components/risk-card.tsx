'use client'

import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'
import { riskConfig, ScanResult } from '../lib/types';

const icons = {
  SAFE:   <ShieldCheck size={22} />,
  WATCH:  <AlertTriangle size={22} />,
  DANGER: <ShieldAlert size={22} />,
}

const labels = {
  SAFE:   'No major threats detected.',
  WATCH:  'Proceed with caution.',
  DANGER: 'High risk detected.',
}

export function RiskCard({ result }: { result: ScanResult }) {
  const { risk, overview, meta } = result
  const cfg = riskConfig[risk.label]

  return (
    <div
      className="col-span-1 sm:col-span-2 rounded-2xl p-6 border flex flex-col gap-5"
      style={{ background: cfg.dimColor, borderColor: cfg.borderColor }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#FAFAF5]">
            {overview?.name || 'Unknown Token'}
          </h2>
          <p className="text-sm font-mono text-[#666660] mt-0.5">
            ${overview?.symbol || '???'}
          </p>
        </div>

        <div
          className="flex flex-col items-center justify-center gap-1 px-5 py-3 rounded-xl border min-w-[120px]"
          style={{ background: cfg.dimColor, borderColor: cfg.borderColor, color: cfg.color }}
        >
          {icons[risk.label]}
          <span className="text-lg font-extrabold tracking-widest">{risk.label}</span>
          <span className="text-[10px] text-center opacity-70">{labels[risk.label]}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-4 text-[12px] font-mono text-[#666660]">
        <span>CONFIDENCE <span className="text-[#00FF85]">{risk.confidence}%</span></span>
        <span>·</span>
        <span>{meta?.holdersAnalyzed ?? 0} holders analyzed</span>
        <span>·</span>
        <span>age: {meta?.ageMinutes ? `${meta.ageMinutes}m` : 'Unknown'}</span>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex justify-between text-[11px] font-mono text-[#666660] mb-2">
          <span>RISK SCORE</span>
          <span>{risk.score} / 100</span>
        </div>
        <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${risk.score}%`, background: cfg.color }}
          />
        </div>
      </div>

      {/* Risk signals */}
      <div>
        <p className="text-[11px] font-mono text-[#666660] mb-2 tracking-widest">RISK SIGNALS</p>
        {risk.reasons.length === 0 ? (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-mono"
            style={{ borderColor: cfg.borderColor, color: cfg.color, background: cfg.dimColor }}
          >
            <ShieldCheck size={14} />
            No major warning signals detected
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {risk.reasons.map((r, i) => (
              <li
                key={i}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-mono"
                style={{ borderColor: cfg.borderColor, color: cfg.color, background: cfg.dimColor }}
              >
                <AlertTriangle size={13} />
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}