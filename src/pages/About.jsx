import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Dna, Cpu, Users, ChevronRight } from 'lucide-react'

function CountUp({ target, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const t0 = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - t0) / duration, 1)
          const e = 1 - Math.pow(1 - p, 3)
          setVal(Math.floor(e * target))
          if (p < 1) requestAnimationFrame(tick)
          else setVal(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [target, duration])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const TECHS = [
  { Icon: Zap, color: '#60a5fa', title: '파력 발전', desc: '독도 주변 연평균 파고 1.5~2.5m를 활용한 진동수주형 파력 발전기로 케이블 없이 365일 자립 에너지를 공급합니다.' },
  { Icon: Dna, color: '#00d4aa', title: 'eDNA 분석', desc: '해수 속 환경 DNA를 자동 채수·분석하여 카메라에 포착되지 않은 희귀종까지 검출합니다. NGS로 종 수준 동정이 가능합니다.' },
  { Icon: Cpu, color: '#a78bfa', title: 'AI Re-ID', desc: '딥러닝 기반 개체 재식별 모델이 각 생물의 무늬·형태를 학습해 동일 개체를 장기 추적합니다. 이동 경로와 개체군 변동을 분석합니다.' },
  { Icon: Users, color: '#f59e0b', title: '시민과학', desc: '전 국민이 스마트폰으로 AI 라벨링에 참여합니다. 크라우드소싱으로 AI 모델을 지속 개선하고 해양 생태 인식을 높입니다.' },
]

const LAYERS = [
  { icon: '📷', label: '수중 카메라 + eDNA 채수기', sub: '4개 스테이션 · 24시간 연속', color: '#60a5fa' },
  { icon: '⚡', label: '파력 발전 모듈',             sub: '자립 에너지 · 케이블 불필요', color: '#00d4aa' },
  { icon: '🛰️', label: 'AI 실시간 처리 + 위성 전송', sub: 'Edge AI · Re-ID 모델',        color: '#a78bfa' },
  { icon: '🌐', label: '클라우드 데이터 허브',        sub: 'eDNA DB · 이력 관리',          color: '#f59e0b' },
  { icon: '👥', label: '시민과학 플랫폼',             sub: '라벨링 · 포인트 리워드',        color: '#e85d04' },
]

const STATS = [
  { target: 365, suffix: '일', label: '연속 모니터링', color: '#00d4aa' },
  { target: 12,  suffix: '배', label: '기존 대비 커버리지', color: '#60a5fa' },
  { target: 100000, suffix: '+명', label: '참여 가능 인원', color: '#f59e0b' },
]

export function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-20">

      {/* 히어로 */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-2"
          style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa' }}>
          한국발명진흥회 독도 발명 아이디어 공모전 출품작 · 2026
        </div>
        <div className="text-6xl animate-float">🌊</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          독도를 지키는<br />
          <span className="glow-teal" style={{ color: '#00d4aa' }}>작은 발명</span>
        </h1>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          파력 발전 × eDNA × AI 개체 추적 × 시민과학을 결합한<br />
          독도 해양 생태계 365일 상시 모니터링 시스템
        </p>
      </motion.section>

      {/* 문제 */}
      <section className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs text-teal-400 font-bold">01</span>
          <h2 className="text-xl font-bold text-white">현재의 한계</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📅', stat: '5년', desc: '국가 해양 생태 조사 주기', sub: '변화를 너무 늦게 파악합니다' },
            { icon: '🌪️', stat: '200일+', desc: '연간 출항 제한일', sub: '악천후·군사 구역 제한' },
            { icon: '🚫', stat: '미미', desc: '시민 참여 수준', sub: '전문가 의존형 조사' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-mono font-bold text-base mb-0.5" style={{ color: '#f87171' }}>{item.stat}</div>
              <div className="text-xs text-slate-400 font-medium mb-0.5">{item.desc}</div>
              <div className="text-xs text-slate-600">{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 시스템 구조 */}
      <section className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs text-teal-400 font-bold">02</span>
          <h2 className="text-xl font-bold text-white">5계층 시스템 구조</h2>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="space-y-2">
            {LAYERS.map((layer, i) => (
              <React.Fragment key={i}>
                <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: layer.color + '18', border: `1px solid ${layer.color}25` }}>
                    {layer.icon}
                  </div>
                  <div className="flex-1 py-2.5 px-4 rounded-xl"
                    style={{ background: layer.color + '0d', border: `1px solid ${layer.color}20` }}>
                    <div className="text-sm font-semibold" style={{ color: layer.color }}>{layer.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{layer.sub}</div>
                  </div>
                  <div className="font-mono text-xs text-slate-700 font-bold w-6 text-right">L{i+1}</div>
                </motion.div>
                {i < LAYERS.length - 1 && (
                  <div className="flex justify-center">
                    <ChevronRight size={14} className="text-slate-700 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 핵심 기술 */}
      <section className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs text-teal-400 font-bold">03</span>
          <h2 className="text-xl font-bold text-white">핵심 기술</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {TECHS.map(({ Icon, color, title, desc }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass glass-hover rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: color + '18', border: `1px solid ${color}25` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="font-bold text-white mb-2">{title}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 기대 효과 */}
      <section className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs text-teal-400 font-bold">04</span>
          <h2 className="text-xl font-bold text-white">기대 효과</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {STATS.map(({ target, suffix, label, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 text-center">
              <div className="font-mono text-3xl font-black mb-1" style={{ color }}>
                <CountUp target={target} suffix={suffix} />
              </div>
              <div className="text-xs text-slate-500">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 주최 정보 */}
      <section>
        <div className="glass rounded-2xl p-6 text-center"
          style={{ borderColor: 'rgba(0,212,170,0.2)', background: 'rgba(0,212,170,0.04)' }}>
          <div className="text-3xl mb-3">🏆</div>
          <div className="text-white font-bold text-base mb-1">한국발명진흥회 독도 발명 아이디어 공모전</div>
          <div className="text-sm text-slate-400 mb-3">2026년 출품작</div>
          <div className="text-xs text-slate-600">본 시뮬레이터는 시스템의 작동 원리와 시민 참여 흐름을 체험하기 위한 인터랙티브 데모입니다.<br />모든 데이터는 시뮬레이션이며 실제 독도 해양 데이터와 무관합니다.</div>
        </div>
      </section>
    </div>
  )
}
