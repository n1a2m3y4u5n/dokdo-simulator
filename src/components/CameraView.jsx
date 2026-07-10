import React, { useState, useEffect, useRef } from 'react'
import { SPECIES } from '../data/species.js'
import { STATIONS } from '../data/stations.js'
import { Camera, Cpu, Clock } from 'lucide-react'

function UnderwaterScene({ detections, station }) {
  const [time, setTime] = useState('')
  const scanY = useRef(0)
  const [scan, setScan] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date()
      setTime(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`)
      setScan(s => (s + 2) % 100)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{
      height: 320,
      background: 'radial-gradient(ellipse at 50% 0%, #042040 0%, #021528 55%, #010d18 100%)',
      border: '1px solid rgba(0,212,170,0.15)',
      boxShadow: '0 0 40px rgba(0,0,0,0.6)',
    }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice">
        {/* 광선 */}
        {[100,260,420,580,720].map((x, i) => (
          <polygon key={i}
            points={`${x},0 ${x + 60},0 ${x + 90},320 ${x - 30},320`}
            fill={`rgba(80,160,255,0.${i % 2 === 0 ? '025' : '015'})`}
          />
        ))}
        {/* 암반 */}
        <ellipse cx="80" cy="300" rx="150" ry="38" fill="#031520" />
        <ellipse cx="420" cy="305" rx="200" ry="32" fill="#021118" />
        <ellipse cx="720" cy="298" rx="160" ry="40" fill="#031520" />
        <rect x="0" y="306" width="800" height="14" fill="#020e14" />
        {/* 해조류 */}
        {[55,140,230,350,480,580,660,750].map((x, i) => (
          <path key={i}
            d={`M${x},310 Q${x + (i % 2 === 0 ? -12 : 12)},${270 - i * 4} ${x + 4},${240 - i * 7} Q${x + 16},${215 - i * 3} ${x + 6},${192 - i * 5}`}
            fill="none"
            stroke={i % 3 === 0 ? '#1d5c3a' : i % 3 === 1 ? '#2d6a4f' : '#3b7a5a'}
            strokeWidth={2.5 + (i % 3) * 0.8}
            strokeLinecap="round"
          />
        ))}
        {/* 기포 */}
        {[80,195,310,470,620].map((x, i) => (
          <circle key={i} cx={x} cy={140 + i * 25} r={1.5 + i * 0.4} fill="rgba(120,200,255,0.15)" />
        ))}
        {/* 탐지 개체 */}
        {detections.map((det, i) => (
          <g key={det.id} transform={`translate(${det.x}, ${det.y})`}>
            <ellipse cx={det.bw / 2} cy={det.bh / 2} rx={det.bw * 0.35} ry={det.bh * 0.28}
              fill={det.color} opacity="0.6" />
            <ellipse cx={det.bw / 2 + det.bw * 0.3} cy={det.bh / 2}
              rx={det.bw * 0.12} ry={det.bh * 0.18}
              fill={det.color} opacity="0.5" />
            <rect x="0" y="0" width={det.bw} height={det.bh}
              fill="none"
              stroke={det.confidence >= 70 ? '#00d4aa' : '#f59e0b'}
              strokeWidth="1.5"
              strokeDasharray="6,4"
              className="detection-dash"
            />
            <rect x="0" y="-22" width={det.bw} height={20} rx="4"
              fill={det.confidence >= 70 ? 'rgba(0,212,170,0.9)' : 'rgba(245,158,11,0.9)'} />
            <text x={det.bw / 2} y="-8" textAnchor="middle"
              fill="#030d1a" fontSize="10" fontWeight="700" fontFamily="Noto Sans KR">
              {det.name} {det.confidence}%
            </text>
          </g>
        ))}
      </svg>

      {/* 스캔 라인 */}
      <div className="absolute left-0 right-0 pointer-events-none"
        style={{ top: `${scan}%`, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent)',
          transition: 'top 1s linear',
        }}
      />

      {/* HUD 좌상단 */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(3,13,26,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-mono font-bold">REC</span>
        </div>
        <div className="rounded-lg px-2.5 py-1.5 font-mono text-xs text-teal-400"
          style={{ background: 'rgba(3,13,26,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,212,170,0.15)' }}>
          {station?.id ?? 'CAM-01'} · 수심 {station?.depth ?? 8}m
        </div>
      </div>

      {/* HUD 우상단 */}
      <div className="absolute top-3 right-3 font-mono text-xs text-slate-400 rounded-lg px-2.5 py-1.5"
        style={{ background: 'rgba(3,13,26,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Clock size={10} className="inline mr-1 opacity-60" />
        {time || '00:00:00'}
      </div>

      {/* HUD 우하단 — AI 뱃지 */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
        style={{ background: 'rgba(3,13,26,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(167,139,250,0.2)' }}>
        <Cpu size={11} className="text-purple-400" />
        <span className="text-purple-400 text-xs font-bold">AI Re-ID v2.4</span>
      </div>
    </div>
  )
}

export function CameraView({ selectedCam, onCamChange }) {
  const [detections, setDetections] = useState([])

  useEffect(() => {
    function spawn() {
      const count = 2 + Math.floor(Math.random() * 3)
      setDetections(Array.from({ length: count }, (_, i) => {
        const sp = SPECIES[Math.floor(Math.random() * 9)]
        return {
          id: Date.now() + i,
          name: sp.korean,
          color: sp.color,
          x: 50 + Math.random() * 600,
          y: 70 + Math.random() * 180,
          bw: 64 + Math.floor(Math.random() * 48),
          bh: 40 + Math.floor(Math.random() * 28),
          confidence: Math.floor(52 + Math.random() * 45),
          size: Math.floor(14 + Math.random() * 32),
          speciesId: sp.id,
          emoji: sp.emoji,
        }
      }))
    }
    spawn()
    const id = setInterval(spawn, 5000)
    return () => clearInterval(id)
  }, [selectedCam])

  const station = STATIONS.find(s => s.id === selectedCam)

  return (
    <div className="space-y-3">
      {/* 카메라 탭 */}
      <div className="flex gap-2 flex-wrap">
        {STATIONS.map(st => (
          <button key={st.id} onClick={() => onCamChange(st.id)}
            aria-label={`${st.name} 카메라`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={selectedCam === st.id ? {
              background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(10,180,238,0.12))',
              color: '#00d4aa',
              border: '1px solid rgba(0,212,170,0.3)',
            } : {
              background: 'rgba(255,255,255,0.03)',
              color: '#64748b',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
            <Camera size={11} />
            {st.id} · {st.name}
            {st.status === 'warning' && <span className="text-amber-400">⚠</span>}
          </button>
        ))}
      </div>

      {/* 화면 */}
      <UnderwaterScene detections={detections} station={station} />

      {/* 탐지 카드 */}
      <div>
        <div className="section-label mb-2">AI 실시간 탐지 — {detections.length}개 개체</div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {detections.map((det, i) => (
            <div key={det.id + i} className="glass shrink-0 rounded-xl p-3 w-44 glass-hover"
              style={{ borderColor: det.confidence >= 70 ? 'rgba(0,212,170,0.12)' : 'rgba(245,158,11,0.12)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span>{det.emoji}</span>
                <span className="text-sm font-semibold text-white truncate">{det.name}</span>
              </div>
              <div className="font-mono text-xs text-slate-500 mb-2">
                BOL-{String(1000 + i * 13 + Math.floor(det.x)).padStart(4,'0')}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${det.confidence}%`,
                      background: det.confidence >= 70 ? 'linear-gradient(90deg,#00d4aa,#0ab4ee)' : '#f59e0b' }} />
                </div>
                <span className="font-mono text-xs" style={{ color: det.confidence >= 70 ? '#00d4aa' : '#f59e0b' }}>
                  {det.confidence}%
                </span>
              </div>
              <div className="text-xs text-slate-600">~{det.size}cm</div>
              {det.confidence < 70 && (
                <div className="mt-1.5">
                  <span className="badge badge-amber" style={{ fontSize: 10 }}>검토 필요</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
