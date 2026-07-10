import { useState, useEffect, useRef } from 'react'
import { CURRENT_DIRECTIONS } from '../data/stations.js'

const BASE = { temp: 14.3, turbidity: 2.1, waveHeight: 1.8, currentVelocity: 12.3 }

function randRange(base, delta) {
  return +(base + (Math.random() - 0.5) * 2 * delta).toFixed(2)
}

function genHistory(base, delta, n = 24) {
  return Array.from({ length: n }, (_, i) => ({
    time: `${String(i).padStart(2,'0')}:00`,
    value: randRange(base, delta),
  }))
}

export function useSensorData() {
  const [data, setData] = useState({
    temp:            BASE.temp,
    turbidity:       BASE.turbidity,
    waveHeight:      BASE.waveHeight,
    currentVelocity: BASE.currentVelocity,
    currentDir:      'NE',
    wavePower:       24.5,
    supplyPower:     18.3,
    tempHistory:     genHistory(BASE.temp, 0.4),
    turbHistory:     genHistory(BASE.turbidity, 0.5),
    waveHistory:     genHistory(BASE.waveHeight, 0.6),
    currentHistory:  genHistory(BASE.currentVelocity, 3),
  })

  const tick = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      tick.current += 1
      const t = tick.current
      const waveH  = +(BASE.waveHeight + Math.sin(t * 0.3) * 0.6).toFixed(2)
      const power  = +(waveH * 13.5 + Math.random() * 2).toFixed(1)
      const newCur = randRange(BASE.currentVelocity, 3.5)

      setData(prev => {
        const now   = new Date()
        const label = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
        const add   = (hist, val) => [...hist.slice(-23), { time: label, value: val }]

        const newTemp = randRange(BASE.temp, 0.2)
        const newTurb = randRange(BASE.turbidity, 0.3)

        /* 유향은 40틱마다 한 번씩 변화 */
        const dirIdx   = Math.floor(t / 40) % CURRENT_DIRECTIONS.length
        const nextIdx  = (dirIdx + (t % 40 === 0 ? 1 : 0)) % CURRENT_DIRECTIONS.length

        return {
          ...prev,
          temp:            newTemp,
          turbidity:       newTurb,
          waveHeight:      waveH,
          currentVelocity: newCur,
          currentDir:      CURRENT_DIRECTIONS[nextIdx],
          wavePower:       power,
          supplyPower:     +(power * 0.74 + Math.random()).toFixed(1),
          tempHistory:     add(prev.tempHistory,    newTemp),
          turbHistory:     add(prev.turbHistory,    newTurb),
          waveHistory:     add(prev.waveHistory,    waveH),
          currentHistory:  add(prev.currentHistory, newCur),
        }
      })
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return data
}
