import React from 'react'
import { Zap, Waves, Radio } from 'lucide-react'

export function WavePowerGauge({ waveHeight, wavePower, supplyPower }) {
  const pct = Math.min((waveHeight / 4) * 100, 100)
  const efficiency = ((supplyPower / wavePower) * 100).toFixed(0)

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="section-label">파력 발전 현황</span>
        <span className="badge badge-teal text-xs">{efficiency}% 효율</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: '파고', value: waveHeight, unit: 'm', color: '#60a5fa', Icon: Waves },
          { label: '발전량', value: wavePower, unit: 'kW', color: '#00d4aa', Icon: Zap },
          { label: '경비대 공급', value: supplyPower, unit: 'kW', color: '#a78bfa', Icon: Radio },
        ].map(({ label, value, unit, color, Icon }) => (
          <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Icon size={14} style={{ color, margin: '0 auto 4px' }} />
            <div className="font-mono font-bold text-lg leading-none" style={{ color }}>{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label} ({unit})</div>
          </div>
        ))}
      </div>

      {/* 게이지 바 */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>파고 게이지</span>
          <span className="font-mono">{waveHeight}m / 4m</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #60a5fa, #00d4aa)',
              boxShadow: '0 0 10px rgba(0,212,170,0.5)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-700 mt-1 font-mono">
          {['0', '1', '2', '3', '4m'].map(v => <span key={v}>{v}</span>)}
        </div>
      </div>
    </div>
  )
}
