import { useLang } from '../context/LanguageContext'

export function RiskBadge({ level }) {
  const config = {
    Low:      { color: '#00ff88', bg: 'rgba(0,255,136,0.08)',  label: 'LOW RISK',      glow: 'rgba(0,255,136,0.4)' },
    Medium:   { color: '#ffcc00', bg: 'rgba(255,204,0,0.08)',  label: 'MEDIUM RISK',   glow: 'rgba(255,204,0,0.4)' },
    High:     { color: '#ff6600', bg: 'rgba(255,102,0,0.08)',  label: 'HIGH RISK',     glow: 'rgba(255,102,0,0.4)' },
    Critical: { color: '#ff2244', bg: 'rgba(255,34,68,0.08)',  label: 'CRITICAL RISK', glow: 'rgba(255,34,68,0.5)' },
  }
  const c = config[level] || config.Medium
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: c.bg, border: `1px solid ${c.color}55`, borderRadius: '3px', padding: '6px 14px', boxShadow: `0 0 16px ${c.glow}22` }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.glow}`, animation: level === 'Critical' ? 'criticalPulse 1.5s ease-in-out infinite' : 'none' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: '700', color: c.color, letterSpacing: '2px', textShadow: `0 0 8px ${c.glow}` }}>{c.label}</span>
    </div>
  )
}

export function AttackFlow({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {steps.map((step, i) => (
        <div key={i}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'rgba(0,212,255,0.03)', border: '1px solid var(--cyber-border)', borderLeft: '2px solid #00d4ff', borderRadius: '3px', padding: '14px 16px', transition: 'all 0.2s', animationDelay: `${i * 0.08}s` }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; e.currentTarget.style.borderLeftColor = '#9944ff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.03)'; e.currentTarget.style.borderLeftColor = '#00d4ff' }}
          >
            <div style={{ minWidth: '30px', height: '30px', border: '1px solid #00d4ff', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00d4ff', flexShrink: 0, background: 'rgba(0,212,255,0.06)', boxShadow: '0 0 8px rgba(0,212,255,0.15)' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--cyber-text)', lineHeight: 1.5, margin: 0 }}>{step}</p>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: '1px', height: '10px', background: 'linear-gradient(to bottom, #00d4ff, #9944ff44)', margin: '0 auto', opacity: 0.5 }} />
          )}
        </div>
      ))}
    </div>
  )
}

export function LoadingSpinner() {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <div style={{ position: 'absolute', inset: 0, border: '1px solid #00d4ff', borderTopColor: 'transparent', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spin 1.8s linear infinite', boxShadow: '0 0 16px rgba(0,212,255,0.3)' }} />
        <div style={{ position: 'absolute', inset: '10px', border: '1px solid #9944ff', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1.2s linear infinite reverse', opacity: 0.7 }} />
        <div style={{ position: 'absolute', inset: '20px', border: '1px solid #00ff88', borderLeftColor: 'transparent', borderRadius: '50%', animation: 'spin 0.9s linear infinite', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '11px', color: '#00d4ff', fontWeight: '800', textShadow: '0 0 10px rgba(0,212,255,0.9)' }}>HD</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: '#00d4ff', letterSpacing: '4px', marginBottom: '6px', textShadow: '0 0 12px rgba(0,212,255,0.7)' }}>{t('loading_title')}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-text-dim)' }}>{t('loading_desc')}</div>
      </div>
      <div style={{ width: '200px', height: '2px', background: 'var(--cyber-border)', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #00d4ff, #9944ff)', animation: 'loadingBar 2s ease-in-out infinite', borderRadius: '1px', boxShadow: '0 0 8px rgba(0,212,255,0.5)' }} />
      </div>
    </div>
  )
}

export function InfoCard({ title, icon, color, children, badge }) {
  return (
    <div style={{ background: 'var(--cyber-card)', border: `1px solid ${color}25`, borderRadius: '6px', padding: '1.25rem', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.boxShadow = `0 4px 20px ${color}10` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.5 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1rem', color, textShadow: `0 0 8px ${color}80` }}>{icon}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: '600', color, letterSpacing: '2px', textShadow: `0 0 8px ${color}60` }}>{title}</span>
        </div>
        {badge && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color, background: `${color}12`, border: `1px solid ${color}33`, borderRadius: '2px', padding: '2px 8px' }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  )
}

export function SectionCard({ children, accentColor = '#00d4ff', style = {} }) {
  return (
    <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '6px', padding: '1.5rem', position: 'relative', overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.5 }} />
      {children}
    </div>
  )
}

export function PageHeader({ label, title, subtitle, color = '#00d4ff' }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color, marginBottom: '0.6rem', textShadow: `0 0 8px ${color}60` }}>▸ {label}</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: '800', color: '#fff', letterSpacing: '2px', marginBottom: '0.5rem', lineHeight: 1.15 }}>{title}</h1>
      {subtitle && <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  )
}