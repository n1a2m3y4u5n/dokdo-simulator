import React, { useState } from 'react'
import { CameraView } from '../components/CameraView.jsx'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { EDNA_DATA } from '../data/stations.js'
import { Dna, CheckCircle2 } from 'lucide-react'

const COLORS = ['#00d4aa','#60a5fa','#a78bfa','#f59e0b','#e85d04','#e63946','#52b788']

const CustomLabel = ({ cx, cy, value }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
    style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, fill: '#fff' }}>
    23
    <tspan x={cx} dy={18} style={{ fontSize: 10, fill: '#64748b', fontFamily: 'Noto Sans KR' }}>종 검출</tspan>
  </text>
)

export function LiveFeed() {
  const [selectedCam, setSelectedCam] = useState('CAM-01')

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <div className="flex gap-4">
        {/* 좌측: 카메라 뷰 */}
        <div className="flex-1 min-w-0">
          <CameraView selectedCam={selectedCam} onCamChange={setSelectedCam} />
        </div>

        {/* 우측: eDNA + 상태 */}
        <div className="w-72 shrink-0 space-y-3">
          {/* eDNA 도넛 차트 */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.12)' }}>
                <Dna size={13} className="text-teal-400" />
              </div>
              <span className="section-label">eDNA 분석 결과</span>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={EDNA_DATA} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                  paddingAngle={3} dataKey="value" labelLine={false} label={<CustomLabel />}>
                  {EDNA_DATA.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(5,15,30,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12, fontFamily: 'Noto Sans KR' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={v => [`${v}%`, '비율']}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} iconSize={7} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 mt-2">
              {[
                ['검출 종', '23종', '#00d4aa'],
                ['총 시퀀스', '12,847개', '#e2e8f0'],
                ['최근 채수', '06:00', '#94a3b8'],
              ].map(([k, v, c]) => (
                <div key={k} className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-mono font-semibold" style={{ color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 교차 검증 */}
          <div className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-teal-400" />
              <span className="section-label">카메라 × eDNA 교차검증</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">종 일치율</span>
                <span className="font-mono font-bold text-teal-400">87%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{
                  width: '87%',
                  background: 'linear-gradient(90deg, #60a5fa, #00d4aa)',
                  boxShadow: '0 0 8px rgba(0,212,170,0.4)',
                }} />
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              AI 탐지와 eDNA 메타바코딩 결과의 종 레벨 일치 비율입니다.
            </p>
          </div>

          {/* 스테이션 상태 */}
          <div className="glass rounded-2xl p-4">
            <span className="section-label block mb-3">스테이션 상태</span>
            <div className="space-y-2">
              {[
                { id: 'CAM-01', name: '동도 북방 A', ok: true },
                { id: 'CAM-02', name: '동도 서측 B', ok: true },
                { id: 'CAM-03', name: '서도 남방 C', ok: true },
                { id: 'CAM-04', name: '서도 북방 D', ok: false },
              ].map(st => (
                <div key={st.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: st.ok ? '#00d4aa' : '#f59e0b',
                      boxShadow: `0 0 6px ${st.ok ? '#00d4aa' : '#f59e0b'}`,
                      animation: !st.ok ? 'pulse 2s infinite' : undefined }} />
                  <span className="text-xs text-slate-500 font-mono">{st.id}</span>
                  <span className="text-xs text-slate-300">{st.name}</span>
                  <span className="ml-auto text-xs font-semibold" style={{ color: st.ok ? '#00d4aa' : '#f59e0b' }}>
                    {st.ok ? '정상' : '경보'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
