import { useLang } from '../context/LanguageContext'
import { PageHeader } from '../components/CyberComponents'

const CONCEPTS = [
  { term: 'learn_cve', color: 'var(--cyber-red)', icon: '◆' },
  { term: 'learn_ioc', color: 'var(--cyber-orange)', icon: '◈' },
  { term: 'learn_mitre', color: 'var(--cyber-purple)', icon: '◉' },
  { term: 'learn_ransomware', color: 'var(--cyber-yellow)', icon: '◇' },
  { term: 'learn_phishing', color: 'var(--cyber-blue)', icon: '○' },
  { term: 'learn_zeroday', color: 'var(--cyber-green)', icon: '◎' },
]

export default function Learn() {
  const { t } = useLang()
  return (
    <div className="page-container" style={{ padding: '3.5rem 1.25rem' }}>
      <PageHeader label={t('learn_label')} title={t('learn_title')} subtitle={t('learn_subtitle')} color="var(--cyber-blue)" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {CONCEPTS.map((c, i) => (
          <div key={c.term} style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '12px', padding: '1.5rem', position: 'relative', overflow: 'hidden', transition: 'all 0.25s', animationDelay: `${i * 0.07}s` }}
            className="anim-fade-up"
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + '55'; e.currentTarget.style.boxShadow = `0 8px 30px ${c.color}10` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${c.color}, transparent)`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: 0, top: 0, width: '3px', height: '100%', background: `linear-gradient(to bottom, ${c.color}, ${c.color}33)` }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ color: c.color, fontSize: '1.1rem', textShadow: `0 0 10px ${c.color}60` }}>{c.icon}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: '800', color: c.color, letterSpacing: '0.5px' }}>{t(c.term)}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', letterSpacing: '0.5px', fontWeight: '600' }}>{t(`${c.term}_full`)}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: c.color, background: `${c.color}10`, border: `1px solid ${c.color}30`, borderRadius: '4px', padding: '3px 10px', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: '600' }}>
                {t('learn_format')}: {t(`${c.term}_format`)}
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#fff', lineHeight: 1.65, marginBottom: '1.25rem', fontWeight: '500' }}>{t(`${c.term}_simple`)}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ background: `${c.color}07`, border: `1px solid ${c.color}18`, borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: c.color, marginBottom: '7px', fontWeight: '600' }}>{t('learn_analogy')}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text-dim)', lineHeight: 1.55, fontStyle: 'italic', margin: 0 }}>{t(`${c.term}_analogy`)}</p>
              </div>
              <div style={{ background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: 'var(--cyber-blue)', marginBottom: '7px', fontWeight: '600' }}>{t('learn_example')}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text-dim)', lineHeight: 1.55, margin: 0 }}>{t(`${c.term}_example`)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}