import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { explainCyberAttack } from '../services/groqService'
import { useLang } from '../context/LanguageContext'
import { RiskBadge, AttackFlow, LoadingSpinner, InfoCard } from '../components/CyberComponents'

const Block = ({ children, accentColor = 'var(--cyber-blue)', style = {} }) => (
  <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.25s', ...style }}
    onMouseEnter={e => e.currentTarget.style.borderColor = accentColor + '44'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--cyber-border)'}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.5 }} />
    {children}
  </div>
)

const Label = ({ text, color = 'var(--cyber-blue)' }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color, marginBottom: '0.875rem', textShadow: `0 0 8px ${color}30`, fontWeight: '600' }}>{text}</div>
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
      <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '12px', padding: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--cyber-red)', letterSpacing: '1px', marginBottom: '1rem', fontWeight: '700' }}>{t('exp_error_title')}</div>
        <p style={{ color: 'var(--cyber-text)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid var(--cyber-red)', borderRadius: '9999px', padding: '0.7rem 1.75rem', color: 'var(--cyber-red)', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', fontWeight: '700' }}>◀ {t('exp_return')}</button>
      </div>
    </div>
  )

  if (!result) return null

  return (
    <div className="page-container" style={{ padding: '3.5rem 1.25rem' }}>

      {/* Back */}
      <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', cursor: 'pointer', marginBottom: '1.75rem', transition: 'color 0.2s', fontWeight: '600' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--cyber-blue)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--cyber-text-dim)'}
      >◀ {t('exp_back')}</button>

      {/* Hero Summary */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(192,132,252,0.04) 100%)', border: '1px solid var(--cyber-border)', borderRadius: '12px', padding: '2rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, var(--cyber-blue), var(--cyber-purple), var(--cyber-blue))', backgroundSize: '200% 100%' }} />
        <Label text={t('exp_complete')} color="var(--cyber-blue)" />
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', fontWeight: '700', color: '#fff', lineHeight: 1.5, marginBottom: '1.25rem' }}>{result.simpleSummary}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <RiskBadge level={result.riskLevel} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--cyber-text-dim)', fontWeight: '500' }}>{result.riskReason}</span>
        </div>
      </div>

      {/* Incident Overview */}
      <Block accentColor="var(--cyber-blue)">
        <Label text={t('exp_overview')} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--cyber-text)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{result.whatHappened}</p>
        <div className="grid-2">
          {[
            { labelKey: 'exp_attacker', value: result.whoAttacked, color: 'var(--cyber-red)' },
            { labelKey: 'exp_victim',   value: result.whoIsVictim, color: 'var(--cyber-orange)' },
          ].map((item, i) => (
            <div key={i} style={{ background: `${item.color}06`, border: `1px solid ${item.color}33`, borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: item.color, marginBottom: '6px', fontWeight: '600' }}>{t(item.labelKey)}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#fff', margin: 0, lineHeight: 1.5 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* Analogy */}
      <div style={{ background: 'rgba(192,132,252,0.04)', border: '1px solid rgba(192,132,252,0.15)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyber-purple), transparent)', opacity: 0.5 }} />
        <Label text={t('exp_analogy')} color="var(--cyber-purple)" />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', color: 'var(--cyber-text)', lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>"{result.realLifeAnalogy}"</p>
      </div>

      {/* Timeline */}
      <Block accentColor="var(--cyber-blue)">
        <Label text={t('exp_timeline')} />
        <AttackFlow steps={result.attackSteps} />
      </Block>

      {/* Intel label */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--cyber-text-dim)', marginBottom: '0.75rem', fontWeight: '600' }}>{t('exp_intel')}</div>

      {/* IOC CVE ATTCK */}
      <div className="grid-3" style={{ marginBottom: '1.5rem', gap: '16px' }}>
        <InfoCard title={t('exp_ioc_title')} icon="◈" color="var(--cyber-orange)" badge={result.iocExplained?.found ? t('exp_found') : t('exp_none')}>
          <div style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.12)', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: 'var(--cyber-orange)', marginBottom: '4px', fontWeight: '600' }}>{t('exp_ioc_what')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{t('exp_ioc_simple')}</p>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text)', lineHeight: 1.55, marginBottom: result.iocExplained?.examples?.length ? '0.75rem' : 0 }}>{result.iocExplained?.description}</p>
          {result.iocExplained?.examples?.map((ex, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-orange)', background: 'rgba(249,115,22,0.08)', borderRadius: '4px', padding: '4px 8px', marginBottom: '4px' }}>{ex}</div>
          ))}
        </InfoCard>

        <InfoCard title={t('exp_cve_title')} icon="◆" color="var(--cyber-red)" badge={result.cveExplained?.found ? t('exp_identified') : t('exp_none')}>
          <div style={{ background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.12)', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: 'var(--cyber-red)', marginBottom: '4px', fontWeight: '600' }}>{t('exp_cve_what')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{t('exp_cve_simple')}</p>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text)', lineHeight: 1.55, marginBottom: result.cveExplained?.examples?.length ? '0.75rem' : 0 }}>{result.cveExplained?.description}</p>
          {result.cveExplained?.examples?.map((ex, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-red)', background: 'rgba(244,63,94,0.08)', borderRadius: '4px', padding: '4px 8px', marginBottom: '4px' }}>{ex}</div>
          ))}
        </InfoCard>

        <InfoCard title={t('exp_attck_title')} icon="◉" color="var(--cyber-purple)" badge={t('exp_tactics')}>
          <div style={{ background: 'rgba(192,132,252,0.04)', border: '1px solid rgba(192,132,252,0.12)', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: 'var(--cyber-purple)', marginBottom: '4px', fontWeight: '600' }}>{t('exp_attck_what')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{t('exp_attck_simple')}</p>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text)', lineHeight: 1.55, marginBottom: result.attckExplained?.techniques?.length ? '0.75rem' : 0 }}>{result.attckExplained?.description}</p>
          {result.attckExplained?.techniques?.map((tech, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cyber-text)', background: 'rgba(192,132,252,0.08)', borderRadius: '4px', padding: '6px 10px', borderLeft: '2px solid var(--cyber-purple)', marginBottom: '6px' }}>{tech}</div>
          ))}
        </InfoCard>
      </div>

      {/* Jargon */}
      {result.techTermsExplained && Object.keys(result.techTermsExplained).length > 0 && (
        <Block accentColor="var(--cyber-blue)">
          <Label text={t('exp_jargon')} />
          <div className="grid-2" style={{ gap: '12px' }}>
            {Object.entries(result.techTermsExplained).map(([term, explanation]) => (
              <div key={term} style={{ background: 'rgba(139,92,246,0.03)', border: '1px solid var(--cyber-border)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: '700', color: 'var(--cyber-blue)', letterSpacing: '0.5px', marginBottom: '4px' }}>{term}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{explanation}</p>
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* Risk */}
      <div style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyber-yellow), transparent)', opacity: 0.5 }} />
        <Label text={t('exp_risk')} color="var(--cyber-yellow)" />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--cyber-text)', lineHeight: 1.6, margin: 0 }}>{result.whoIsAtRisk}</p>
      </div>

      {/* Safe */}
      <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyber-green), transparent)', opacity: 0.5 }} />
        <Label text={t('exp_safe')} color="var(--cyber-green)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {result.howToStaySafe.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '8px', padding: '0.85rem 1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cyber-green)', flexShrink: 0, marginTop: '1px', fontWeight: '700' }}>✓</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--cyber-text)', lineHeight: 1.55, margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid-2" style={{ gap: '16px' }}>
        <button onClick={() => navigate('/quiz')} style={{ 
          padding: '1rem', 
          background: 'rgba(139,92,246,0.12)', 
          border: '1px solid var(--cyber-blue)', 
          borderRadius: '9999px', 
          color: '#fff', 
          fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700',
          letterSpacing: '1.5px', cursor: 'pointer', transition: 'all 0.25s',
          boxShadow: '0 4px 16px rgba(139,92,246,0.15)'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.15)' }}
        >{t('exp_quiz_btn')}</button>
        
        <button onClick={() => navigate('/threat-bundle')} style={{ 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid var(--cyber-border)', 
          borderRadius: '9999px', 
          color: 'var(--cyber-text-dim)', 
          fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700',
          letterSpacing: '1.5px', cursor: 'pointer', transition: 'all 0.25s' 
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyber-blue)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.color = 'var(--cyber-text-dim)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
        >{t('exp_stix_btn')}</button>
      </div>
    </div>
  )
}