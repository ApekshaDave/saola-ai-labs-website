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
    flex: 1, padding: '0.75rem 0.5rem',
    background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
    border: 'none',
    borderBottom: `2px solid ${active ? '#00d4ff' : 'transparent'}`,
    color: active ? '#00d4ff' : 'var(--cyber-text-dim)',
    fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px',
    cursor: 'pointer', transition: 'all 0.2s',
    textShadow: active ? '0 0 10px rgba(0,212,255,0.6)' : 'none'
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
    { icon: '◈', color: '#00d4ff', titleKey: 'home_feat_url',      descKey: 'home_feat_url_desc' },
    { icon: '◆', color: '#ff6600', titleKey: 'home_feat_timeline',  descKey: 'home_feat_timeline_desc' },
    { icon: '◉', color: '#00ff88', titleKey: 'home_feat_ioc',       descKey: 'home_feat_ioc_desc' },
    { icon: '◇', color: '#9944ff', titleKey: 'home_feat_personal',  descKey: 'home_feat_personal_desc' },
  ]

  return (
    <div className="page-container">

      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(153,68,255,0.04) 100%)', border: '1px solid var(--cyber-border)', borderRadius: '6px', padding: '1rem 1.5rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)', opacity: 0.6 }} />
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: '1.5px solid rgba(0,212,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '13px', color: '#00d4ff', fontWeight: '800', flexShrink: 0, boxShadow: '0 0 14px rgba(0,212,255,0.25)' }}>
          {(userProfile?.name?.[0] || 'U').toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: '#00d4ff', marginBottom: '2px' }}>{t('home_ready')}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#fff' }}>
            {t('home_welcome')}, <strong>{userProfile?.name}</strong>. {t('home_calibrated')} <strong style={{ color: '#00d4ff' }}>{getBgLabel()}</strong> {t('home_level')}.
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '5px', color: '#00d4ff', marginBottom: '1rem', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>{t('home_label')}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '800', color: '#fff', letterSpacing: '3px', lineHeight: 1.15, marginBottom: '1rem' }}>
          {t('home_title1')}<br />
          <span style={{ color: '#00d4ff', textShadow: '0 0 30px rgba(0,212,255,0.5)' }}>{t('home_title2')}</span>
        </h1>
        <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>{t('home_subtitle')}</p>
      </div>

      {/* Main input card */}
      <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '8px', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #00d4ff 30%, #9944ff 70%, transparent)', opacity: 0.7 }} />

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--cyber-border)' }}>
          <TabBtn id="url"  label={`◈ ${t('home_tab_url')}`}  active={tab === 'url'}  onClick={setTab} />
          <TabBtn id="text" label={`◆ ${t('home_tab_text')}`} active={tab === 'text'} onClick={setTab} />
        </div>

        <div style={{ padding: '1.5rem' }}>

          {/* URL tab */}
          {tab === 'url' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: '#00d4ff', marginBottom: '0.75rem' }}>{t('home_url_label')}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cyber-text-dim)', marginBottom: '0.875rem' }}>{t('home_url_desc')}</p>
              <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#00d4ff', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>▸</div>
                <input type="url" value={urlInput} onChange={e => { setUrlInput(e.target.value); setFetchError(null); setFetchSuccess(false) }} onKeyDown={e => e.key === 'Enter' && handleUrlFetch()} placeholder={t('home_url_placeholder')}
                  style={{ width: '100%', background: 'rgba(0,212,255,0.03)', border: `1px solid ${fetchError ? '#ff2244' : fetchSuccess ? '#00ff88' : 'var(--cyber-border)'}`, borderRadius: '4px', padding: '0.85rem 1rem 0.85rem 2.5rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { if (!fetchError) { e.target.style.borderColor = '#00d4ff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.08)' } }}
                  onBlur={e => { if (!fetchError && !fetchSuccess) { e.target.style.borderColor = 'var(--cyber-border)'; e.target.style.boxShadow = 'none' } }}
                />
              </div>
              {fetchError && (
                <div style={{ background: 'rgba(255,34,68,0.08)', border: '1px solid rgba(255,34,68,0.3)', borderRadius: '4px', padding: '10px 14px', marginBottom: '0.875rem', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ff2244' }}>
                  ⚠ {fetchError}<div style={{ marginTop: '3px', fontSize: '10px', color: 'var(--cyber-text-dim)' }}>{t('home_fetch_tip')}</div>
                </div>
              )}
              {fetchSuccess && (
                <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '4px', padding: '10px 14px', marginBottom: '0.875rem', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00ff88' }}>✓ {t('home_fetch_success')}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)' }}>{t('home_url_works')}</div>
                <button onClick={handleUrlFetch} disabled={!urlInput.trim() || fetching} style={{ background: urlInput.trim() && !fetching ? 'rgba(0,212,255,0.1)' : 'transparent', border: `1px solid ${urlInput.trim() && !fetching ? '#00d4ff' : 'var(--cyber-border)'}`, borderRadius: '4px', padding: '0.7rem 1.5rem', color: urlInput.trim() && !fetching ? '#00d4ff' : 'var(--cyber-text-dim)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: urlInput.trim() && !fetching ? 'pointer' : 'not-allowed', transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: urlInput.trim() && !fetching ? '0 0 12px rgba(0,212,255,0.15)' : 'none' }}>
                  {fetching ? t('home_fetching') : t('home_fetch_btn')}
                </button>
              </div>
            </div>
          )}

          {/* Text tab */}
          {tab === 'text' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: '#00d4ff', marginBottom: '0.75rem' }}>{t('home_text_label')}</div>
              <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder={t('home_text_placeholder')}
                style={{ width: '100%', minHeight: '150px', background: 'rgba(0,212,255,0.03)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, outline: 'none', resize: 'vertical', transition: 'all 0.2s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#00d4ff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.08)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--cyber-border)'; e.target.style.boxShadow = 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.875rem', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)' }}>
                  {textInput.length > 0 ? `${textInput.length} ${t('home_chars')}` : t('home_awaiting')}
                </div>
                <button onClick={handleText} disabled={!textInput.trim()} style={{ background: textInput.trim() ? 'rgba(0,212,255,0.1)' : 'transparent', border: `1px solid ${textInput.trim() ? '#00d4ff' : 'var(--cyber-border)'}`, borderRadius: '4px', padding: '0.7rem 1.5rem', color: textInput.trim() ? '#00d4ff' : 'var(--cyber-text-dim)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: textInput.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: textInput.trim() ? '0 0 12px rgba(0,212,255,0.15)' : 'none' }}>
                  {t('home_decode_btn')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: 'var(--cyber-text-dim)', marginBottom: '0.75rem' }}>{t('home_examples')}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { setTab('text'); setTextInput(ex.text) }}
              style={{ background: 'transparent', border: '1px solid var(--cyber-border)', borderRadius: '3px', padding: '6px 14px', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '1px' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.color = '#00d4ff'; e.currentTarget.style.boxShadow = '0 0 8px rgba(0,212,255,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.color = 'var(--cyber-text-dim)'; e.currentTarget.style.boxShadow = 'none' }}
            >{t(ex.labelKey)}</button>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid-auto-sm">
        {FEATURES.map((f, i) => (
          <div key={i} style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '6px', padding: '1.25rem', position: 'relative', overflow: 'hidden', transition: 'all 0.2s', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '55'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}15` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`, opacity: 0.4 }} />
            <div style={{ fontSize: '1.2rem', color: f.color, marginBottom: '0.6rem', textShadow: `0 0 10px ${f.color}80` }}>{f.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: '600', color: f.color, letterSpacing: '2px', marginBottom: '0.4rem', textShadow: `0 0 8px ${f.color}60` }}>{t(f.titleKey)}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5 }}>{t(f.descKey)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}