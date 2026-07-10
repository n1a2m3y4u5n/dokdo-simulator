import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPECIES } from '../data/species.js'
import { STATIONS, DETECTED_INDIVIDUALS, SHOP_ITEMS } from '../data/stations.js'
import { Plus, Bell, Gift, X, Clock, Cpu, MapPin, Calendar, Star, ShoppingBag, Check, ChevronRight } from 'lucide-react'

/* ── 초기 입양 데이터 (AI가 식별한 특정 개체를 입양) ── */
const INIT_ADOPTED = [
  {
    id: 1, bolId: 'BOL-0042', speciesId: 'SPE001', nickname: '바다친구',
    stationId: 'CAM-01', registeredAt: '2026-04-12', resightings: 7,
    history: [
      { date: '2026-04-12', station: '동도 북방 A', cam: 'CAM-01' },
      { date: '2026-04-19', station: '동도 동측 B', cam: 'CAM-02' },
      { date: '2026-05-02', station: '동도 북방 A', cam: 'CAM-01' },
      { date: '2026-05-14', station: '서도 남방 C', cam: 'CAM-03' },
      { date: '2026-05-21', station: '동도 북방 A', cam: 'CAM-01' },
    ],
  },
  {
    id: 2, bolId: 'BOL-0087', speciesId: 'SPE014', nickname: '독도의별',
    stationId: 'CAM-03', registeredAt: '2026-05-01', resightings: 3,
    history: [
      { date: '2026-05-01', station: '서도 남방 C', cam: 'CAM-03' },
      { date: '2026-05-09', station: '서도 남방 C', cam: 'CAM-03' },
      { date: '2026-05-18', station: '동도 동측 B', cam: 'CAM-02' },
    ],
  },
]

/* ── 개체 입양 모달 ── */
function AdoptModal({ adopted, onClose, onAdopt }) {
  const [step, setStep] = useState('list')   // 'list' | 'confirm'
  const [selected, setSelected] = useState(null)
  const [nickname, setNickname] = useState('')

  const alreadyAdopted = adopted.map(a => a.bolId)
  const available = DETECTED_INDIVIDUALS.filter(d => !alreadyAdopted.includes(d.bolId))

  function handleSelect(ind) {
    setSelected(ind)
    setStep('confirm')
  }

  function handleAdopt() {
    if (!selected || !nickname.trim()) return
    const st = STATIONS.find(s => s.id === selected.cam)
    const now = new Date()
    const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
    onAdopt({
      bolId: selected.bolId,
      speciesId: selected.speciesId,
      nickname: nickname.trim(),
      stationId: selected.cam,
      registeredAt: date,
      resightings: selected.sightings,
      history: [{ date, station: st?.name ?? '', cam: selected.cam }],
    })
    onClose()
  }

  const sp = selected ? SPECIES.find(s => s.id === selected.speciesId) : null
  const st = selected ? STATIONS.find(s => s.id === selected.cam) : null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
        className="glass-dark rounded-2xl w-full max-w-md"
        style={{ maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div>
            <h3 className="text-base font-bold text-white">
              {step === 'list' ? 'AI 탐지 개체 입양하기' : '입양 확인'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 'list'
                ? 'AI Re-ID가 식별한 개체 중 입양할 개체를 선택하세요'
                : `${sp?.korean} ${selected?.bolId}를 내 개체로 등록합니다`}
            </p>
          </div>
          <button onClick={onClose} aria-label="닫기" className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {step === 'list' && (
          <div className="overflow-y-auto flex-1 p-4 space-y-2">
            {available.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                현재 입양 가능한 탐지 개체가 없습니다
              </div>
            ) : available.map(ind => {
              const s  = SPECIES.find(sp => sp.id === ind.speciesId)
              const st = STATIONS.find(st => st.id === ind.cam)
              return (
                <button key={ind.bolId} onClick={() => handleSelect(ind)}
                  className="w-full text-left glass-hover rounded-xl p-3.5 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: s?.color + '18', border: `1px solid ${s?.color}25` }}>
                      {s?.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-teal-400">{ind.bolId}</span>
                        <span className="text-sm font-semibold text-white">{s?.korean}</span>
                        <span className="badge badge-blue text-xs shrink-0">{ind.confidence}% 신뢰</span>
                      </div>
                      <div className="text-xs text-slate-500 italic mb-1">{s?.scientific}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1"><MapPin size={9} />{st?.name}</span>
                        <span className="flex items-center gap-1"><Calendar size={9} />{ind.firstDate} 최초 발견</span>
                        <span className="flex items-center gap-1"><Clock size={9} />{ind.sightings}회 탐지</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 shrink-0" />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {step === 'confirm' && selected && (
          <div className="p-5 space-y-4">
            {/* 개체 정보 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{sp?.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-400">{selected.bolId}</span>
                    <span className="font-semibold text-white">{sp?.korean}</span>
                  </div>
                  <div className="text-xs text-slate-500 italic">{sp?.scientific}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                이 개체는 AI Re-ID 모델이 <b className="text-slate-300">{selected.sightings}회</b> 재식별한 개체입니다.
                별명을 지어주면 이 개체가 카메라에 포착될 때마다 알림을 받을 수 있습니다.
              </div>
            </div>

            <div>
              <div className="section-label mb-2">이 개체의 별명</div>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="예: 용감한 볼락, 새벽이, 점박이…"
                className="input-dark"
                aria-label="별명 입력"
                onKeyDown={e => e.key === 'Enter' && handleAdopt()}
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep('list')} className="btn-ghost flex-1 justify-center text-sm py-2.5" aria-label="뒤로">
                ← 뒤로
              </button>
              <button onClick={handleAdopt} disabled={!nickname.trim()} className="btn-primary flex-1 justify-center text-sm py-2.5" aria-label="입양 완료">
                입양 완료
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ── 개체 상세 모달 ── */
function DetailModal({ entry, onClose }) {
  const sp = SPECIES.find(s => s.id === entry.speciesId)
  const ind = DETECTED_INDIVIDUALS.find(d => d.bolId === entry.bolId)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }}
        className="glass-dark rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: sp?.color + '18', border: `1px solid ${sp?.color}30` }}>
            {sp?.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white text-lg leading-none mb-1">{entry.nickname}</div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-mono text-xs text-teal-400">{entry.bolId}</span>
              <span className="text-slate-400 text-sm">{sp?.korean}</span>
            </div>
            <div className="text-xs text-slate-600 italic">{sp?.scientific}</div>
          </div>
        </div>

        <div className="rounded-xl p-3 mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Cpu size={11} className="text-purple-400" />
            <span className="text-xs text-slate-400">AI Re-ID 정보</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-slate-600">식별 신뢰도</span><br />
              <span className="font-mono font-bold text-purple-400">{ind?.confidence ?? 90}%</span></div>
            <div><span className="text-slate-600">총 탐지 횟수</span><br />
              <span className="font-mono font-bold text-white">{entry.resightings}회</span></div>
          </div>
        </div>

        <div className="section-label mb-3">이동 이력 타임라인</div>
        <div className="relative pl-5 space-y-3">
          {entry.history.map((h, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: '#030d1a', borderColor: '#00d4aa' }} />
              {i < entry.history.length - 1 && (
                <div className="absolute -left-4 top-3.5 w-0.5 h-full"
                  style={{ background: 'rgba(0,212,170,0.12)' }} />
              )}
              <div className="font-mono text-xs text-teal-400 mb-0.5">{h.date}</div>
              <div className="text-xs text-slate-300">
                {h.station} <span className="text-slate-600">({h.cam})</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-ghost w-full justify-center mt-5 text-sm" aria-label="닫기">닫기</button>
      </motion.div>
    </motion.div>
  )
}

/* ── 독도 기념품 교환소 ── */
function ShopModal({ points, onExchange, onClose }) {
  const [cart, setCart] = useState(null)
  const [done, setDone] = useState(null)

  function tryExchange(item) {
    if (points < item.price) return
    setCart(item)
  }

  function confirmExchange() {
    if (!cart) return
    onExchange(cart.price)
    setDone(cart)
    setCart(null)
    setTimeout(() => { setDone(null); onClose() }, 2500)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={() => !done && onClose()}>
      <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
        className="glass-dark rounded-2xl w-full max-w-lg"
        style={{ maxHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}>

        {/* 성공 화면 */}
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center rounded-2xl z-10"
              style={{ background: 'rgba(3,13,26,0.97)' }}>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(0,212,170,0.15)', border: '2px solid rgba(0,212,170,0.4)' }}>
                  <Check size={32} className="text-teal-400" />
                </div>
                <div className="text-2xl">{done.emoji}</div>
                <div className="font-bold text-white">{done.name}</div>
                <div className="text-sm text-teal-400">교환 신청이 완료되었습니다!</div>
                <div className="text-xs text-slate-500">등록된 주소로 발송 예정입니다</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white">독도 기념 상품 교환소</h3>
              <p className="text-xs text-slate-500">모니터링 기여 포인트로 교환하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <Star size={12} fill="#fbbf24" className="text-yellow-400" />
              <span className="font-mono font-bold text-yellow-400">{points.toLocaleString()}</span>
              <span className="text-yellow-600 text-xs">pt</span>
            </div>
            <button onClick={onClose} aria-label="닫기" className="text-slate-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {SHOP_ITEMS.map(item => {
            const canBuy = points >= item.price
            return (
              <div key={item.id} className="flex items-center gap-4 rounded-xl p-3.5"
                style={{
                  background: canBuy ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
                  border: `1px solid ${canBuy ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}`,
                  opacity: canBuy ? 1 : 0.55,
                }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: canBuy ? 'rgba(0,212,170,0.1)' : 'rgba(255,255,255,0.03)' }}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm">{item.name}</span>
                    <span className="text-xs text-slate-600">재고 {item.stock}개</span>
                  </div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <Star size={11} fill="#fbbf24" className="text-yellow-400" />
                    <span className="font-mono font-bold text-sm" style={{ color: canBuy ? '#fbbf24' : '#64748b' }}>
                      {item.price}
                    </span>
                  </div>
                  <button
                    onClick={() => tryExchange(item)}
                    disabled={!canBuy}
                    aria-label={`${item.name} 교환`}
                    className={canBuy ? 'btn-primary text-xs px-3 py-1.5' : 'btn-ghost text-xs px-3 py-1.5'}
                    style={!canBuy ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                    {canBuy ? '교환하기' : `${(item.price - points).toLocaleString()}pt 부족`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* 포인트 안내 */}
        <div className="px-4 pb-4">
          <div className="rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            💡 이미지 분류 +10pt · 행동 기록 +5pt · 이상 신고 접수 +3pt로 포인트를 적립하세요
          </div>
        </div>
      </motion.div>

      {/* 교환 확인 팝오버 */}
      <AnimatePresence>
        {cart && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center"
            onClick={() => setCart(null)}>
            <div className="glass-dark rounded-2xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="text-3xl text-center mb-3">{cart.emoji}</div>
              <div className="font-bold text-white text-center mb-1">{cart.name}</div>
              <div className="text-sm text-slate-400 text-center mb-4">
                <span className="text-yellow-400 font-mono font-bold">{cart.price}pt</span>를 사용합니다
              </div>
              <div className="text-xs text-slate-500 text-center mb-5">
                잔여 포인트: <span className="font-mono text-slate-300">{(points - cart.price).toLocaleString()}pt</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCart(null)} className="btn-ghost flex-1 justify-center text-sm py-2.5" aria-label="취소">취소</button>
                <button onClick={confirmExchange} className="btn-primary flex-1 justify-center text-sm py-2.5" aria-label="교환 확인">
                  교환 확인
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── 입양된 개체 카드 ── */
function AdoptedCard({ entry, onClick }) {
  const sp = SPECIES.find(s => s.id === entry.speciesId)
  const st = STATIONS.find(s => s.id === entry.stationId)
  return (
    <button onClick={onClick} aria-label={`${entry.nickname} 상세`}
      className="glass glass-hover w-full text-left p-4 rounded-2xl">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: sp?.color + '18', border: `1px solid ${sp?.color}28` }}>
          {sp?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white leading-none mb-1">{entry.nickname}</div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-teal-400">{entry.bolId}</span>
          </div>
          <div className="text-xs text-slate-500">{sp?.korean} · {sp?.scientific}</div>
        </div>
        <div className="badge badge-teal text-xs shrink-0">{entry.resightings}회 탐지</div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1"><MapPin size={9} />{st?.name}</span>
        <span className="flex items-center gap-1"><Calendar size={9} />{entry.registeredAt}</span>
      </div>
    </button>
  )
}

/* ── 메인 컴포넌트 ── */
export function MySpecies({ onTabChange, points, onPoints }) {
  const [adopted, setAdopted] = useState(INIT_ADOPTED)
  const [showAdopt, setShowAdopt] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [detail, setDetail] = useState(null)
  const [notifs, setNotifs] = useState([])
  const [success, setSuccess] = useState(null)

  /* 재발견 알림 시뮬레이션 */
  useEffect(() => {
    if (!adopted.length) return
    const id = setInterval(() => {
      const e  = adopted[Math.floor(Math.random() * adopted.length)]
      const st = STATIONS[Math.floor(Math.random() * STATIONS.length)]
      const ago = Math.floor(Math.random() * 9) + 1
      setNotifs(p => [{
        id: Date.now(), bolId: e.bolId, nickname: e.nickname,
        station: st.name, cam: st.id, ago: `${ago}분 전`,
      }, ...p].slice(0, 8))
    }, 10000)
    return () => clearInterval(id)
  }, [adopted])

  function handleAdopt(data) {
    setAdopted(p => [...p, { id: Date.now(), ...data }])
    setSuccess(`${data.bolId} "${data.nickname}"이(가) 내 개체로 등록되었습니다! 🎉`)
    setTimeout(() => setSuccess(null), 3500)
  }

  function handleExchange(price) {
    onPoints(-price)
  }

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <div className="flex gap-4">
        {/* ── 메인: 입양 개체 그리드 ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">내 입양 개체</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                AI Re-ID가 고유 식별한 개체를 입양하면 재발견 시 알림을 받습니다
              </p>
            </div>
            <button onClick={() => setShowAdopt(true)} className="btn-primary text-sm" aria-label="새 개체 입양">
              <Plus size={14} /> 개체 입양하기
            </button>
          </div>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-teal-400"
                style={{ borderColor: 'rgba(0,212,170,0.25)', background: 'rgba(0,212,170,0.06)' }}>
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {adopted.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4 animate-float">🐟</div>
              <div className="text-slate-400 font-medium mb-1">아직 입양한 개체가 없습니다</div>
              <div className="text-slate-600 text-sm mb-5">
                AI가 고유 식별한 개체에 별명을 붙여<br />이동 경로를 함께 추적해보세요!
              </div>
              <button onClick={() => setShowAdopt(true)} className="btn-primary text-sm">
                첫 개체 입양하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {adopted.map(e => (
                <motion.div key={e.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                  <AdoptedCard entry={e} onClick={() => setDetail(e)} />
                </motion.div>
              ))}
            </div>
          )}

          {/* AI Re-ID 안내 */}
          <div className="mt-4 glass rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{ borderColor: 'rgba(167,139,250,0.15)', background: 'rgba(167,139,250,0.04)' }}>
            <Cpu size={14} className="text-purple-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-500 leading-relaxed">
              <b className="text-slate-300">AI 개체 재식별(Re-ID)란?</b> 딥러닝 모델이 각 생물의 무늬·체형·상처 패턴을 학습해 동일 개체를 카메라 간에 추적합니다.
              종(種) 수준이 아닌 <b className="text-purple-300">개체 수준</b>의 추적이 가능하여 이동 경로·행동권·생존율을 장기 모니터링합니다.
            </div>
          </div>
        </div>

        {/* ── 사이드: 알림 + 포인트 ── */}
        <div className="w-64 shrink-0 space-y-3">
          {/* 재발견 알림 */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={13} className="text-slate-400" />
              <span className="section-label">재발견 알림</span>
            </div>
            {notifs.length === 0 ? (
              <p className="text-xs text-slate-600">개체 입양 후 재탐지 시 알림이 표시됩니다</p>
            ) : (
              <div className="space-y-2">
                {notifs.map(n => (
                  <button key={n.id} onClick={() => onTabChange('live')} aria-label={`${n.nickname} 재발견`}
                    className="w-full text-left glass-hover px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.12)' }}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-xs text-teal-400">{n.bolId}</span>
                    </div>
                    <div className="text-xs font-semibold text-white mb-0.5">"{n.nickname}"</div>
                    <div className="text-xs text-slate-400">{n.station}에서 재발견!</div>
                    <div className="flex items-center gap-1 mt-1 text-slate-600 text-xs">
                      <Clock size={9} />{n.ago}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 포인트 + 교환소 */}
          <div className="glass rounded-2xl p-4">
            <div className="section-label mb-2">나의 포인트</div>
            <div className="font-mono text-3xl font-bold mb-1" style={{ color: '#fbbf24' }}>
              {points.toLocaleString()}
              <span className="text-base text-yellow-600 ml-1">pt</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full"
                  style={{ background: points >= (i + 1) * 100 ? '#fbbf24' : 'rgba(255,255,255,0.06)' }} />
              ))}
            </div>
            <p className="text-xs text-slate-600 mb-4">
              다음 리워드까지 {Math.max(0, (Math.ceil(points / 50) + 1) * 50 - points)}pt
            </p>
            <button onClick={() => setShowShop(true)} className="btn-primary w-full justify-center text-sm py-2.5" aria-label="기념품 교환소">
              <Gift size={14} /> 기념품 교환소 열기
            </button>
          </div>

          {/* 현재 입양 가능 개체 수 */}
          <div className="glass rounded-2xl p-3 text-center">
            <div className="font-mono text-2xl font-bold text-teal-400 mb-0.5">
              {DETECTED_INDIVIDUALS.filter(d => !adopted.map(a => a.bolId).includes(d.bolId)).length}
            </div>
            <div className="text-xs text-slate-500">입양 대기 중인 AI 탐지 개체</div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {showAdopt && <AdoptModal adopted={adopted} onClose={() => setShowAdopt(false)} onAdopt={handleAdopt} />}
        {showShop  && <ShopModal points={points} onExchange={handleExchange} onClose={() => setShowShop(false)} />}
        {detail    && <DetailModal entry={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>
    </div>
  )
}
