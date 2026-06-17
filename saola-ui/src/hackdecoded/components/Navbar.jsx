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

  const bgColors = { student: '#00d4ff', it_professional: '#00ff88', manager: '#9944ff', developer: '#ffcc00', general: '#ff6600', security: '#ff2244' }
  const profileColor = bgColors[userProfile?.background?.id] || '#00d4ff'

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
      <nav style={{ background: 'rgba(3,5,9,0.94)', borderBottom: '1px solid var(--cyber-border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, padding: '0 1.25rem' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #00d4ff 30%, #9944ff 70%, transparent)', opacity: 0.6 }} />
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', border: '1px solid #00d4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 0 14px rgba(0,212,255,0.25), inset 0 0 10px rgba(0,212,255,0.06)' }}>
              <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '7px', height: '7px', borderTop: '2px solid #00d4ff', borderLeft: '2px solid #00d4ff' }} />
              <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '7px', height: '7px', borderBottom: '2px solid #00d4ff', borderRight: '2px solid #00d4ff' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#00d4ff', fontWeight: '800', textShadow: '0 0 10px rgba(0,212,255,0.9)' }}>HD</span>
            </div>
            <div style={{ display: 'block' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: '700', color: '#fff', letterSpacing: '3px', lineHeight: 1 }}>
                HACK<span style={{ color: '#00d4ff', textShadow: '0 0 12px rgba(0,212,255,0.7)' }}>DECODED</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--cyber-text-dim)', letterSpacing: '3px', marginTop: '2px' }}>{t('nav_subtitle')}</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div id="desk-links" style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            {links.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link key={link.path} to={link.path} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', textDecoration: 'none', color: isActive ? '#00d4ff' : 'var(--cyber-text-dim)', paddingBottom: '3px', borderBottom: isActive ? '1px solid #00d4ff' : '1px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap', textShadow: isActive ? '0 0 10px rgba(0,212,255,0.7)' : 'none' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--cyber-text-dim)' }}
                >{link.label || t(link.labelKey)}</Link>
              )
            })}
          </div>

          {/* Right — Profile + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {userProfile && (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowMenu(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: showMenu ? `${profileColor}18` : `${profileColor}0a`, border: `1px solid ${profileColor}55`, borderRadius: '3px', padding: '5px 10px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: showMenu ? `0 0 14px ${profileColor}25` : 'none' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${profileColor}18`, border: `1.5px solid ${profileColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '9px', color: profileColor, fontWeight: '700', boxShadow: `0 0 8px ${profileColor}40` }}>
                    {(userProfile.avatar || userProfile.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: profileColor, letterSpacing: '1px' }}>{userProfile.name?.slice(0, 10)?.toUpperCase()}</span>
                  <span style={{ fontSize: '8px', color: 'var(--cyber-text-dim)' }}>▾</span>
                </button>

                {showMenu && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#090f1e', border: '1px solid var(--cyber-border)', borderRadius: '6px', minWidth: '230px', overflow: 'hidden', zIndex: 200, boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 1px ${profileColor}30`, animation: 'fadeInUp 0.2s ease' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${profileColor}, transparent)` }} />
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--cyber-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${profileColor}15`, border: `2px solid ${profileColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '15px', color: profileColor, fontWeight: '800', boxShadow: `0 0 16px ${profileColor}40, inset 0 0 10px ${profileColor}10` }}>
                          {(userProfile.avatar || userProfile.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: profileColor, letterSpacing: '1px', textShadow: `0 0 8px ${profileColor}60` }}>{userProfile.name}</div>
                          {userProfile.email && <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--cyber-text-dim)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.email}</div>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: profileColor, background: `${profileColor}12`, border: `1px solid ${profileColor}33`, borderRadius: '2px', padding: '2px 8px' }}>{getBgLabel()}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '2px', padding: '2px 8px' }}>🌐 {language === 'hi' ? 'हिंदी' : 'English'}</span>
                      </div>
                    </div>
                    <button onClick={() => { setShowMenu(false); onLogout() }} style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,34,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ color: 'var(--cyber-red)', fontSize: '14px' }}>⏻</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', color: 'var(--cyber-red)' }}>{t('nav_logout')}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', marginTop: '1px' }}>{t('nav_logout_desc')}</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button id="hamburger" onClick={() => setMobileOpen(p => !p)} style={{ display: 'none', background: 'transparent', border: '1px solid var(--cyber-border)', borderRadius: '3px', padding: '7px 9px', cursor: 'pointer', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '18px', height: '1.5px', background: '#00d4ff', transition: 'all 0.2s',
                  transform: mobileOpen && i === 0 ? 'rotate(45deg) translate(3.5px, 3.5px)' : mobileOpen && i === 2 ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none',
                  opacity: mobileOpen && i === 1 ? 0 : 1
                }} />
              ))}
            </button>
          </div>
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyber-blue), transparent)', opacity: 0.25 }} />
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,5,9,0.97)', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.75rem', backdropFilter: 'blur(20px)', animation: 'fadeIn 0.2s ease' }}>
          <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: '1px solid var(--cyber-border)', borderRadius: '3px', padding: '7px 12px', color: 'var(--cyber-text-dim)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>✕</button>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#fff', letterSpacing: '3px', marginBottom: '0.5rem' }}>HACK<span style={{ color: '#00d4ff', textShadow: '0 0 15px rgba(0,212,255,0.8)' }}>DECODED</span></div>
          {links.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '4px', color: isActive ? '#00d4ff' : 'var(--cyber-text-dim)', textDecoration: 'none', transition: 'all 0.2s', textShadow: isActive ? '0 0 12px rgba(0,212,255,0.8)' : 'none' }}>
                {link.label || t(link.labelKey)}
              </Link>
            )
          })}
          {userProfile && (
            <button onClick={() => { setMobileOpen(false); onLogout() }} style={{ marginTop: '0.5rem', background: 'rgba(255,34,68,0.1)', border: '1px solid var(--cyber-red)', borderRadius: '4px', padding: '10px 28px', color: 'var(--cyber-red)', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>
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