import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { flushSync } from 'react-dom'

export default function Navbar({ userProfile, onLogout }) {
  const location = useLocation()
  const { t, language } = useLang()
  const [showMenu, setShowMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)

  const links = [
    { path: '/', labelKey: 'nav_analyze' },
    { path: '/explore', labelKey: 'nav_explore' },
    { path: '/news', label: language === 'hi' ? 'समाचार' : 'NEWS' },
    { path: '/cve', labelKey: 'nav_cve' },
    { path: '/learn', labelKey: 'nav_learn' },
    { path: '/about', labelKey: 'nav_about' },
  ]

  const bgColors = { 
    student: '#c084fc', 
    it_professional: '#10b981', 
    manager: '#f472b6', 
    developer: '#eab308', 
    general: '#f97316', 
    security: '#f43f5e' 
  }
  const profileColor = bgColors[userProfile?.background?.id] || 'var(--cyber-blue)'

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useLayoutEffect(() => { flushSync(() => setMobileOpen(false)) }, [location.pathname])

  const getBgLabel = () => {
    const map = { student: t('bg_student'), it_professional: t('bg_it'), manager: t('bg_manager'), developer: t('bg_developer'), general: t('bg_general'), security: t('bg_security') }
    return map[userProfile?.background?.id] || ''
  }

  return (
    <>
      <div style={{ position: 'sticky', top: '16px', zIndex: 100, width: '100%', padding: '0 1.25rem', display: 'flex', justifyContent: 'center' }}>
        <nav style={{
          background: 'rgba(12, 8, 28, 0.7)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '9999px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          maxWidth: '1160px',
          width: '100%',
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            {/* Glowing Orb icon instead of retro box */}
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: 'radial-gradient(circle, var(--cyber-blue) 0%, rgba(139,92,246,0.3) 70%, transparent 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 0 16px var(--cyber-blue-glow)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }} />
            </div>
            <div style={{ display: 'block' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: '800', color: '#fff', letterSpacing: '2px', lineHeight: 1 }}>
                HACK<span style={{ color: 'var(--cyber-blue)', textShadow: '0 0 12px rgba(139,92,246,0.5)' }}>DECODED</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--cyber-text-dim)', letterSpacing: '1px', marginTop: '2px' }}>{t('nav_subtitle')}</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div id="desk-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {links.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link key={link.path} to={link.path} style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '11px', 
                  fontWeight: '600',
                  letterSpacing: '1px', 
                  textDecoration: 'none', 
                  color: isActive ? '#fff' : 'var(--cyber-text-dim)', 
                  padding: '6px 12px', 
                  borderRadius: '9999px',
                  background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                  transition: 'all 0.25s', 
                  whiteSpace: 'nowrap', 
                  textShadow: isActive ? '0 0 10px rgba(139,92,246,0.3)' : 'none' 
                }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--cyber-text-dim)'; e.currentTarget.style.background = 'transparent' } }}
                >{link.label || t(link.labelKey)}</Link>
              )
            })}
          </div>

          {/* Right — Profile + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {userProfile && (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowMenu(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: showMenu ? `${profileColor}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${showMenu ? profileColor : 'rgba(255,255,255,0.08)'}`, borderRadius: '9999px', padding: '4px 12px 4px 6px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: showMenu ? `0 0 14px ${profileColor}25` : 'none' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${profileColor}18`, border: `1.5px solid ${profileColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '9px', color: profileColor, fontWeight: '700', boxShadow: `0 0 8px ${profileColor}40` }}>
                    {(userProfile.avatar || userProfile.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '11px', color: '#fff', letterSpacing: '0.5px' }}>{userProfile.name?.slice(0, 10)}</span>
                  <span style={{ fontSize: '8px', color: 'var(--cyber-text-dim)' }}>▼</span>
                </button>

                {showMenu && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#0e091e', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', minWidth: '230px', overflow: 'hidden', zIndex: 200, boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 1px ${profileColor}30`, animation: 'fadeInUp 0.2s ease' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${profileColor}, transparent)` }} />
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--cyber-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${profileColor}15`, border: `2px solid ${profileColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '15px', color: profileColor, fontWeight: '800', boxShadow: `0 0 16px ${profileColor}40, inset 0 0 10px ${profileColor}10` }}>
                          {(userProfile.avatar || userProfile.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '12px', color: '#fff', letterSpacing: '0.5px', textShadow: `0 0 8px ${profileColor}60` }}>{userProfile.name}</div>
                          {userProfile.email && <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--cyber-text-dim)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.email}</div>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: profileColor, background: `${profileColor}12`, border: `1px solid ${profileColor}33`, borderRadius: '2px', padding: '2px 8px' }}>{getBgLabel()}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '2px', padding: '2px 8px' }}>🌐 {language === 'hi' ? 'हिंदी' : 'English'}</span>
                      </div>
                    </div>
                    <button onClick={() => { setShowMenu(false); onLogout() }} style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ color: 'var(--cyber-red)', fontSize: '14px' }}>⏻</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', color: 'var(--cyber-red)' }}>{t('nav_logout')}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--cyber-text-dim)', marginTop: '1px' }}>{t('nav_logout_desc')}</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button id="hamburger" onClick={() => setMobileOpen(p => !p)} style={{ display: 'none', background: 'transparent', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '9999px', padding: '10px 12px', cursor: 'pointer', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '16px', height: '1.5px', background: 'var(--cyber-blue)', transition: 'all 0.2s',
                  transform: mobileOpen && i === 0 ? 'rotate(45deg) translate(3.5px, 3.5px)' : mobileOpen && i === 2 ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none',
                  opacity: mobileOpen && i === 1 ? 0 : 1
                }} />
              ))}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 2, 12, 0.98)', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.75rem', backdropFilter: 'blur(20px)', animation: 'fadeIn 0.2s ease' }}>
          <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '9999px', padding: '7px 12px', color: 'var(--cyber-text-dim)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>✕</button>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#fff', letterSpacing: '2px', marginBottom: '0.5rem' }}>HACK<span style={{ color: 'var(--cyber-blue)', textShadow: '0 0 15px rgba(139,92,246,0.8)' }}>DECODED</span></div>
          {links.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '600', letterSpacing: '2px', color: isActive ? 'var(--cyber-blue)' : 'var(--cyber-text-dim)', textDecoration: 'none', transition: 'all 0.2s', textShadow: isActive ? '0 0 12px rgba(139,92,246,0.8)' : 'none' }}>
                {link.label || t(link.labelKey)}
              </Link>
            )
          })}
          {userProfile && (
            <button onClick={() => { setMobileOpen(false); onLogout() }} style={{ marginTop: '0.5rem', background: 'rgba(244,63,94,0.1)', border: '1px solid var(--cyber-red)', borderRadius: '9999px', padding: '10px 28px', color: 'var(--cyber-red)', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer' }}>
              {t('nav_logout')}
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          #desk-links { display: none !important; }
          #hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}