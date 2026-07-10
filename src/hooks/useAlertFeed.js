import { useState, useEffect } from 'react'
import { SPECIES } from '../data/species.js'
import { STATIONS } from '../data/stations.js'

const ALERT_TEMPLATES = [
  (s, st) => ({ type: 'new', icon: '🐟', msg: `${st.name}에서 ${s.korean} 새 개체 발견 (신뢰도 92%)` }),
  (s, st) => ({ type: 'warn', icon: '⚠️', msg: `${st.name} 수온 이상 감지 — 평균 대비 +1.2°C` }),
  (s, st) => ({ type: 'label', icon: '✅', msg: `시민 라벨링 완료: ${s.korean} 식별 확정 (검토자 12명)` }),
  (s, st) => ({ type: 'revisit', icon: '🔔', msg: `${st.name}에서 기존 등록 개체 재발견 — BOL-${String(Math.floor(Math.random()*9000)+1000).padStart(4,'0')}` }),
  (s, st) => ({ type: 'new', icon: '🐟', msg: `eDNA 분석 완료: ${st.name} 주변 ${Math.floor(Math.random()*5)+18}종 검출` }),
]

function makeAlert() {
  const s = SPECIES[Math.floor(Math.random() * SPECIES.length)]
  const st = STATIONS[Math.floor(Math.random() * STATIONS.length)]
  const tpl = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)]
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
  return { id: Date.now() + Math.random(), time, station: st.id, ...tpl(s, st) }
}

const INITIAL_ALERTS = [
  { id: 1, time: '09:12:04', station: 'CAM-01', type: 'new', icon: '🐟', msg: '동도 북방 A에서 볼락 새 개체 발견 (신뢰도 94%)' },
  { id: 2, time: '09:18:31', station: 'CAM-03', type: 'label', icon: '✅', msg: '시민 라벨링 완료: 독도새우 식별 확정 (검토자 8명)' },
  { id: 3, time: '09:25:17', station: 'CAM-04', type: 'warn', icon: '⚠️', msg: '서도 북방 D 수온 이상 감지 — 평균 대비 +1.4°C' },
  { id: 4, time: '09:31:52', station: 'CAM-02', type: 'revisit', icon: '🔔', msg: '동도 서측 B에서 기존 등록 개체 재발견 — BOL-0042' },
  { id: 5, time: '09:44:08', station: 'CAM-01', type: 'new', icon: '🐟', msg: 'eDNA 분석 완료: 동도 북방 A 주변 23종 검출' },
]

export function useAlertFeed() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => [makeAlert(), ...prev].slice(0, 30))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return alerts
}
