import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIZ_OPTIONS, SPECIES } from '../data/species.js'
import { Bot, ChevronRight } from 'lucide-react'

const QUIZZES = [
  { speciesId: 'SPE001', confidence: 58, hint: '볼락 또는 노래미류로 추정됩니다', shape: '🐟' },
  { speciesId: 'SPE004', confidence: 63, hint: '두족류로 추정, 먹물 흔적 관찰', shape: '🐙' },
  { speciesId: 'SPE010', confidence: 52, hint: '갑각류, 옆걸음 이동 관찰', shape: '🦀' },
  { speciesId: 'SPE014', confidence: 67, hint: '새우류, 독도 특산종 가능성', shape: '🦐' },
  { speciesId: 'SPE011', confidence: 55, hint: '해조류, 갈조식물 계열', shape: '🌿' },
]

function MockImage({ shape, confidence }) {
  return (
    <div className="relative mx-auto" style={{ width: 220, height: 180 }}>
      {/* 수중 배경 */}
      <div className="w-full h-full rounded-2xl overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, #042040 0%, #010d18 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 180">
          {[40,100,160].map((x,i) => (
            <path key={i} d={`M${x},180 Q${x-8},150 ${x+4},130`}
              fill="none" stroke="#1d5c3a" strokeWidth={2+i} strokeLinecap="round" opacity="0.6" />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-7xl"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15))' }}>
          {shape}
        </div>
      </div>
      {/* AI 탐지 박스 */}
      <div className="absolute inset-4 border-2 border-dashed rounded-xl pointer-events-none"
        style={{ borderColor: confidence >= 65 ? '#00d4aa' : '#f59e0b', boxShadow: `0 0 16px rgba(${confidence >= 65 ? '0,212,170' : '245,158,11'},0.2)` }}
      />
      {/* 신뢰도 뱃지 */}
      <div className="absolute -top-3 left-4 rounded-lg px-2.5 py-1 text-xs font-mono font-bold"
        style={{ background: confidence >= 65 ? 'rgba(0,212,170,0.9)' : 'rgba(245,158,11,0.9)', color: '#030d1a' }}>
        {confidence}% 신뢰도
      </div>
    </div>
  )
}

export function ImageClassifier({ onPoints }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const [popup, setPopup] = useState(null)

  const quiz = QUIZZES[idx % QUIZZES.length]
  const opts = QUIZ_OPTIONS[idx % QUIZ_OPTIONS.length]
  const correct = opts.find(o => o.correct)

  function pick(opt) {
    if (done) return
    setSelected(opt.id)
    setDone(true)
    if (opt.correct) {
      onPoints(10)
      setPopup('+10 pt')
      setTimeout(() => setPopup(null), 1200)
    }
  }

  function next() {
    setIdx(i => i + 1)
    setSelected(null)
    setDone(false)
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* AI 배너 */}
      <div className="flex items-center gap-3 glass rounded-xl px-4 py-3"
        style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.05)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
          <Bot size={16} className="text-amber-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-amber-400">AI 신뢰도 {quiz.confidence}% — 여러분의 도움이 필요합니다</div>
          <div className="text-xs text-slate-500 mt-0.5">{quiz.hint}</div>
        </div>
      </div>

      {/* 이미지 */}
      <div className="glass rounded-2xl p-6 flex items-center justify-center relative">
        <MockImage shape={quiz.shape} confidence={quiz.confidence} />
        {popup && (
          <div className="absolute top-4 right-4 text-green-400 font-mono font-bold text-lg point-popup">{popup}</div>
        )}
      </div>

      {/* 선택지 */}
      <div className="grid grid-cols-2 gap-2">
        {opts.map(opt => {
          let style = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#e2e8f0' }
          if (done) {
            if (opt.correct) style = { background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.35)', color: '#00d4aa' }
            else if (opt.id === selected) style = { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }
            else style = { ...style, opacity: 0.4 }
          }
          return (
            <button key={opt.id} onClick={() => pick(opt)} disabled={done} aria-label={opt.korean}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all"
              style={style}
              onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = 'rgba(0,212,170,0.3)' }}
              onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>
              {done && opt.correct && '✅ '}
              {done && opt.id === selected && !opt.correct && '❌ '}
              {opt.korean}
            </button>
          )
        })}
      </div>

      {/* 결과 */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass rounded-xl px-4 py-3"
            style={selected === correct.id
              ? { borderColor: 'rgba(0,212,170,0.3)', background: 'rgba(0,212,170,0.06)' }
              : { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-semibold mb-0.5 ${selected === correct.id ? 'text-teal-400' : 'text-red-400'}`}>
                  {selected === correct.id ? '🎉 정답! +10pt 적립' : `❌ 정답: ${correct.korean}`}
                </div>
                <div className="text-xs text-slate-500 italic">
                  {SPECIES.find(s => s.id === correct.id)?.scientific}
                </div>
              </div>
              <button onClick={next} className="btn-ghost flex items-center gap-1 text-xs py-2 px-3">
                다음 <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
