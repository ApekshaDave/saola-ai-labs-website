import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { fetchArticleFromUrl } from '../services/urlService'

const EXAMPLES = [
  { labelKey: 'home_example_wannacry', text: `In May 2017, a massive ransomware attack called WannaCry infected over 200,000 computers across 150 countries in just three days. The malware exploited a vulnerability in Microsoft Windows called EternalBlue, which was originally developed by the NSA and later leaked by a hacking group called Shadow Brokers. Once installed, WannaCry encrypted all files on the victim's computer and demanded a ransom of $300-600 in Bitcoin. Major victims included the UK National Health Service, Telefonica, FedEx, and Honda. The attack caused an estimated $4-8 billion in damages worldwide.` },
  { labelKey: 'home_example_heartbleed', text: `Security researchers discovered a critical vulnerability in OpenSSL called Heartbleed in April 2014. OpenSSL is a cryptographic library used by approximately two-thirds of web servers worldwide. The bug existed in the heartbeat extension of the TLS protocol. Due to missing bounds checking, an attacker could send a request causing the server to return up to 64KB of memory contents including passwords, private keys, and sensitive data. An estimated 600,000 servers were vulnerable at disclosure.` },
  { labelKey: 'home_example_solarwinds', text: `In December 2020, FireEye revealed a sophisticated supply chain attack affecting thousands of organizations worldwide. Hackers believed to be Russian intelligence group APT29 compromised SolarWinds Orion software updates, distributed to approximately 18,000 customers including US government agencies. The malware called SUNBURST created backdoors allowing attackers to access networks for up to 14 months undetected.` },
]

const TabBtn = ({ id, label, active, onClick }) => (
  <button onClick={() => onClick(id)} style={{
    flex: 1, padding: '0.9rem 0.5rem',
    background: active ? 'rgba(139,92,246,0.1)' : 'transparent',
    border: 'none',
    borderBottom: `2.5px solid ${active ? 'var(--cyber-blue)' : 'transparent'}`,
    color: active ? '#fff' : 'var(--cyber-text-dim)',
    fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px',
    cursor: 'pointer', transition: 'all 0.25s',
    fontWeight: '700',
    textShadow: active ? '0 0 10px rgba(139,92,246,0.3)' : 'none'
  }}>{label}</button>
)

export default function Home({ userProfile }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const [tab, setTab] = useState('url')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [fetchSuccess, setFetchSuccess] = useState(false)

  const getBgLabel = () => {
    const map = { student: t('bg_student'), it_professional: t('bg_it'), manager: t('bg_manager'), developer: t('bg_developer'), general: t('bg_general'), security: t('bg_security') }
    return map[userProfile?.background?.id] || ''
  }

  const handleUrlFetch = async () => {
    if (!urlInput.trim()) return
    setFetching(true); setFetchError(null); setFetchSuccess(false)
    try {
      const text = await fetchArticleFromUrl(urlInput.trim())
      localStorage.setItem('articleText', text)
      setFetchSuccess(true)
      setTimeout(() => navigate('/explainer'), 700)
    } catch (err) { setFetchError(err.message) }
    finally { setFetching(false) }
  }

  const handleText = () => {
    if (!textInput.trim()) return
    localStorage.setItem('articleText', textInput)
    navigate('/explainer')
  }

  const FEATURES = [
    { icon: '◈', color: 'var(--cyber-blue)', titleKey: 'home_feat_url',      descKey: 'home_feat_url_desc' },
    { icon: '◆', color: 'var(--cyber-orange)', titleKey: 'home_feat_timeline',  descKey: 'home_feat_timeline_desc' },
    { icon: '◉', color: 'var(--cyber-green)', titleKey: 'home_feat_ioc',       descKey: 'home_feat_ioc_desc' },
    { icon: '◇', color: 'var(--cyber-purple)', titleKey: 'home_feat_personal',  descKey: 'home_feat_personal_desc' },
  ]

  return (
    <div className="page-container" style={{ position: 'relative', zIndex: 1, padding: '3.5rem 1.25rem' }}>

      {/* Floating 3D cubes / shapes inspired by the reference image */}
      <div style={{ position: 'absolute', top: '5%', right: '-40px', width: '130px', height: '130px', opacity: 0.35, pointerEvents: 'none', zIndex: 0, animation: 'floatAround 22s ease-in-out infinite alternate' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="cubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#0a0518" />
            </linearGradient>
          </defs>
          <polygon points="50,15 90,35 90,75 50,95 10,75 10,35" fill="url(#cubeGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
          <line x1="50" y1="15" x2="50" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
          <line x1="50" y1="55" x2="90" y2="35" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
          <line x1="50" y1="55" x2="10" y2="35" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
        </svg>
      </div>
      
      <div style={{ position: 'absolute', bottom: '15%', left: '-60px', width: '100px', height: '100px', opacity: 0.25, pointerEvents: 'none', zIndex: 0, animation: 'floatAround 28s ease-in-out infinite alternate-reverse' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,15 90,35 90,75 50,95 10,75 10,35" fill="url(#cubeGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
          <line x1="50" y1="15" x2="50" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
          <line x1="50" y1="55" x2="90" y2="35" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
          <line x1="50" y1="55" x2="10" y2="35" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
        </svg>
      </div>

      {/* CSS float animation for the SVGs */}
      <style>{`
        @keyframes floatAround {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(90deg); }
          100% { transform: translateY(0px) rotate(180deg); }
        }
      `}</style>

      {/* Welcome banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(192,132,252,0.04) 100%)', 
        border: '1px solid var(--cyber-border)', 
        borderRadius: '9999px', 
        padding: '0.6rem 1.5rem', 
        marginBottom: '2.5rem', 
        position: 'relative', 
        overflow: 'hidden', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '12px', 
        boxShadow: '0 0 20px rgba(139,92,246,0.05)',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '9px', color: 'var(--cyber-blue)', fontWeight: '800', flexShrink: 0 }}>
          {(userProfile?.name?.[0] || 'U').toUpperCase()}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--cyber-text-dim)' }}>{t('home_welcome')}, <strong>{userProfile?.name}</strong>.</span>
          <span style={{ height: '12px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ color: 'var(--cyber-blue)', fontWeight: '600' }}>{getBgLabel()} Level</span>
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color: 'var(--cyber-blue)', marginBottom: '0.8rem', textShadow: '0 0 10px rgba(139,92,246,0.3)', fontWeight: '600' }}>
          {t('home_label')}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '900', color: '#fff', letterSpacing: '1px', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          {t('home_title1')}<br />
          <span style={{ color: 'var(--cyber-blue)', textShadow: '0 0 30px rgba(139,92,246,0.25)' }}>{t('home_title2')}</span>
        </h1>
        <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>{t('home_subtitle')}</p>
      </div>

      {/* Main input card */}
      <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '16px', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--cyber-blue) 30%, var(--cyber-purple) 70%, transparent)', opacity: 0.5 }} />

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--cyber-border)' }}>
          <TabBtn id="url"  label={`◈ ${t('home_tab_url')}`}  active={tab === 'url'}  onClick={setTab} />
          <TabBtn id="text" label={`◆ ${t('home_tab_text')}`} active={tab === 'text'} onClick={setTab} />
        </div>

        <div style={{ padding: '2rem' }}>

          {/* URL tab */}
          {tab === 'url' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--cyber-blue)', marginBottom: '0.75rem', fontWeight: '600' }}>{t('home_url_label')}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text-dim)', marginBottom: '1rem' }}>{t('home_url_desc')}</p>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-blue)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>▸</div>
                <input type="url" value={urlInput} onChange={e => { setUrlInput(e.target.value); setFetchError(null); setFetchSuccess(false) }} onKeyDown={e => e.key === 'Enter' && handleUrlFetch()} placeholder={t('home_url_placeholder')}
                  style={{ width: '100%', background: 'rgba(139,92,246,0.03)', border: `1px solid ${fetchError ? 'var(--cyber-red)' : fetchSuccess ? 'var(--cyber-green)' : 'var(--cyber-border)'}`, borderRadius: '8px', padding: '0.85rem 1rem 0.85rem 2.5rem', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', transition: 'all 0.25s', boxSizing: 'border-box' }}
                  onFocus={e => { if (!fetchError) { e.target.style.borderColor = 'var(--cyber-blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)' } }}
                  onBlur={e => { if (!fetchError && !fetchSuccess) { e.target.style.borderColor = 'var(--cyber-border)'; e.target.style.boxShadow = 'none' } }}
                />
              </div>
              {fetchError && (
                <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--cyber-red)', fontWeight: '600' }}>
                  ⚠ {fetchError}<div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--cyber-text-dim)' }}>{t('home_fetch_tip')}</div>
                </div>
              )}
              {fetchSuccess && (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--cyber-green)', fontWeight: '600' }}>✓ {t('home_fetch_success')}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', fontWeight: '600' }}>{t('home_url_works')}</div>
                <button onClick={handleUrlFetch} disabled={!urlInput.trim() || fetching} style={{ 
                  background: urlInput.trim() && !fetching ? 'rgba(139,92,246,0.12)' : 'transparent', 
                  border: `1px solid ${urlInput.trim() && !fetching ? 'var(--cyber-blue)' : 'var(--cyber-border)'}`, 
                  borderRadius: '9999px', padding: '0.7rem 1.75rem', 
                  color: urlInput.trim() && !fetching ? '#fff' : 'var(--cyber-text-dim)', 
                  fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', 
                  cursor: urlInput.trim() && !fetching ? 'pointer' : 'not-allowed', 
                  transition: 'all 0.25s', whiteSpace: 'nowrap', 
                  fontWeight: '700',
                  boxShadow: urlInput.trim() && !fetching ? '0 4px 16px rgba(139,92,246,0.2)' : 'none' 
                }}
                  onMouseEnter={e => { if (urlInput.trim() && !fetching) e.currentTarget.style.background = 'rgba(139,92,246,0.2)' }}
                  onMouseLeave={e => { if (urlInput.trim() && !fetching) e.currentTarget.style.background = 'rgba(139,92,246,0.12)' }}
                >
                  {fetching ? t('home_fetching') : t('home_fetch_btn')}
                </button>
              </div>
            </div>
          )}

          {/* Text tab */}
          {tab === 'text' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--cyber-blue)', marginBottom: '0.75rem', fontWeight: '600' }}>{t('home_text_label')}</div>
              <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder={t('home_text_placeholder')}
                onKeyDown={e => { if (e.shiftKey && e.key === 'Enter' && textInput.trim()) { e.preventDefault(); handleText() } }}
                style={{ width: '100%', minHeight: '160px', background: 'rgba(139,92,246,0.02)', border: '1px solid var(--cyber-border)', borderRadius: '8px', padding: '1rem', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, outline: 'none', resize: 'vertical', transition: 'all 0.25s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = 'var(--cyber-blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--cyber-border)'; e.target.style.boxShadow = 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', fontWeight: '600' }}>
                  {textInput.length > 0 ? `${textInput.length} ${t('home_chars')} · Shift+Enter to decode` : t('home_awaiting')}
                </div>
                <button onClick={handleText} disabled={!textInput.trim()} style={{ 
                  background: textInput.trim() ? 'rgba(139,92,246,0.12)' : 'transparent', 
                  border: `1px solid ${textInput.trim() ? 'var(--cyber-blue)' : 'var(--cyber-border)'}`, 
                  borderRadius: '9999px', padding: '0.7rem 1.75rem', 
                  color: textInput.trim() ? '#fff' : 'var(--cyber-text-dim)', 
                  fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', 
                  cursor: textInput.trim() ? 'pointer' : 'not-allowed', 
                  transition: 'all 0.25s', whiteSpace: 'nowrap', 
                  fontWeight: '700',
                  boxShadow: textInput.trim() ? '0 4px 16px rgba(139,92,246,0.2)' : 'none' 
                }}
                  onMouseEnter={e => { if (textInput.trim()) e.currentTarget.style.background = 'rgba(139,92,246,0.2)' }}
                  onMouseLeave={e => { if (textInput.trim()) e.currentTarget.style.background = 'rgba(139,92,246,0.12)' }}
                >
                  {t('home_decode_btn')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      <div style={{ marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--cyber-text-dim)', marginBottom: '0.75rem', fontWeight: '600' }}>{t('home_examples')}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { setTab('text'); setTextInput(ex.text) }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--cyber-border)', borderRadius: '9999px', padding: '6px 16px', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyber-blue)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.25)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.color = 'var(--cyber-text-dim)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
            >{t(ex.labelKey)}</button>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid-auto-sm" style={{ position: 'relative', zIndex: 1 }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '12px', padding: '1.5rem', position: 'relative', overflow: 'hidden', transition: 'all 0.25s', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${f.color}10` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`, opacity: 0.4 }} />
            <div style={{ fontSize: '1.3rem', color: f.color, marginBottom: '0.6rem', textShadow: `0 0 10px ${f.color}50` }}>{f.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700', color: f.color, letterSpacing: '1px', marginBottom: '0.4rem' }}>{t(f.titleKey)}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text-dim)', lineHeight: 1.55 }}>{t(f.descKey)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}