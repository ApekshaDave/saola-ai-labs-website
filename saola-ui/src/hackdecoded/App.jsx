import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { LanguageProvider, useLang } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Explainer from './pages/Explainer'
import Learn from './pages/Learn'
import About from './pages/About'
import Quiz from './pages/Quiz'
import CVESearch from './pages/CVESearch'
import ExploreThreats from './pages/ExploreThreats'
import ThreatBundle from './pages/ThreatBundle'
import CyberNews from './pages/CyberNews'
import './index.css'

function AppContent() {
  const { setLanguage } = useLang()

  const getSavedProfile = () => {
    const saved = localStorage.getItem('userProfile')
    return saved ? JSON.parse(saved) : null
  }

  const [userProfile, setUserProfile] = useState(getSavedProfile)

  const handleComplete = (profile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    setUserProfile(profile)
    setLanguage(profile.language || 'en')
  }

  const handleLogout = () => {
    localStorage.removeItem('userProfile')
    localStorage.removeItem('articleText')
    localStorage.removeItem('analysisResult')
    setUserProfile(null)
    setLanguage('en')
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Routes>
        <Route path="/onboarding" element={<Onboarding onComplete={handleComplete} />} />
        <Route
          path="/*"
          element={
            !userProfile ? <Navigate to="/onboarding" replace /> : (
              <>
                <Navbar userProfile={userProfile} onLogout={handleLogout} />
                <Routes>
                  <Route path="/"              element={<Home userProfile={userProfile} />} />
                  <Route path="/explainer"     element={<Explainer userProfile={userProfile} />} />
                  <Route path="/quiz"          element={<Quiz userProfile={userProfile} />} />
                  <Route path="/learn"         element={<Learn />} />
                  <Route path="/about"         element={<About />} />
                  <Route path="/cve"           element={<CVESearch />} />
                  <Route path="/explore"       element={<ExploreThreats />} />
                  <Route path="/threat-bundle" element={<ThreatBundle />} />
                  <Route path="/news"          element={<CyberNews />} />
                </Routes>
              </>
            )
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <div className="hackdecoded-theme min-h-screen text-white relative overflow-hidden" style={{ background: '#030509', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="hackdecoded-theme-glow-1" style={{ position: 'fixed', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="hackdecoded-theme-glow-2" style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(153,68,255,0.04) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <LanguageProvider>
        <MemoryRouter>
          <AppContent />
        </MemoryRouter>
      </LanguageProvider>
    </div>
  )
}

export default App