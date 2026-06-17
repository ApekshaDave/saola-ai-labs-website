import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { explainCyberAttack } from '../services/groqService'
import { useLang } from '../context/LanguageContext'
import { RiskBadge, AttackFlow, LoadingSpinner, InfoCard } from '../components/CyberComponents'

const Block = ({ children, accentColor = '#00d4ff', style = {} }) => (
  <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '6px', padding: '1.4rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s', ...style }}
    onMouseEnter={e => e.currentTarget.style.borderColor = accentColor + '44'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--cyber-border)'}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.5 }} />
    {children}
  </div>
)

const Label = ({ text, color = '#00d4ff' }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color, marginBottom: '0.875rem', textShadow: `0 0 8px ${color}50` }}>{text}</div>
)

export default function Explainer({ userProfile }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { t, language } = useLang()

  useEffect(() => {
    const articleText = localStorage.getItem('articleText')
    if (!articleText) { navigate('/'); return }
    async function analyze() {
      try {
        setLoading(true)
        const data = await explainCyberAttack(articleText, { ...userProfile, language })
        setResult(data)
        localStorage.setItem('analysisResult', JSON.stringify(data))
      } catch (err) { setError(err.message || 'Something went wrong.') }
      finally { setLoading(false) }
    }
    analyze()
  }, [navigate, userProfile, language])

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      <div style={{ background: 'rgba(255,34,68,0.08)', border: '1px solid rgba(255,34,68,0.3)', borderRadius: '8px', padding: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#ff2244', letterSpacing: '3px', marginBottom: '1rem' }}>{t('exp_error_title')}</div>
        <p style={{ color: 'var(--cyber-text)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,34,68,0.1)', border: '1px solid #ff2244', borderRadius: '4px', padding: '0.7rem 1.5rem', color: '#ff2244', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer' }}>◀ {t('exp_return')}</button>
      </div>
    </div>
  )

  if (!result) return null

  return (
    <div className="page-container">

      {/* Back */}
      <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', marginBottom: '1.75rem', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--cyber-text-dim)'}
      >◀ {t('exp_back')}</button>

      {/* Hero Summary */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(153,68,255,0.04) 100%)', border: '1px solid var(--cyber-border)', borderRadius: '8px', padding: '1.75rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #00d4ff, #9944ff, #00d4ff)', backgroundSize: '200% 100%' }} />
        <Label text={t('exp_complete')} color="#00d4ff" />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)', fontWeight: '500', color: '#fff', lineHeight: 1.5, marginBottom: '1.25rem' }}>{result.simpleSummary}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <RiskBadge level={result.riskLevel} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-text-dim)' }}>{result.riskReason}</span>
        </div>
      </div>

      {/* Incident Overview */}
      <Block accentColor="#00d4ff">
        <Label text={t('exp_overview')} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.93rem', color: 'var(--cyber-text)', lineHeight: 1.7, marginBottom: '1.1rem' }}>{result.whatHappened}</p>
        <div className="grid-2">
          {[
            { labelKey: 'exp_attacker', value: result.whoAttacked, color: '#ff2244' },
            { labelKey: 'exp_victim',   value: result.whoIsVictim, color: '#ff6600' },
          ].map((item, i) => (
            <div key={i} style={{ background: `${item.color}06`, border: `1px solid ${item.color}33`, borderRadius: '4px', padding: '0.875rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '3px', color: item.color, marginBottom: '5px', textShadow: `0 0 6px ${item.color}60` }}>{t(item.labelKey)}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#fff', margin: 0, lineHeight: 1.4 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* Analogy */}
      <div style={{ background: 'rgba(153,68,255,0.05)', border: '1px solid rgba(153,68,255,0.2)', borderRadius: '6px', padding: '1.4rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #9944ff, transparent)', opacity: 0.6 }} />
        <Label text={t('exp_analogy')} color="#9944ff" />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--cyber-text)', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>"{result.realLifeAnalogy}"</p>
      </div>

      {/* Timeline */}
      <Block accentColor="#00d4ff">
        <Label text={t('exp_timeline')} />
        <AttackFlow steps={result.attackSteps} />
      </Block>

      {/* Intel label */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: 'var(--cyber-text-dim)', marginBottom: '0.75rem' }}>{t('exp_intel')}</div>

      {/* IOC CVE ATTCK */}
      <div className="grid-auto" style={{ marginBottom: '1rem' }}>
        <InfoCard title={t('exp_ioc_title')} icon="◈" color="#ff6600" badge={result.iocExplained?.found ? t('exp_found') : t('exp_none')}>
          <div style={{ background: 'rgba(255,102,0,0.05)', border: '1px solid rgba(255,102,0,0.12)', borderRadius: '3px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#ff6600', marginBottom: '4px' }}>{t('exp_ioc_what')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{t('exp_ioc_simple')}</p>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--cyber-text)', lineHeight: 1.5, marginBottom: result.iocExplained?.examples?.length ? '0.75rem' : 0 }}>{result.iocExplained?.description}</p>
          {result.iocExplained?.examples?.map((ex, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#ff6600', background: 'rgba(255,102,0,0.07)', borderRadius: '2px', padding: '4px 8px', marginBottom: '4px' }}>{ex}</div>
          ))}
        </InfoCard>

        <InfoCard title={t('exp_cve_title')} icon="◆" color="#ff2244" badge={result.cveExplained?.found ? t('exp_identified') : t('exp_none')}>
          <div style={{ background: 'rgba(255,34,68,0.05)', border: '1px solid rgba(255,34,68,0.12)', borderRadius: '3px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#ff2244', marginBottom: '4px' }}>{t('exp_cve_what')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{t('exp_cve_simple')}</p>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--cyber-text)', lineHeight: 1.5, marginBottom: result.cveExplained?.examples?.length ? '0.75rem' : 0 }}>{result.cveExplained?.description}</p>
          {result.cveExplained?.examples?.map((ex, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#ff2244', background: 'rgba(255,34,68,0.07)', borderRadius: '2px', padding: '4px 8px', marginBottom: '4px' }}>{ex}</div>
          ))}
        </InfoCard>

        <InfoCard title={t('exp_attck_title')} icon="◉" color="#9944ff" badge={t('exp_tactics')}>
          <div style={{ background: 'rgba(153,68,255,0.05)', border: '1px solid rgba(153,68,255,0.12)', borderRadius: '3px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#9944ff', marginBottom: '4px' }}>{t('exp_attck_what')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{t('exp_attck_simple')}</p>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--cyber-text)', lineHeight: 1.5, marginBottom: result.attckExplained?.techniques?.length ? '0.75rem' : 0 }}>{result.attckExplained?.description}</p>
          {result.attckExplained?.techniques?.map((tech, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cyber-text)', background: 'rgba(153,68,255,0.07)', borderRadius: '2px', padding: '6px 10px', borderLeft: '2px solid #9944ff', marginBottom: '6px' }}>{tech}</div>
          ))}
        </InfoCard>
      </div>

      {/* Jargon */}
      {result.techTermsExplained && Object.keys(result.techTermsExplained).length > 0 && (
        <Block accentColor="#00d4ff">
          <Label text={t('exp_jargon')} />
          <div className="grid-auto">
            {Object.entries(result.techTermsExplained).map(([term, explanation]) => (
              <div key={term} style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '3px', padding: '0.875rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: '600', color: '#00d4ff', letterSpacing: '1px', marginBottom: '4px' }}>{term}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{explanation}</p>
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* Risk */}
      <div style={{ background: 'rgba(255,204,0,0.04)', border: '1px solid rgba(255,204,0,0.2)', borderRadius: '6px', padding: '1.4rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #ffcc00, transparent)', opacity: 0.5 }} />
        <Label text={t('exp_risk')} color="#ffcc00" />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.93rem', color: 'var(--cyber-text)', lineHeight: 1.6, margin: 0 }}>{result.whoIsAtRisk}</p>
      </div>

      {/* Safe */}
      <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '6px', padding: '1.4rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #00ff88, transparent)', opacity: 0.5 }} />
        <Label text={t('exp_safe')} color="#00ff88" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {result.howToStaySafe.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: '3px', padding: '0.75rem 1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#00ff88', flexShrink: 0, marginTop: '1px', textShadow: '0 0 8px rgba(0,255,136,0.6)' }}>✓</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text)', lineHeight: 1.5, margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid-2">
        <button onClick={() => navigate('/quiz')} style={{ padding: '1rem', background: 'rgba(153,68,255,0.08)', border: '1px solid rgba(153,68,255,0.4)', borderRadius: '6px', color: '#9944ff', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(153,68,255,0.15)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(153,68,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(153,68,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
        >{t('exp_quiz_btn')}</button>
        <button onClick={() => navigate('/threat-bundle')} style={{ padding: '1rem', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.35)', borderRadius: '6px', color: '#00d4ff', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.12)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
        >{t('exp_stix_btn')}</button>
      </div>
    </div>
  )
}