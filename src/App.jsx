import React, { useState } from 'react'
import { NavBar } from './components/NavBar.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { LiveFeed } from './pages/LiveFeed.jsx'
import { CitizenScience } from './pages/CitizenScience.jsx'
import { MySpecies } from './pages/MySpecies.jsx'
import { About } from './pages/About.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [points, setPoints] = useState(120)

  return (
    <div className="min-h-screen bg-grid text-white">
      {/* 배경 노이즈 레이어 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,170,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10">
        <NavBar activeTab={activeTab} onTabChange={setActiveTab} points={points} />
        <main>
          {activeTab === 'dashboard'  && <Dashboard />}
          {activeTab === 'live'       && <LiveFeed onTabChange={setActiveTab} />}
          {activeTab === 'citizen'    && <CitizenScience onPoints={n => setPoints(p => Math.max(0, p + n))} />}
          {activeTab === 'myspecies'  && <MySpecies onTabChange={setActiveTab} points={points} onPoints={n => setPoints(p => Math.max(0, p + n))} />}
          {activeTab === 'about'      && <About />}
        </main>
      </div>
    </div>
  )
}
