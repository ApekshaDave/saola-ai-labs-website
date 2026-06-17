import { useLang } from '../context/LanguageContext'
import { PageHeader } from '../components/CyberComponents'

const SECTIONS = [
  { titleKey: 'about_problem_title',   descKey: 'about_problem_desc',   color: '#ff2244' },
  { titleKey: 'about_solution_title',  descKey: 'about_solution_desc',  color: '#00d4ff' },
  { titleKey: 'about_who_title',       descKey: 'about_who_desc',       color: '#00ff88' },
  { titleKey: 'about_how_title',       descKey: 'about_how_desc',       color: '#9944ff' },
  { titleKey: 'about_features_title',  descKey: 'about_features_desc',  color: '#ffcc00' },
  { titleKey: 'about_disclaimer_title',descKey: 'about_disclaimer_desc',color: '#ff6600' },
]

export default function About() {
  const { t } = useLang()
  return (
    <div className="page-container" style={{ maxWidth: '760px' }}>
      <PageHeader label={t('about_label')} title={t('about_title')} color="#00d4ff" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SECTIONS.map((s, i) => (
          <div key={s.titleKey} style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '6px', padding: '1.4rem', position: 'relative', overflow: 'hidden', animationDelay: `${i * 0.07}s`, transition: 'all 0.2s' }}
            className="anim-fade-up"
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '44'; e.currentTarget.style.transform = 'translateX(2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.transform = 'none' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: 0, top: 0, width: '3px', height: '100%', background: `linear-gradient(to bottom, ${s.color}, ${s.color}22)` }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: s.color, marginBottom: '0.6rem', textShadow: `0 0 6px ${s.color}60` }}>▸ {t(s.titleKey)}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.93rem', color: 'var(--cyber-text)', lineHeight: 1.7, margin: 0 }}>{t(s.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}