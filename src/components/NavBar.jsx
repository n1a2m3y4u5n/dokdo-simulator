import React from 'react'
import { LayoutDashboard, Video, Users, Star, Info, Waves } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: '대시보드',   Icon: LayoutDashboard },
  { id: 'live',      label: '수중 라이브', Icon: Video },
  { id: 'citizen',   label: '시민 참여',  Icon: Users },
  { id: 'myspecies', label: '내 생물',    Icon: Star },
  { id: 'about',     label: '시스템 소개', Icon: Info },
]

export function NavBar({ activeTab, onTabChange, points }) {
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(3,13,26,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-5 flex items-center h-14 gap-3">
        {/* 로고 */}
        <div className="flex items-center gap-2.5 mr-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00d4aa22, #0ab4ee22)', border: '1px solid rgba(0,212,170,0.3)' }}
          >
            <Waves size={16} className="text-teal-400" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-white leading-none">독도 해양 지킴이</div>
            <div className="text-xs text-slate-500 leading-none mt-0.5">Dokdo Marine Monitor</div>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                aria-label={label}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(0,212,170,0.18), rgba(10,180,238,0.12))',
                  color: '#00d4aa',
                  border: '1px solid rgba(0,212,170,0.25)',
                  boxShadow: '0 0 16px rgba(0,212,170,0.15)',
                } : {
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid transparent',
                }}
              >
                <Icon size={14} />
                <span className="hidden sm:block">{label}</span>
              </button>
            )
          })}
        </div>

        {/* 포인트 */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl ml-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Star size={13} fill="#fbbf24" className="text-yellow-400" />
          <span className="font-mono font-bold text-sm text-white">{points.toLocaleString()}</span>
          <span className="text-slate-500 text-xs">pt</span>
        </div>

        {/* LIVE 표시 */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-bold font-mono">LIVE</span>
        </div>
      </div>
    </nav>
  )
}
