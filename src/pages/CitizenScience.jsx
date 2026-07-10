import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageClassifier } from '../components/ImageClassifier.jsx'
import { SPECIES } from '../data/species.js'
import { STATIONS, BEHAVIORS } from '../data/stations.js'
import { Search, AlertTriangle, ClipboardList, Trophy } from 'lucide-react'

const REPORT_TYPES = [
  { label: '낯선 생물', icon: '🐟' },
  { label: '오염 의심', icon: '☠️' },
  { label: '해양 쓰레기', icon: '🗑️' },
  { label: '장비 이상', icon: '🔧' },
  { label: '기타', icon: '📋' },
]

const LEADERS = [
  { rank: 1, name: '바다지킴이', count: 243, pts: 2430 },
  { rank: 2, name: '독도사랑', count: 187, pts: 1870 },
  { rank: 3, name: '해양탐험가', count: 156, pts: 1560 },
  { rank: 4, name: '푸른바다', count: 134, pts: 1340 },
  { rank: 5, name: '나 (홍길동)', count: 12, pts: 120, isMe: true },
]

const RANK_COLORS = ['#fbbf24', '#94a3b8', '#b45309', '#64748b', '#64748b']

function ReportTab({ onToast }) {
  const [sel, setSel] = useState(null)
  const [desc, setDesc] = useState('')

  function submit() {
    if (!sel) return
    onToast('신고가 접수되었습니다. 전문 연구원에게 전달됩니다.')
    setSel(null); setDesc('')
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="glass rounded-2xl p-5 space-y-4">
        <p className="text-sm text-slate-400 leading-relaxed">
          현재 카메라 피드에서 이상한 점을 발견하셨나요? 신고 유형을 선택하고 간단한 설명을 남겨주세요.
        </p>
        <div>
          <div className="section-label mb-2">신고 유형</div>
          <div className="flex flex-wrap gap-2">
            {REPORT_TYPES.map(t => (
              <button key={t.label} onClick={() => setSel(t.label)} aria-label={t.label}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={sel === t.label ? {
                  background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.35)', color: '#00d4aa',
                } : {
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b',
                }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="section-label mb-2">상세 설명</div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="어떤 이상 징후를 발견하셨나요? 위치, 시간, 특이 사항을 적어주세요."
            className="input-dark resize-none" rows={4} />
        </div>
        <button onClick={submit} disabled={!sel} className="btn-primary w-full justify-center" aria-label="신고 접수">
          신고 접수하기
        </button>
      </div>
    </div>
  )
}

function BehaviorTab({ onPoints, onToast }) {
  const [spId, setSpId] = useState('')
  const [checked, setChecked] = useState([])
  const [logs, setLogs] = useState([])

  function toggle(b) { setChecked(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]) }

  function save() {
    if (!spId || !checked.length) return
    const sp = SPECIES.find(s => s.id === spId)
    const now = new Date()
    setLogs(p => [{
      id: Date.now(),
      species: sp.korean,
      emoji: sp.emoji,
      behaviors: [...checked],
      time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    }, ...p])
    onPoints(5)
    onToast(`행동 기록이 생태 DB에 추가되었습니다! (+5pt)`)
    setChecked([]); setSpId('')
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="glass rounded-2xl p-5 space-y-4">
        <div>
          <div className="section-label mb-2">관찰 생물</div>
          <select value={spId} onChange={e => setSpId(e.target.value)} className="input-dark" aria-label="관찰 생물 선택">
            <option value="">-- 생물을 선택하세요 --</option>
            {SPECIES.slice(0,10).map(s => <option key={s.id} value={s.id}>{s.emoji} {s.korean}</option>)}
          </select>
        </div>
        <div>
          <div className="section-label mb-2">관찰 행동 (복수 선택)</div>
          <div className="flex flex-wrap gap-2">
            {BEHAVIORS.map(b => (
              <button key={b} onClick={() => toggle(b)} aria-label={b}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={checked.includes(b) ? {
                  background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.35)', color: '#00d4aa',
                } : {
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b',
                }}>
                {checked.includes(b) ? '✓ ' : ''}{b}
              </button>
            ))}
          </div>
        </div>
        <button onClick={save} disabled={!spId || !checked.length} className="btn-primary w-full justify-center" aria-label="기록 저장">
          기록 저장 (+5pt)
        </button>
      </div>

      {logs.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="section-label mb-3">오늘의 행동 기록</div>
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span>{log.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{log.species}</span>
                    <span className="text-xs text-slate-600 font-mono">{log.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {log.behaviors.map(b => (
                      <span key={b} className="badge badge-teal text-xs">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function CitizenScience({ onPoints }) {
  const [sub, setSub] = useState('classify')
  const [toast, setToast] = useState(null)
  const [myCount, setMyCount] = useState(12)

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000) }
  function addPts(n) { onPoints(n); setMyCount(c => c + 1) }

  const SUBS = [
    { id: 'classify', label: '이미지 분류', Icon: Search },
    { id: 'report',   label: '이상 신고',   Icon: AlertTriangle },
    { id: 'behavior', label: '행동 기록',   Icon: ClipboardList },
  ]

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <div className="flex gap-4">
        {/* 메인 */}
        <div className="flex-1 min-w-0">
          {/* 서브탭 */}
          <div className="flex gap-2 mb-5">
            {SUBS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setSub(id)} aria-label={label}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={sub === id ? {
                  background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(10,180,238,0.12))',
                  color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)',
                } : {
                  background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                <Icon size={13} /> {label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-slate-500">내 분류</span>
              <span className="font-mono font-bold text-white">{myCount}회</span>
            </div>
          </div>

          {sub === 'classify' && <ImageClassifier onPoints={addPts} />}
          {sub === 'report'   && <ReportTab onToast={showToast} />}
          {sub === 'behavior' && <BehaviorTab onPoints={addPts} onToast={showToast} />}
        </div>

        {/* 리더보드 */}
        <div className="w-56 shrink-0">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={13} className="text-yellow-400" />
              <span className="section-label">기여 랭킹</span>
            </div>
            <div className="space-y-2">
              {LEADERS.map((l, i) => (
                <div key={l.rank} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
                  style={l.isMe ? { background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' } : {}}>
                  <span className="font-mono font-bold w-5 text-center text-sm" style={{ color: RANK_COLORS[i] }}>
                    {l.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: l.isMe ? '#00d4aa' : '#e2e8f0' }}>
                      {l.name}
                    </div>
                    <div className="text-xs text-slate-600 font-mono">{l.count}회</div>
                  </div>
                  <div className="text-xs font-mono text-yellow-400">{l.pts.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 토스트 */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #00d4aa, #0ab4ee)', color: '#030d1a', boxShadow: '0 8px 32px rgba(0,212,170,0.35)' }}>
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
