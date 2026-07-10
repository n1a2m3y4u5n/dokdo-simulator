import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { useSensorData } from '../hooks/useSensorData.js'
import { useAlertFeed } from '../hooks/useAlertFeed.js'
import { SensorPanel } from '../components/SensorPanel.jsx'
import { WavePowerGauge } from '../components/WavePowerGauge.jsx'
import { AlertFeed } from '../components/AlertFeed.jsx'
import { STATIONS } from '../data/stations.js'
import { SPECIES } from '../data/species.js'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'

/* leaflet 기본 아이콘 깨짐 방지 */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS = {
  active:  { color: '#00d4aa', label: '정상', Icon: Wifi },
  warning: { color: '#f59e0b', label: '경보', Icon: AlertTriangle },
  offline: { color: '#64748b', label: '오프라인', Icon: WifiOff },
}

function stationIcon(status) {
  const c = STATUS[status]?.color ?? '#64748b'
  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:0.18;animation:ripple 2.2s ease-out infinite;"></div>
        <div style="position:absolute;inset:6px;border-radius:50%;background:${c};box-shadow:0 0 16px ${c},0 0 4px rgba(255,255,255,0.4);border:2px solid rgba(255,255,255,0.3);"></div>
      </div>
    `,
  })
}

function StationPopup({ st }) {
  const recent = SPECIES.slice(0, 3).map(s => s.korean).join(' · ')
  const s = STATUS[st.status]
  return (
    <div style={{
      background: 'rgba(5,15,30,0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0,212,170,0.2)',
      borderRadius: 14,
      padding: '14px 16px',
      minWidth: 190,
      fontFamily: "'Noto Sans KR', sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ color: '#00d4aa', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
        {st.id} · {st.name}
      </div>
      {[
        ['수심', `${st.depth} m`],
        ['수온', `${st.temp} °C`],
        ['최근 발견', recent],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
          <span style={{ color: '#64748b' }}>{k}</span>
          <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          background: s.color + '22', color: s.color, border: `1px solid ${s.color}44`,
        }}>
          {st.status === 'active' ? '● ' : '⚠ '}{s.label}
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const sensor = useSensorData()
  const alerts = useAlertFeed()
  const [activeStation, setActiveStation] = useState(null)

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 80px)' }}>

        {/* ── 좌측: 지도 ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-white">독도 해역 실시간 모니터링</h1>
              <p className="text-xs text-slate-500 mt-0.5">북위 37°14′N · 동경 131°52′E</p>
            </div>
            <div className="flex gap-2">
              {STATIONS.map(st => {
                const s = STATUS[st.status]
                return (
                  <div key={st.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs text-slate-400">{st.id}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 지도 */}
          <div className="flex-1 rounded-2xl overflow-hidden" style={{
            border: '1px solid rgba(0,212,170,0.12)',
            boxShadow: '0 0 0 1px rgba(0,212,170,0.05), 0 24px 64px rgba(0,0,0,0.4)',
            minHeight: 440,
          }}>
            <MapContainer
              center={[37.2423, 131.8650]}
              zoom={14}
              style={{ width: '100%', height: '100%', minHeight: 440 }}
              zoomControl={true}
            >
              {/* CartoDB Dark Matter — 다크 테마에 최적화, 필터 불필요 */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                subdomains="abcd"
                maxZoom={19}
              />

              {STATIONS.map(st => (
                <React.Fragment key={st.id}>
                  {/* 경보 스테이션 반경 표시 */}
                  {st.status === 'warning' && (
                    <Circle
                      center={[st.lat, st.lng]}
                      radius={120}
                      pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.06, weight: 1, dashArray: '6 4' }}
                    />
                  )}
                  <Circle
                    center={[st.lat, st.lng]}
                    radius={60}
                    pathOptions={{
                      color: STATUS[st.status]?.color ?? '#64748b',
                      fillColor: STATUS[st.status]?.color ?? '#64748b',
                      fillOpacity: 0.08,
                      weight: 1,
                    }}
                  />
                  <Marker
                    position={[st.lat, st.lng]}
                    icon={stationIcon(st.status)}
                    eventHandlers={{ click: () => setActiveStation(st.id) }}
                  >
                    <Popup>
                      <StationPopup st={st} />
                    </Popup>
                  </Marker>
                </React.Fragment>
              ))}
            </MapContainer>
          </div>

          {/* 스테이션 요약 카드 */}
          <div className="grid grid-cols-4 gap-2">
            {STATIONS.map(st => {
              const s = STATUS[st.status]
              const Icon = s.Icon
              return (
                <div key={st.id} className="glass p-3 rounded-xl glass-hover cursor-pointer"
                  style={activeStation === st.id ? { borderColor: 'rgba(0,212,170,0.35)' } : {}}
                  onClick={() => setActiveStation(st.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">{st.id}</span>
                    <Icon size={12} style={{ color: s.color }} />
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{st.name}</div>
                  <div className="font-mono text-base font-bold" style={{ color: '#60a5fa' }}>{st.temp}°C</div>
                  <div className="text-xs text-slate-600">수심 {st.depth}m</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 우측: 패널 ── */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <SensorPanel data={sensor} />
          <WavePowerGauge waveHeight={sensor.waveHeight} wavePower={sensor.wavePower} supplyPower={sensor.supplyPower} />
          <AlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  )
}
