import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'

const TYPE_STYLE = {
  new:     { bg: 'rgba(0,212,170,0.08)',  border: 'rgba(0,212,170,0.2)',  text: '#00d4aa' },
  warn:    { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b' },
  label:   { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' },
  revisit: { bg: 'rgba(167,139,250,0.08)',border: 'rgba(167,139,250,0.2)',text: '#a78bfa' },
}

export function AlertFeed({ alerts }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col flex-1" style={{ minHeight: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={13} className="text-slate-400" />
          <span className="section-label">실시간 알림</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">{alerts.length}</span>
        </div>
      </div>

      <div className="space-y-1.5 overflow-y-auto flex-1" style={{ maxHeight: 260 }}>
        <AnimatePresence initial={false}>
          {alerts.map(a => {
            const style = TYPE_STYLE[a.type] ?? TYPE_STYLE.new
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl px-3 py-2.5"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold font-mono" style={{ color: style.text }}>{a.station}</span>
                  <span className="text-slate-600 text-xs font-mono">{a.time}</span>
                  <span className="text-base ml-auto">{a.icon}</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">{a.msg}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
