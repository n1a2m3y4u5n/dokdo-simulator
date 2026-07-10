import React from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { Thermometer, Eye, Gauge, Navigation } from 'lucide-react'

const DIR_DEG = { N:0, NE:45, E:90, SE:135, S:180, SW:225, W:270, NW:315 }

function Sparkline({ data, color, id }) {
  return (
    <ResponsiveContainer width="100%" height={34}>
      <AreaChart data={data} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
          fill={`url(#sg-${id})`} dot={false} isAnimationActive={false} />
        <Tooltip
          contentStyle={{ background: 'rgba(3,13,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
          itemStyle={{ color }} formatter={v => [v, '']} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function SensorCard({ label, value, unit, color, history, Icon, id, extra }) {
  return (
    <div className="rounded-xl p-3 glass-hover"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: color + '18' }}>
            <Icon size={11} style={{ color }} />
          </div>
          <span className="section-label">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono font-bold text-lg leading-none" style={{ color }}>{value}</span>
          <span className="text-slate-500 text-xs">{unit}</span>
          {extra}
        </div>
      </div>
      <Sparkline data={history} color={color} id={id} />
    </div>
  )
}

/* 나침반 컴포넌트 */
function Compass({ dir }) {
  const deg = DIR_DEG[dir] ?? 0
  return (
    <div className="relative w-5 h-5 ml-1" title={`유향: ${dir}`}>
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <circle cx="10" cy="10" r="9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line
          x1="10" y1="10"
          x2={10 + 7 * Math.sin(deg * Math.PI / 180)}
          y2={10 - 7 * Math.cos(deg * Math.PI / 180)}
          stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="1.5" fill="#60a5fa" />
      </svg>
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-blue-400 font-mono"
        style={{ fontSize: 9 }}>{dir}</span>
    </div>
  )
}

export function SensorPanel({ data }) {
  return (
    <div className="glass rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="section-label">실시간 환경 센서</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">3s</span>
        </div>
      </div>
      <SensorCard label="수온"    value={data.temp}            unit="°C"   color="#60a5fa" Icon={Thermometer} history={data.tempHistory}    id="temp" />
      <SensorCard label="탁도"    value={data.turbidity}       unit="NTU"  color="#00d4aa" Icon={Eye}         history={data.turbHistory}    id="turb" />
      <SensorCard label="수압"    value={(8 * 0.1).toFixed(1)} unit="dbar" color="#a78bfa" Icon={Gauge}       history={data.waveHistory}    id="pres" />
      <SensorCard
        label="유속"
        value={data.currentVelocity}
        unit="cm/s"
        color="#fb923c"
        Icon={Navigation}
        history={data.currentHistory}
        id="curr"
        extra={<Compass dir={data.currentDir} />}
      />
    </div>
  )
}
