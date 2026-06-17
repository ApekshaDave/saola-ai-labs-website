import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { searchCVE, getSeverityColor, formatCVSS } from '../services/cveService'
import { generateSimpleExplanation } from '../services/groqService'
import { LoadingSpinner } from '../components/CyberComponents'

const VECTOR_PARTS = {
  AV: { label: 'Attack Vector', meanings: { N: 'Remotely exploitable over internet', A: 'Exploitable from same network', L: 'Requires local access to machine', P: 'Requires physical access to device' } },
  AC: { label: 'Attack Complexity', meanings: { L: 'Easy to exploit — no special conditions', H: 'Hard to exploit — specific conditions needed' } },
  PR: { label: 'Privileges Required', meanings: { N: 'No login needed — anyone can attack', L: 'Basic user account needed', H: 'Admin account needed to exploit' } },
  UI: { label: 'User Interaction', meanings: { N: 'No action needed from victim', R: 'Victim must click something or take action' } },
  S: { label: 'Scope', meanings: { U: 'Impact stays within the vulnerable system', C: 'Can spread beyond — affects other systems' } },
  C: { label: 'Confidentiality Impact', meanings: { N: 'No data can be stolen', L: 'Some data can be read', H: 'All data can be stolen' } },
  I: { label: 'Integrity Impact', meanings: { N: 'No data can be changed', L: 'Some data can be modified', H: 'All data can be altered or deleted' } },
  A: { label: 'Availability Impact', meanings: { N: 'System keeps working normally', L: 'System partially disrupted', H: 'System completely shut down' } },
}

function explainVector(vectorString) {
  if (!vectorString || vectorString === 'N/A') return []
  const parts = vectorString.replace('CVSS:3.1/', '').replace('CVSS:3.0/', '').split('/')
  const explained = []
  for (const part of parts) {
    const [key, val] = part.split(':')
    if (VECTOR_PARTS[key] && VECTOR_PARTS[key].meanings[val]) {
      explained.push({ key, label: VECTOR_PARTS[key].label, value: val, meaning: VECTOR_PARTS[key].meanings[val] })
    }
  }
  return explained
}

const EXAMPLE_CVES = ['CVE-2021-44228', 'CVE-2017-0144', 'CVE-2014-0160']

export default function CVESearch() {
  const { t, language } = useLang()
  const [searchInput, setSearchInput] = useState('')
  const [cveData, setCveData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiExplanation, setAiExplanation] = useState('')
  const [error, setError] = useState('')

  const handleSearch = async (id) => {
    const query = id || searchInput
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setCveData(null)
    setAiExplanation('')
    try {
      const data = await searchCVE(query)
      setCveData(data)
      // Auto-generate AI explanation
      setAiLoading(true)
      try {
        const explanation = await generateSimpleExplanation(
          `CVE ID: ${data.id}. Description: ${data.description}. Severity: ${data.severity}. CVSS Score: ${data.cvssScore}`,
          language
        )
        setAiExplanation(explanation)
      } catch { setAiExplanation('') }
      finally { setAiLoading(false) }
    } catch (err) {
      setError(err.message || t('cve_search_error'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: 'var(--cyber-red)', marginBottom: '0.75rem' }}>
          {t('cve_page_label')}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: '700', color: '#fff', letterSpacing: '2px', marginBottom: '0.5rem' }}>
          {t('cve_page_title')}
        </h1>
        <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
          {t('cve_page_subtitle')}
        </p>
      </div>

      {/* What is a CVE explainer */}
      <div style={{ background: 'rgba(255,51,85,0.05)', border: '1px solid rgba(255,51,85,0.2)', borderRadius: '4px', padding: '1.25rem', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease 0.05s both' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-red)', marginBottom: '0.6rem' }}>{t('cve_what_label')}</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--cyber-text-dim)', lineHeight: 1.6, margin: 0 }}>{t('cve_what_text')}</p>
      </div>

      {/* CVE Number format explainer */}
      <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1.25rem', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-blue)', marginBottom: '0.75rem' }}>{t('cve_format_label')}</div>
        {/* Visual breakdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { text: 'CVE', color: 'var(--cyber-blue)' },
            { text: ' — ', color: 'var(--cyber-text-dim)' },
            { text: '2021', color: 'var(--cyber-green)' },
            { text: ' — ', color: 'var(--cyber-text-dim)' },
            { text: '44228', color: 'var(--cyber-yellow)' },
          ].map((p, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: '700', color: p.color, letterSpacing: '1px' }}>{p.text}</span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {[
            { label: 'CVE', color: 'var(--cyber-blue)', desc: language === 'hi' ? 'हमेशा CVE से शुरू — Common Vulnerabilities and Exposures' : 'Always starts with CVE — Common Vulnerabilities and Exposures' },
            { label: language === 'hi' ? 'साल' : 'YEAR', color: 'var(--cyber-green)', desc: language === 'hi' ? 'जिस साल खामी रिपोर्ट की गई — सॉफ्टवेयर बनने का साल नहीं' : 'Year the bug was reported — NOT when the software was made' },
            { label: language === 'hi' ? 'नंबर' : 'NUMBER', color: 'var(--cyber-yellow)', desc: language === 'hi' ? 'सिर्फ एक क्रम संख्या — ज़्यादा नंबर का मतलब ज़्यादा खतरनाक नहीं' : 'Just a serial number — higher number does NOT mean more dangerous' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, marginTop: '4px', flexShrink: 0, boxShadow: `0 0 6px ${item.color}` }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: item.color, letterSpacing: '2px', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cyber-text-dim)', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.5s ease 0.15s both' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-red), transparent)' }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-red)', marginBottom: '0.75rem' }}>{t('cve_input_label')}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="CVE-2021-44228"
            style={{ flex: 1, background: 'rgba(255,51,85,0.05)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '0.9rem 1rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = 'var(--cyber-red)'}
            onBlur={e => e.target.style.borderColor = 'var(--cyber-border)'}
          />
          <button onClick={() => handleSearch()} style={{ background: 'rgba(255,51,85,0.1)', border: '1px solid var(--cyber-red)', borderRadius: '4px', padding: '0.9rem 2rem', color: 'var(--cyber-red)', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,51,85,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,51,85,0.1)'}
          >
            {t('cve_search_button')}
          </button>
        </div>

        {/* Example buttons */}
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', letterSpacing: '2px' }}>{t('cve_try_example')}:</span>
          {EXAMPLE_CVES.map(cve => (
            <button key={cve} onClick={() => { setSearchInput(cve); handleSearch(cve) }}
              style={{ background: 'transparent', border: '1px solid var(--cyber-border)', borderRadius: '2px', padding: '3px 10px', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--cyber-red)'; e.target.style.color = 'var(--cyber-red)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--cyber-border)'; e.target.style.color = 'var(--cyber-text-dim)' }}
            >{cve}</button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,51,85,0.1)', border: '1px solid var(--cyber-red)', borderRadius: '4px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--cyber-red)', marginBottom: '4px', letterSpacing: '1px' }}>{t('cve_search_error_title')}</div>
          <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* CVE Results */}
      {cveData && (
        <div style={{ animation: 'fadeInUp 0.4s ease' }}>

          {/* Header card */}
          <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${getSeverityColor(cveData.severity)}, transparent)` }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: '700', color: '#fff', letterSpacing: '2px', margin: 0, marginBottom: '4px' }}>{cveData.id}</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-text-dim)', margin: 0 }}>{t('cve_published')}: {new Date(cveData.published).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: t('cve_severity'), value: cveData.severity, color: getSeverityColor(cveData.severity) },
                  { label: t('cve_cvss_score'), value: cveData.cvssScore, color: formatCVSS(cveData.cvssScore).color },
                ].map((item, i) => (
                  <div key={i} style={{ background: `${item.color}15`, border: `1px solid ${item.color}`, borderRadius: '4px', padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', marginBottom: '4px', letterSpacing: '1px' }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '700', color: item.color, letterSpacing: '2px' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Simple Explanation */}
          <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '4px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-blue)', marginBottom: '0.75rem' }}>{t('cve_ai_label')}</div>
            {aiLoading ? (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-text-dim)' }}>{t('cve_ai_loading')}</div>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#fff', lineHeight: 1.7, margin: 0 }}>{aiExplanation}</p>
            )}
          </div>

          {/* Technical description */}
          <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-blue), transparent)' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-blue)', marginBottom: '0.75rem' }}>{t('cve_description')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--cyber-text)', lineHeight: 1.7, margin: 0 }}>{cveData.description}</p>
          </div>

          {/* CVSS Vector with explanation */}
          {cveData.cvssVector !== 'N/A' && (
            <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-green), transparent)' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-green)', marginBottom: '0.75rem' }}>{t('cve_cvss_vector')}</div>
              <code style={{ display: 'block', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cyber-green)', wordBreak: 'break-all', marginBottom: '1.25rem' }}>
                {cveData.cvssVector}
              </code>

              {/* Vector explained in plain language */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-yellow)', marginBottom: '0.75rem' }}>{t('cve_vector_explain_label')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {explainVector(cveData.cvssVector).map((part, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,221,0,0.04)', border: '1px solid rgba(255,221,0,0.12)', borderRadius: '2px', padding: '0.75rem' }}>
                    <div style={{ minWidth: '32px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-yellow)', background: 'rgba(255,221,0,0.1)', padding: '2px 6px', borderRadius: '2px' }}>{part.key}:{part.value}</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', letterSpacing: '1px', marginBottom: '2px' }}>{part.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#fff' }}>{part.meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {cveData.references?.length > 0 && (
            <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-purple), transparent)' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-purple)', marginBottom: '1rem' }}>{t('cve_references')} ({cveData.references.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cveData.references.slice(0, 5).map((ref, i) => (
                  <a key={i} href={ref} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--cyber-blue)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', wordBreak: 'break-all', textDecoration: 'underline', padding: '2px 0', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--cyber-green)'}
                    onMouseLeave={e => e.target.style.color = 'var(--cyber-blue)'}
                  >{ref}</a>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div style={{ background: 'rgba(255,221,0,0.05)', border: '1px solid rgba(255,221,0,0.3)', borderRadius: '4px', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--cyber-yellow)', marginBottom: '0.5rem', fontWeight: '600', letterSpacing: '1px' }}>💡 {t('cve_tip')}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--cyber-text-dim)', lineHeight: 1.6, margin: 0 }}>{t('cve_tip_text')}</p>
          </div>
        </div>
      )}
    </div>
  )
}