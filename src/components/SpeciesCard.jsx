import React from 'react'
import { SPECIES } from '../data/species.js'
import { STATIONS } from '../data/stations.js'
import { MapPin, Calendar, RefreshCw } from 'lucide-react'

export function SpeciesCard({ entry, onClick }) {
  const sp = SPECIES.find(s => s.id === entry.speciesId)
  const st = STATIONS.find(s => s.id === entry.stationId)

  return (
    <button onClick={onClick} aria-label={`${entry.nickname} 상세보기`}
      className="glass glass-hover w-full text-left p-4 rounded-2xl"
      style={{ cursor: 'pointer' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: sp?.color + '18', border: `1px solid ${sp?.color}30` }}>
          {sp?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-base leading-none mb-0.5">{entry.nickname}</div>
          <div className="text-sm text-slate-400">{sp?.korean}</div>
          <div className="text-xs text-slate-600 italic">{sp?.scientific}</div>
        </div>
        <div className="flex items-center gap-1 badge badge-teal text-xs shrink-0">
          <RefreshCw size={10} />
          {entry.resightings}회
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={10} />{st?.name}</span>
        <span className="flex items-center gap-1"><Calendar size={10} />{entry.registeredAt}</span>
      </div>
    </button>
  )
}
