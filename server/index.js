import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ── 정적 파일 서빙 (빌드 결과물) ──
app.use(express.static(join(__dirname, '../dist')))

// ── Mock 데이터 ──
const STATIONS = [
  { id: 'CAM-01', name: '동도 북방 A', lat: 37.2432, lng: 131.8685, depth: 8,  status: 'active',  temp: 14.3 },
  { id: 'CAM-02', name: '동도 서측 B', lat: 37.2418, lng: 131.8651, depth: 14, status: 'active',  temp: 13.9 },
  { id: 'CAM-03', name: '서도 남방 C', lat: 37.2401, lng: 131.8623, depth: 11, status: 'active',  temp: 14.6 },
  { id: 'CAM-04', name: '서도 북방 D', lat: 37.2445, lng: 131.8608, depth: 19, status: 'warning', temp: 15.1 },
]

const SPECIES = [
  { id: 'SPE001', korean: '볼락',    scientific: 'Sebastes inermis',           category: 'fish' },
  { id: 'SPE002', korean: '노래미',  scientific: 'Hexagrammos otakii',         category: 'fish' },
  { id: 'SPE003', korean: '돌돔',    scientific: 'Oplegnathus fasciatus',      category: 'fish' },
  { id: 'SPE004', korean: '문어',    scientific: 'Octopus vulgaris',           category: 'cephalopod' },
  { id: 'SPE005', korean: '해삼',    scientific: 'Apostichopus japonicus',     category: 'echinoderm' },
  { id: 'SPE006', korean: '전복',    scientific: 'Haliotis discus',            category: 'mollusk' },
  { id: 'SPE007', korean: '성게',    scientific: 'Strongylocentrotus nudus',   category: 'echinoderm' },
  { id: 'SPE008', korean: '홍합',    scientific: 'Mytilus coruscus',           category: 'mollusk' },
  { id: 'SPE009', korean: '오징어',  scientific: 'Todarodes pacificus',        category: 'cephalopod' },
  { id: 'SPE010', korean: '꽃게',    scientific: 'Portunus trituberculatus',   category: 'crustacean' },
  { id: 'SPE011', korean: '미역',    scientific: 'Undaria pinnatifida',        category: 'algae' },
  { id: 'SPE012', korean: '다시마',  scientific: 'Saccharina japonica',        category: 'algae' },
  { id: 'SPE013', korean: '감태',    scientific: 'Ecklonia cava',              category: 'algae' },
  { id: 'SPE014', korean: '독도새우', scientific: 'Pandalus latirostris',     category: 'crustacean' },
  { id: 'SPE015', korean: '참돔',    scientific: 'Pagrus major',               category: 'fish' },
]

const ALERT_TMPL = [
  (s, st) => `${st.name}에서 ${s.korean} 새 개체 발견 (신뢰도 ${Math.floor(85+Math.random()*12)}%)`,
  (_, st) => `${st.name} 수온 이상 감지 — 평균 대비 +${(Math.random()*1.5+0.5).toFixed(1)}°C`,
  (s, _)  => `시민 라벨링 완료: ${s.korean} 식별 확정 (검토자 ${Math.floor(6+Math.random()*10)}명)`,
  (s, st) => `${st.name}에서 기존 등록 개체 재발견 — BOL-${String(Math.floor(Math.random()*8000)+1000).padStart(4,'0')}`,
  (_, st) => `eDNA 분석 완료: ${st.name} 주변 ${Math.floor(18+Math.random()*8)}종 검출`,
]

function randSensor(base, delta) {
  return +(base + (Math.random() - 0.5) * 2 * delta).toFixed(2)
}

// ── REST 엔드포인트 ──

app.get('/api/stations', (_, res) => res.json(STATIONS))

app.get('/api/species', (_, res) => res.json(SPECIES))

app.get('/api/sensors/:stationId', (req, res) => {
  const st = STATIONS.find(s => s.id === req.params.stationId)
  if (!st) return res.status(404).json({ error: '스테이션 없음' })
  res.json({
    stationId: st.id,
    temp:      randSensor(st.temp, 0.25),
    turbidity: randSensor(2.1, 0.3),
    pressure:  +(st.depth * 0.101).toFixed(2),
    waveHeight: +(1.8 + Math.sin(Date.now() / 5000) * 0.6).toFixed(2),
    timestamp:  new Date().toISOString(),
  })
})

app.get('/api/stats', (_, res) => {
  res.json({
    totalSpecies: SPECIES.length,
    activeStations: STATIONS.filter(s => s.status === 'active').length,
    todayObservations: Math.floor(120 + Math.random() * 80),
    citizenContributions: Math.floor(340 + Math.random() * 60),
  })
})

// ── Server-Sent Events: 실시간 알림 스트림 ──
app.get('/api/alerts/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()

  function sendAlert() {
    const s  = SPECIES[Math.floor(Math.random() * SPECIES.length)]
    const st = STATIONS[Math.floor(Math.random() * STATIONS.length)]
    const tmpl = ALERT_TMPL[Math.floor(Math.random() * ALERT_TMPL.length)]
    const types = ['new','warn','label','revisit','new']
    const icons  = ['🐟','⚠️','✅','🔔','🐟']
    const idx = Math.floor(Math.random() * types.length)
    const alert = {
      id:      Date.now(),
      type:    types[idx],
      icon:    icons[idx],
      station: st.id,
      msg:     tmpl(s, st),
      time:    new Date().toLocaleTimeString('ko-KR', { hour12: false }),
    }
    res.write(`data: ${JSON.stringify(alert)}\n\n`)
  }

  sendAlert()
  const interval = setInterval(sendAlert, 5000)

  req.on('close', () => {
    clearInterval(interval)
    res.end()
  })
})

// ── SPA 폴백 ──
app.get('*', (_, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`🌊 독도 해양 지킴이 서버 실행 중 — http://localhost:${PORT}`)
})
