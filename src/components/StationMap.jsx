import React, { useEffect, useRef } from 'react'
import { STATIONS } from '../data/stations.js'
import { SPECIES } from '../data/species.js'

const STATUS_COLOR = {
  active: '#00d4aa',
  warning: '#f59e0b',
  offline: '#64748b',
}

export function StationMap({ sensorData }) {
  const mapRef = useRef(null)
  const leafletMapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (leafletMapRef.current) return
    if (!window.L) return

    const L = window.L
    const map = L.map(mapRef.current, {
      center: [37.2423, 37.2423],
      zoom: 14,
      zoomControl: true,
    })
    map.setView([37.2423, 131.8650], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    STATIONS.forEach(st => {
      const color = STATUS_COLOR[st.status]
      const species = SPECIES.slice(0, 3).map(s => s.korean).join(', ')

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:32px;height:32px;">
            <div style="
              position:absolute;inset:0;border-radius:50%;
              background:${color};opacity:0.25;
              animation:ripple 2s ease-out infinite;
            "></div>
            <div style="
              position:absolute;inset:6px;border-radius:50%;
              background:${color};
              box-shadow:0 0 12px ${color};
              border:2px solid rgba(255,255,255,0.3);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([st.lat, st.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="background:#0f2040;color:#e2e8f0;border:1px solid #1e3a5f;border-radius:8px;padding:10px;min-width:160px;font-family:'Noto Sans KR',sans-serif;">
            <div style="color:#00d4aa;font-weight:700;margin-bottom:6px;">${st.id} — ${st.name}</div>
            <div style="font-size:12px;color:#94a3b8;">수심: ${st.depth}m</div>
            <div style="font-size:12px;color:#94a3b8;">수온: ${st.temp}°C</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">최근 발견: ${species}</div>
            <div style="margin-top:6px;">
              <span style="background:${color};color:#0a1628;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;">
                ${st.status === 'active' ? '● 정상' : st.status === 'warning' ? '⚠ 경보' : '× 오프라인'}
              </span>
            </div>
          </div>
        `, { className: 'custom-popup' })

      markersRef.current.push(marker)
    })

    leafletMapRef.current = map
  }, [])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: 340 }}
      aria-label="독도 주변 해역 모니터링 스테이션 지도"
    />
  )
}
