import { useState, useEffect, useCallback, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { PageHeader } from '../components/CyberComponents'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function fetchLatestThreats(language) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  const langInstruction = language === 'hi'
    ? 'All text fields must be in Hindi. Only keep technical terms like CVE numbers and tool names in English.'
    : 'All text in English.'

  const today = new Date().toISOString().split('T')[0]

  const prompt = `You are a cybersecurity threat intelligence analyst. Today's date is ${today}.

Generate a JSON array of 5 realistic recent cybersecurity threats that could plausibly be happening right now in ${new Date().getFullYear()}. 
Make them varied — ransomware, phishing, zero-day, supply chain, data breach.
${langInstruction}

Return ONLY valid JSON array, no markdown, no backticks:

[
  {
    "id": 1,
    "title": "Threat title here",
    "date": "${today}",
    "severity": "Critical",
    "affectedWho": "Who is affected",
    "whatHappened": "2-3 sentences explaining what happened simply",
    "realLifeAnalogy": "Simple everyday analogy",
    "howToStaySafe": ["tip 1", "tip 2", "tip 3"],
    "tags": ["tag1", "tag2"],
    "isNew": true
  }
]

Severity must be one of: Critical, High, Medium, Low.
Make dates realistic — some from today, some from last few days.
isNew should be true for threats from last 2 days, false otherwise.`

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  const data = await response.json()
  const raw = data.choices[0].message.content
    .replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(raw)
}

const SEV_CONFIG = {
  Critical: { color: '#ff2244', bg: 'rgba(255,34,68,0.08)',  glow: 'rgba(255,34,68,0.3)' },
  High:     { color: '#ff6600', bg: 'rgba(255,102,0,0.08)',  glow: 'rgba(255,102,0,0.3)' },
  Medium:   { color: '#ffcc00', bg: 'rgba(255,204,0,0.08)',  glow: 'rgba(255,204,0,0.3)' },
  Low:      { color: '#00ff88', bg: 'rgba(0,255,136,0.08)',  glow: 'rgba(0,255,136,0.3)' },
}

export default function ExploreThreats() {
  const { t, language } = useLang()
  const navigate = useNavigate()
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)
  const [, startTransition] = useTransition()

  const loadThreats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLatestThreats(language)
      setThreats(data)
      setLastRefreshed(new Date())
    } catch {
      setError('Could not load threats. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => { 
    startTransition(() => {
      loadThreats()
    })
  }, [loadThreats, startTransition])

  const handleReadMore = (threat) => {
    localStorage.setItem('articleText',
      `${threat.title}\n\nWhat happened: ${threat.whatHappened}\n\nWho is affected: ${threat.affectedWho}\n\nHow to stay safe: ${threat.howToStaySafe?.join('. ')}`
    )
    navigate('/explainer')
  }

  return (
    <div className="page-container">
      <PageHeader
        label={t('explore_label')}
        title={t('explore_title')}
        subtitle={t('explore_subtitle')}
        color="#00d4ff"
      />

      {/* Refresh bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'rgba(0,212,255,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '0.75rem 1.25rem', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: loading ? '#ffcc00' : '#00ff88', boxShadow: `0 0 8px ${loading ? 'rgba(255,204,0,0.6)' : 'rgba(0,255,136,0.6)'}`, animation: loading ? 'blink 1s infinite' : 'none' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', letterSpacing: '2px' }}>
            {loading ? (language === 'hi' ? 'खतरे लोड हो रहे हैं...' : 'LOADING THREATS...') :
             lastRefreshed ? `${language === 'hi' ? 'अपडेट' : 'UPDATED'}: ${lastRefreshed.toLocaleTimeString()}` : ''}
          </span>
        </div>
        <button onClick={loadThreats} disabled={loading} style={{ background: loading ? 'transparent' : 'rgba(0,212,255,0.08)', border: `1px solid ${loading ? 'var(--cyber-border)' : '#00d4ff'}`, borderRadius: '3px', padding: '5px 14px', color: loading ? 'var(--cyber-text-dim)' : '#00d4ff', fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
          {loading ? '...' : (language === 'hi' ? '↻ रिफ्रेश' : '↻ REFRESH')}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '6px', padding: '1.5rem', animation: `blink ${1 + i * 0.2}s ease-in-out infinite` }}>
              <div style={{ height: '12px', background: 'var(--cyber-border)', borderRadius: '2px', marginBottom: '12px', width: '40%' }} />
              <div style={{ height: '10px', background: 'var(--cyber-border)', borderRadius: '2px', marginBottom: '8px', width: '80%' }} />
              <div style={{ height: '10px', background: 'var(--cyber-border)', borderRadius: '2px', width: '60%' }} />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ background: 'rgba(255,34,68,0.08)', border: '1px solid rgba(255,34,68,0.3)', borderRadius: '6px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: '#ff2244', marginBottom: '1rem' }}>{error}</p>
          <button onClick={loadThreats} style={{ background: 'rgba(255,34,68,0.1)', border: '1px solid #ff2244', borderRadius: '4px', padding: '8px 20px', color: '#ff2244', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer' }}>
            RETRY
          </button>
        </div>
      )}

      {/* Threat cards */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {threats.map((threat, i) => {
            const sev = SEV_CONFIG[threat.severity] || SEV_CONFIG.Medium
            const isOpen = expanded === threat.id

            return (
              <div key={threat.id} style={{
                background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)',
                borderRadius: '6px', overflow: 'hidden', position: 'relative',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                animationDelay: `${i * 0.06}s`
              }}
                className="anim-fade-up"
                onMouseEnter={e => { e.currentTarget.style.borderColor = sev.color + '55'; e.currentTarget.style.boxShadow = `0 4px 24px ${sev.glow}` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${sev.color}, transparent)`, opacity: 0.6 }} />

                {/* Left severity bar */}
                <div style={{ position: 'absolute', left: 0, top: 0, width: '3px', height: '100%', background: `linear-gradient(to bottom, ${sev.color}, ${sev.color}33)` }} />

                <div style={{ padding: '1.25rem 1.25rem 1.25rem 1.5rem' }}>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {threat.isNew && (
                        <span style={{ background: sev.bg, border: `1px solid ${sev.color}`, borderRadius: '2px', padding: '2px 8px', fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '2px', color: sev.color, boxShadow: `0 0 8px ${sev.glow}`, animation: 'blink 2.5s infinite' }}>
                          {language === 'hi' ? 'नया खतरा' : 'NEW THREAT'}
                        </span>
                      )}
                      <span style={{ background: sev.bg, border: `1px solid ${sev.color}33`, borderRadius: '2px', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: sev.color }}>
                        {threat.severity}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', whiteSpace: 'nowrap' }}>
                      {threat.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', fontWeight: '600', color: '#fff', letterSpacing: '1px', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                    {threat.title}
                  </h3>

                  {/* Affected */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#ffcc00', flexShrink: 0, marginTop: '3px' }}>
                      {language === 'hi' ? 'प्रभावित:' : 'AFFECTED:'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cyber-text-dim)', lineHeight: 1.4 }}>{threat.affectedWho}</span>
                  </div>

                  {/* What happened */}
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {threat.whatHappened}
                  </p>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                      <div style={{ background: 'rgba(153,68,255,0.06)', border: '1px solid rgba(153,68,255,0.2)', borderRadius: '4px', padding: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#9944ff', marginBottom: '6px' }}>
                          💡 {language === 'hi' ? 'वास्तविक जीवन का उदाहरण' : 'REAL LIFE ANALOGY'}
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cyber-text)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>"{threat.realLifeAnalogy}"</p>
                      </div>
                      <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '4px', padding: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: '#00ff88', marginBottom: '8px' }}>
                          ✓ {language === 'hi' ? 'सुरक्षित रहें' : 'HOW TO STAY SAFE'}
                        </div>
                        {(threat.howToStaySafe || []).map((tip, j) => (
                          <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: j < (threat.howToStaySafe?.length || 0) - 1 ? '6px' : 0 }}>
                            <span style={{ color: '#00ff88', fontSize: '11px', flexShrink: 0 }}>✓</span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--cyber-text)', lineHeight: 1.5 }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {(threat.tags || []).map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', color: 'var(--cyber-text-dim)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--cyber-border)', borderRadius: '2px', padding: '2px 8px' }}>#{tag}</span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => setExpanded(isOpen ? null : threat.id)} style={{ background: 'transparent', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '6px 14px', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.color = '#00d4ff' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.color = 'var(--cyber-text-dim)' }}
                    >
                      {isOpen ? (language === 'hi' ? '▲ कम दिखाएं' : '▲ LESS') : (language === 'hi' ? '▼ अधिक दिखाएं' : '▼ MORE')}
                    </button>
                    <button onClick={() => handleReadMore(threat)} style={{ background: sev.bg, border: `1px solid ${sev.color}55`, borderRadius: '4px', padding: '6px 14px', color: sev.color, fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 12px ${sev.glow}`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      {language === 'hi' ? 'पूरा विश्लेषण ▸' : 'FULL ANALYSIS ▸'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stay updated */}
      <div style={{ marginTop: '2rem', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', padding: '1.25rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '1.25rem' }}>🔔</div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: '#00d4ff', marginBottom: '3px' }}>{t('explore_notify_label')}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cyber-text-dim)' }}>{t('explore_notify_desc')}</div>
        </div>
      </div>
    </div>
  )
}