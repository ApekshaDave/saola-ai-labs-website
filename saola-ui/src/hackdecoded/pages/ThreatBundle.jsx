import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function ThreatBundle() {
  const { t } = useLang()
  const navigate = useNavigate()

  const raw = localStorage.getItem('analysisResult')
  const result = raw ? JSON.parse(raw) : null
  const bundle = result?.threatBundle

  if (!bundle) {
    return (
      <div style={{ maxWidth: '700px', margin: '4rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid var(--cyber-red)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--cyber-red)', letterSpacing: '2px', marginBottom: '1rem', fontWeight: '700' }}>▸ NO DATA FOUND</div>
          <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '500' }}>
            Please analyze a threat article first, then come back here to see the threat intelligence bundle.
          </p>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid var(--cyber-blue)', borderRadius: '9999px', padding: '0.8rem 2rem', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 14px rgba(139,92,246,0.2)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.22)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(139,92,246,0.2)' }}
          >
            ◀ GO ANALYZE AN ARTICLE
          </button>
        </div>
      </div>
    )
  }

  const SECTIONS = [
    { key: 'threatActor', labelKey: 'stix_attacker', color: 'var(--cyber-red)', icon: '◎', isArray: false },
    { key: 'toolsUsed', labelKey: 'stix_tools', color: 'var(--cyber-orange)', icon: '◇', isArray: true },
    { key: 'targetsAffected', labelKey: 'stix_targets', color: 'var(--cyber-yellow)', icon: '◈', isArray: true },
    { key: 'iocList', labelKey: 'stix_iocs', color: 'var(--cyber-blue)', icon: '◆', isArray: true },
    { key: 'techniques', labelKey: 'stix_techniques', color: 'var(--cyber-purple)', icon: '◉', isArray: true },
    { key: 'timeline', labelKey: 'stix_timeline', color: 'var(--cyber-green)', icon: '○', isArray: false },
  ]

  const handleDownload = () => {
    const bundleData = {
      type: 'threat-intelligence-bundle',
      spec_version: '1.0',
      id: `bundle--${Date.now()}`,
      created: new Date().toISOString(),
      objects: [
        { type: 'threat-actor', name: bundle.threatActor },
        { type: 'attack-pattern', techniques: bundle.techniques },
        { type: 'indicator', iocs: bundle.iocList },
        { type: 'tool', tools: bundle.toolsUsed },
        { type: 'identity', targets: bundle.targetsAffected },
        { type: 'timeline', value: bundle.timeline },
      ]
    }
    const blob = new Blob([JSON.stringify(bundleData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `threat-bundle-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem 1.25rem' }}>

      {/* Back */}
      <button onClick={() => navigate('/explainer')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', marginBottom: '2rem', transition: 'color 0.2s', fontWeight: '600' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--cyber-blue)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--cyber-text-dim)'}
      >◀ {t('stix_back')}</button>

      {/* Header */}
      <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: 'var(--cyber-blue)', marginBottom: '0.75rem', fontWeight: '600' }}>{t('stix_label')}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', color: '#fff', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('stix_title')}</h1>
        <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: '500' }}>{t('stix_subtitle')}</p>
      </div>

      {/* What is this box */}
      <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', animation: 'fadeInUp 0.5s ease 0.05s both', boxShadow: '0 8px 24px rgba(139,92,246,0.06)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-blue)', marginBottom: '0.5rem', fontWeight: '600' }}>{t('stix_what')}</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--cyber-text-dim)', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>{t('stix_what_text')}</p>
      </div>

      {/* Bundle sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '1.5rem' }}>
        {SECTIONS.map((section, i) => {
          const value = bundle[section.key]
          if (!value || (Array.isArray(value) && value.length === 0)) return null

          return (
            <div key={section.key} style={{
              background: 'var(--cyber-card)', border: `1px solid ${section.color}44`,
              borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden',
              animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
              boxShadow: `0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 ${section.color}15`,
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = section.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 ${section.color}25` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${section.color}44`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 ${section.color}15` }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${section.color}, transparent)`, opacity: 0.8 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.9rem' }}>
                <span style={{ color: section.color, fontSize: '1.1rem' }}>{section.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700', color: section.color, letterSpacing: '2px' }}>{t(section.labelKey)}</span>
              </div>
              {section.isArray ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {value.map((item, j) => (
                    <div key={j} style={{ background: `${section.color}0a`, border: `1px solid ${section.color}22`, borderRadius: '10px', padding: '7px 12px', fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: '#e2e8f0', lineHeight: 1.5, fontWeight: '500' }}>
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>{value}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Download button */}
      <button onClick={handleDownload} style={{
        width: '100%', padding: '1.1rem',
        background: 'rgba(139,92,246,0.12)',
        border: '1px solid var(--cyber-blue)',
        borderRadius: '9999px', color: '#fff',
        fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: '700',
        letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.25s',
        boxShadow: '0 4px 16px rgba(139,92,246,0.2)'
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.25)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(139,92,246,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.2)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {t('stix_download')}
      </button>
    </div>
  )
}