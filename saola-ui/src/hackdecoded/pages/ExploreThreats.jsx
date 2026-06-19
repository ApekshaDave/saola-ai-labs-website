import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { PageHeader } from '../components/CyberComponents'

// CISA Known Exploited Vulnerabilities (KEV) Catalog Endpoint
// Direct URL works in both dev and production (CISA supports CORS on this public feed)
const CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
const AUTO_REFRESH_MS = 10 * 60 * 1000 // auto-refresh every 10 min

// ─── Severity configuration ──────────────────────────────────────────────────────────
const SEV = {
  Critical: { color: 'var(--cyber-red)',    bg: 'rgba(244,63,94,0.08)',  glow: 'rgba(244,63,94,0.25)' },
  High:     { color: 'var(--cyber-orange)', bg: 'rgba(249,115,22,0.08)', glow: 'rgba(249,115,22,0.25)' },
  Medium:   { color: 'var(--cyber-yellow)', bg: 'rgba(234,179,8,0.08)',  glow: 'rgba(234,179,8,0.25)' },
  Low:      { color: 'var(--cyber-green)',  bg: 'rgba(16,185,129,0.08)', glow: 'rgba(16,185,129,0.25)' },
}

const SEV_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low']

// ─── Utility helpers ──────────────────────────────────────────────────────────
function inferSeverity(title = '', desc = '', knownRansomware = '') {
  if (knownRansomware && knownRansomware.toLowerCase() === 'known') return 'Critical'
  
  const text = (title + ' ' + desc).toLowerCase()
  if (/critical|zero.?day|0day|breach|rce|remote code|auth.*bypass|authentication bypass|privilege escalation|arbitrary file/.test(text)) {
    return 'Critical'
  }
  if (/high|severe|vulnerability|malware|backdoor|exploit|injection/.test(text)) {
    return 'High'
  }
  if (/medium|moderate|phishing|scam|warning|advisory/.test(text)) {
    return 'Medium'
  }
  return 'High' // Actively exploited CVEs are generally high risk by default!
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isNewVulnerability(dateStr) {
  if (!dateStr) return false
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return false
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 14 // Count as "new" if added to KEV in last 14 days
}

function mapKevItem(item) {
  const severity = inferSeverity(item.vulnerabilityName, item.shortDescription, item.knownRansomwareCampaignUse)
  
  // Extract external link from notes (prefer vendor advisories over CISA/NVD if available, else use NVD link)
  let link = `https://nvd.nist.gov/vuln/detail/${item.cveID}`
  if (item.notes) {
    const urls = item.notes.split(/[;\s]+/).map(u => u.trim()).filter(u => u.startsWith('http'))
    const advisoryUrl = urls.find(u => !u.includes('cisa.gov') && !u.includes('nvd.nist.gov'))
    if (advisoryUrl) {
      link = advisoryUrl
    } else if (urls.length > 0) {
      link = urls[0]
    }
  }

  // Generate tags
  const tags = [
    item.cveID,
    item.vendorProject,
    item.product,
    ...(item.cwes || [])
  ].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 4)

  return {
    id: item.cveID,
    title: item.vulnerabilityName,
    whatHappened: item.shortDescription,
    requiredAction: item.requiredAction,
    dueDate: item.dueDate,
    knownRansomware: item.knownRansomwareCampaignUse,
    link,
    date: formatDate(item.dateAdded),
    dateRaw: item.dateAdded,
    severity,
    source: 'CISA KEV',
    sourceColor: 'var(--cyber-blue)',
    tags,
    isNew: isNewVulnerability(item.dateAdded),
    affectedWho: `${item.vendorProject} - ${item.product}`
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ExploreThreats() {
  const { language } = useLang()
  const navigate = useNavigate()
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)
  const [sevFilter, setSevFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(25)
  const [countdown, setCountdown] = useState(AUTO_REFRESH_MS / 1000)
  
  const timerRef = useRef(null)
  const cdRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch(CISA_KEV_URL)
      if (!resp.ok) throw new Error(`CISA API: HTTP ${resp.status}`)
      const data = await resp.json()
      
      if (!data.vulnerabilities || !Array.isArray(data.vulnerabilities)) {
        throw new Error('Invalid CISA KEV JSON response format')
      }

      // Map and sort: newest added date first
      const mapped = data.vulnerabilities.map(mapKevItem).sort((a, b) => {
        const d1 = new Date(a.dateRaw).getTime()
        const d2 = new Date(b.dateRaw).getTime()
        return d2 - d1
      })

      setThreats(mapped)
      setLastRefreshed(new Date())
      setCountdown(AUTO_REFRESH_MS / 1000)
      setVisibleCount(25) // reset items count on reload
    } catch (err) {
      console.error('Failed to load CISA threats:', err)
      setError(err.message || 'Failed to load CISA threat catalog.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load and periodic refresh
  useEffect(() => {
    load()
    timerRef.current = setInterval(load, AUTO_REFRESH_MS)
    return () => clearInterval(timerRef.current)
  }, [load])

  // Countdown ticker
  useEffect(() => {
    cdRef.current = setInterval(() => {
      setCountdown(c => (c <= 1 ? AUTO_REFRESH_MS / 1000 : c - 1))
    }, 1000)
    return () => clearInterval(cdRef.current)
  }, [])

  const handleOpen = (threat) => {
    if (threat.link && threat.link !== '#') {
      window.open(threat.link, '_blank', 'noopener,noreferrer')
    } else {
      localStorage.setItem(
        'articleText',
        `${threat.title}\n\nAffected Product: ${threat.affectedWho}\n\nWhat happened: ${threat.whatHappened}\n\nRequired Action: ${threat.requiredAction}`
      )
      navigate('/explainer')
    }
  }

  const handleAiAnalyze = (threat) => {
    localStorage.setItem(
      'articleText',
      `Please analyze this security threat:\nCVE: ${threat.id}\nTitle: ${threat.title}\nAffected: ${threat.affectedWho}\nDetails: ${threat.whatHappened}\nRequired Action: ${threat.requiredAction}\nNotes: ${threat.link}`
    );
    navigate('/explainer')
  }

  // Filter threats based on search query and severity filter
  const filtered = threats.filter(t => {
    if (sevFilter !== 'All' && t.severity !== sevFilter) return false
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.whatHappened.toLowerCase().includes(q) ||
        t.affectedWho.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }
    return true
  })

  const displayedThreats = filtered.slice(0, visibleCount)

  const fmtCd = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // ─── Translated strings (Bilingual support) ──────────────────────────────────────────────────────────
  const ui = {
    label: language === 'hi' ? 'लाइव साइबर सुरक्षा फीड' : 'LIVE CYBER SECURITY FEED',
    title: language === 'hi' ? 'सक्रिय रूप से शोषित खतरे' : 'Active Exploited Threats',
    subtitle: language === 'hi'
      ? 'CISA (साइबर सुरक्षा और अवसंरचना सुरक्षा एजेंसी) द्वारा जारी किए गए नवीनतम और वास्तविक खतरे'
      : 'Real-time catalog of actively exploited vulnerabilities in the wild, sourced directly from CISA KEV',
    fetching: language === 'hi' ? 'सीआईएसए फ़ीड लोड हो रहा है...' : 'FETCHING CISA FEED...',
    feedError: language === 'hi' ? 'फ़ीड लोड करने में त्रुटि' : 'FEED ERROR',
    updated: language === 'hi' ? 'अपडेट किया गया' : 'UPDATED',
    nextIn: language === 'hi' ? 'अगला अपडेट' : 'NEXT IN',
    refresh: language === 'hi' ? '↻ ताज़ा करें' : '↻ REFRESH',
    searchPlaceholder: language === 'hi' ? 'CVE ID, निर्माता, उत्पाद या रैंसमवेयर से खोजें...' : 'Search by CVE, vendor, product, tags, or description...',
    severityTitle: language === 'hi' ? 'तीव्रता के आधार पर फ़िल्टर करें:' : 'Filter by Severity:',
    threatsBadge: language === 'hi' ? 'खतरे पाए गए' : 'THREATS MATCHED',
    noThreats: language === 'hi' ? 'खोज मानदंडों से मेल खाता हुआ कोई खतरा नहीं मिला।' : 'No threats found matching search criteria.',
    originalSource: language === 'hi' ? 'मूल विवरण और दस्तावेज़' : 'ORIGINAL DESCRIPTION & MITIGATION',
    requiredAction: language === 'hi' ? 'आवश्यक कार्रवाई:' : 'Required Mitigation Action:',
    dueDate: language === 'hi' ? 'सुधार की अंतिम तिथि:' : 'Remediation Due Date:',
    ransomwareTitle: language === 'hi' ? 'रैंसमवेयर अभियान उपयोग:' : 'Ransomware Campaign Use:',
    less: language === 'hi' ? '▲ कम दिखाएं' : '▲ LESS DETAILS',
    more: language === 'hi' ? '▼ विवरण देखें' : '▼ MORE DETAILS',
    cveDetailBtn: language === 'hi' ? 'सुरक्षा एडवाइजरी खोलें ↗' : 'OPEN ADVISORY ↗',
    aiAnalyzeBtn: language === 'hi' ? 'AI विश्लेषण प्राप्त करें' : 'AI ANALYZE THREAT',
    loadMore: language === 'hi' ? 'और खतरे लोड करें' : 'LOAD MORE THREATS',
    showingText: language === 'hi'
      ? `${filtered.length} खतरों में से ${displayedThreats.length} प्रदर्शित`
      : `Showing ${displayedThreats.length} of ${filtered.length} threats`,
    autoRefreshFooter: language === 'hi' ? 'ऑटो-रिफ्रेश सक्रिय है' : 'AUTO-REFRESH ACTIVE',
    autoRefreshDesc: language === 'hi'
      ? `यह पृष्ठ स्वचालित रूप से हर 10 मिनट में सीआईएसए डेटाबेस से अपडेट होता है। अगला अपडेट ${fmtCd(countdown)} में होगा।`
      : `This page automatically updates directly from the official CISA KEV catalog every 10 minutes. Next update in ${fmtCd(countdown)}.`
  }

  return (
    <div className="page-container" style={{ padding: '3.5rem 1.25rem' }}>
      
      <PageHeader
        label={ui.label}
        title={ui.title}
        subtitle={ui.subtitle}
        color="var(--cyber-blue)"
      />

      {/* ── Live status bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        background: 'rgba(139,92,246,0.03)',
        border: '1px solid var(--cyber-border)',
        borderRadius: '9999px',
        padding: '0.65rem 1.5rem',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: loading ? 'var(--cyber-yellow)' : error ? 'var(--cyber-red)' : 'var(--cyber-green)',
            boxShadow: `0 0 8px ${loading ? 'rgba(234,179,8,0.7)' : error ? 'rgba(244,63,94,0.7)' : 'rgba(16,185,129,0.7)'}`,
            animation: 'blink 1.5s ease infinite'
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', letterSpacing: '1px', fontWeight: '600' }}>
            {loading ? ui.fetching
              : error ? ui.feedError
              : lastRefreshed
                ? `${ui.updated}: ${lastRefreshed.toLocaleTimeString()} · ${ui.nextIn} ${fmtCd(countdown)}`
                : ''}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!loading && !error && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', letterSpacing: '0.5px', fontWeight: '600' }}>
              {filtered.length} {ui.threatsBadge}
            </span>
          )}
          <button onClick={load} disabled={loading} style={{
            background: loading ? 'transparent' : 'rgba(139,92,246,0.12)',
            border: `1px solid ${loading ? 'var(--cyber-border)' : 'var(--cyber-blue)'}`,
            borderRadius: '9999px',
            padding: '5px 18px',
            color: loading ? 'var(--cyber-text-dim)' : '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            letterSpacing: '1px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontWeight: '700'
          }}>
            {loading ? '...' : ui.refresh}
          </button>
        </div>
      </div>

      {/* ── Search Bar Element ── */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
            setVisibleCount(25) // Reset count when search changes
          }}
          placeholder={ui.searchPlaceholder}
          style={{
            width: '100%',
            background: 'rgba(139,92,246,0.04)',
            border: '1px solid var(--cyber-border)',
            borderRadius: '16px',
            padding: '0.85rem 1.25rem',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.25s',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--cyber-blue)'
            e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1), inset 0 2px 4px rgba(0,0,0,0.2)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--cyber-border)'
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--cyber-text-dim)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Severity Filters ── */}
      {!loading && !error && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.75rem', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-text-dim)', marginRight: '4px', fontWeight: '600' }}>
            {ui.severityTitle}
          </span>
          {SEV_FILTERS.map(s => {
            const active = sevFilter === s
            const col = s === 'All' ? 'var(--cyber-blue)' : SEV[s]?.color
            
            // Hindi visual display for buttons
            let buttonLabel = s
            if (language === 'hi') {
              if (s === 'All') buttonLabel = 'सभी'
              else if (s === 'Critical') buttonLabel = 'गंभीर'
              else if (s === 'High') buttonLabel = 'उच्च'
              else if (s === 'Medium') buttonLabel = 'मध्यम'
              else if (s === 'Low') buttonLabel = 'कम'
            }

            return (
              <button key={s} onClick={() => {
                setSevFilter(s)
                setVisibleCount(25) // Reset count
              }} style={{
                background: active ? `${col}18` : 'transparent',
                border: `1px solid ${active ? col : 'var(--cyber-border)'}`,
                borderRadius: '9999px',
                padding: '5px 18px',
                color: active ? '#fff' : 'var(--cyber-text-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '1px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: active ? `0 2px 10px ${col}44` : 'none'
              }}>
                {buttonLabel}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              background: 'var(--cyber-card)',
              border: '1px solid var(--cyber-border)',
              borderRadius: '14px',
              padding: '1.6rem',
              animation: `blink ${1 + i * 0.12}s ease-in-out infinite`
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ height: '22px', width: '90px', background: 'rgba(139,92,246,0.12)', borderRadius: '9999px' }} />
                <div style={{ height: '22px', width: '120px', background: 'rgba(139,92,246,0.08)', borderRadius: '9999px' }} />
              </div>
              <div style={{ height: '15px', background: 'var(--cyber-border)', borderRadius: '6px', marginBottom: '10px', width: `${60 + i * 7}%` }} />
              <div style={{ height: '11px', background: 'var(--cyber-border)', borderRadius: '6px', marginBottom: '8px', width: '90%' }} />
              <div style={{ height: '11px', background: 'var(--cyber-border)', borderRadius: '6px', width: '65%' }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Error state ── */}
      {error && !loading && (
        <div style={{
          background: 'rgba(244,63,94,0.06)',
          border: '1px solid rgba(244,63,94,0.3)',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📡</div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--cyber-red)', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1.1rem' }}>
            {language === 'hi' ? 'फ़ीड लोड नहीं हुई' : 'Could Not Load Cyber Threat Feed'}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--cyber-text-dim)', fontSize: '0.9rem', marginBottom: '1.75rem', fontWeight: '500', maxWidth: '450px', margin: '0 auto 1.75rem' }}>
            {language === 'hi'
              ? 'कृपया जांचें कि आपका इंटरनेट काम कर रहा है और पुनः प्रयास करें।'
              : 'Unable to connect to the CISA catalog. Please check your internet connection and try again.'}
          </p>
          <button onClick={load} style={{
            background: 'rgba(139,92,246,0.14)',
            border: '1px solid var(--cyber-blue)',
            borderRadius: '9999px',
            padding: '10px 32px',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontWeight: '700',
            boxShadow: '0 4px 16px rgba(139,92,246,0.25)',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.26)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,92,246,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.14)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.25)' }}
          >
            ↻ {language === 'hi' ? 'दोबारा कोशिश करें' : 'TRY AGAIN'}
          </button>
        </div>
      )}

      {/* ── Threat cards ── */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
              {ui.noThreats}
            </div>
          )}

          {displayedThreats.map((threat, i) => {
            const sev = SEV[threat.severity] || SEV.Low
            const isOpen = expanded === threat.id

            return (
              <div key={threat.id} style={{
                background: 'var(--cyber-card)',
                border: '1px solid var(--cyber-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                animation: `fadeInUp 0.4s ease ${Math.min(i, 10) * 0.04}s both`,
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                boxShadow: isOpen ? `0 16px 40px rgba(0,0,0,0.45)` : '0 4px 16px rgba(0,0,0,0.2)'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${sev.color}66`
                  e.currentTarget.style.boxShadow = `0 8px 32px ${sev.glow}, 0 4px 16px rgba(0,0,0,0.25)`
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--cyber-border)'
                  e.currentTarget.style.boxShadow = isOpen ? '0 16px 40px rgba(0,0,0,0.45)' : '0 4px 16px rgba(0,0,0,0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Top gradient accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${sev.color}, transparent)` }} />
                {/* Left severity bar */}
                <div style={{ position: 'absolute', left: 0, top: 0, width: '3px', height: '100%', background: `linear-gradient(to bottom, ${sev.color}, transparent)` }} />

                <div style={{ padding: '1.4rem 1.5rem 1.4rem 1.85rem' }}>

                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {threat.isNew && (
                        <span style={{
                          background: sev.bg,
                          border: `1px solid ${sev.color}`,
                          borderRadius: '9999px',
                          padding: '2px 10px',
                          fontFamily: 'var(--font-display)',
                          fontSize: '9px',
                          letterSpacing: '1px',
                          color: sev.color,
                          boxShadow: `0 0 10px ${sev.glow}`,
                          animation: 'blink 2.5s ease infinite',
                          fontWeight: '800'
                        }}>
                          ● {language === 'hi' ? 'नया खतरा' : 'NEW'}
                        </span>
                      )}
                      
                      <span style={{
                        background: sev.bg,
                        border: `1px solid ${sev.color}44`,
                        borderRadius: '9999px',
                        padding: '2px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: sev.color,
                        fontWeight: '800'
                      }}>
                        {language === 'hi' && threat.severity === 'Critical' ? 'गंभीर'
                          : language === 'hi' && threat.severity === 'High' ? 'उच्च'
                          : language === 'hi' && threat.severity === 'Medium' ? 'मध्यम'
                          : language === 'hi' && threat.severity === 'Low' ? 'कम'
                          : threat.severity}
                      </span>
                      
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: threat.sourceColor,
                        background: `${threat.sourceColor}0f`,
                        border: `1px solid ${threat.sourceColor}33`,
                        borderRadius: '9999px',
                        padding: '2px 10px',
                        fontWeight: '700'
                      }}>
                        {threat.source}
                      </span>
                    </div>
                    
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', whiteSpace: 'nowrap', fontWeight: '600' }}>
                      {threat.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: '800',
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.12rem)',
                    color: '#fff',
                    letterSpacing: '0.3px',
                    marginBottom: '0.65rem',
                    lineHeight: 1.4
                  }}>
                    {threat.title}
                  </h3>

                  {/* Target / Affected vendor project */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--cyber-text-muted)',
                      letterSpacing: '0.5px',
                      fontWeight: '700'
                    }}>
                      {language === 'hi' ? 'प्रभावित उत्पाद:' : 'AFFECTED:'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: 'var(--cyber-purple)',
                      fontWeight: '700',
                      background: 'rgba(192,132,252,0.06)',
                      border: '1px solid rgba(192,132,252,0.15)',
                      padding: '1px 8px',
                      borderRadius: '4px'
                    }}>
                      {threat.affectedWho}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--cyber-text)',
                    lineHeight: 1.65,
                    marginBottom: '1rem',
                    fontWeight: '500'
                  }}>
                    {threat.whatHappened}
                  </p>

                  {/* Expanded: mitigation info, ransomware indicator & URLs */}
                  {isOpen && (
                    <div style={{ animation: 'fadeInUp 0.3s ease', marginBottom: '1rem' }}>
                      <div style={{
                        background: 'rgba(139,92,246,0.04)',
                        border: '1px solid rgba(139,92,246,0.15)',
                        borderRadius: '12px',
                        padding: '1.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem'
                      }}>
                        
                        {/* Section Header */}
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          letterSpacing: '1px',
                          color: 'var(--cyber-blue)',
                          fontWeight: '600',
                          borderBottom: '1px solid rgba(139,92,246,0.15)',
                          paddingBottom: '4px'
                        }}>
                          🛡️ {ui.originalSource}
                        </div>

                        {/* Mitigation Action */}
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', fontWeight: '700', marginBottom: '3px' }}>
                            {ui.requiredAction}
                          </div>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cyber-text)', margin: 0, lineHeight: 1.5 }}>
                            {threat.requiredAction}
                          </p>
                        </div>

                        {/* Mitigation Meta Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '4px' }}>
                          <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', fontWeight: '700' }}>
                              {ui.dueDate}{' '}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-red)', fontWeight: '600' }}>
                              {formatDate(threat.dueDate)}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', fontWeight: '700' }}>
                              {ui.ransomwareTitle}{' '}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              color: threat.knownRansomware?.toLowerCase() === 'known' ? 'var(--cyber-red)' : 'var(--cyber-text-muted)',
                              fontWeight: '700'
                            }}>
                              {threat.knownRansomware?.toLowerCase() === 'known'
                                ? (language === 'hi' ? 'हां (सक्रिय उपयोग)' : 'KNOWN ACTOR USE')
                                : (language === 'hi' ? 'अज्ञात/पुष्टि नहीं' : 'UNKNOWN / UNCONFIRMED')}
                            </span>
                          </div>
                        </div>

                        {/* Advisory URL link */}
                        <div style={{ marginTop: '4px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', fontWeight: '700', marginBottom: '2px' }}>
                            {language === 'hi' ? 'सुरक्षा संदर्भ लिंक:' : 'Reference Link:'}
                          </div>
                          <a 
                            href={threat.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cyber-blue)', wordBreak: 'break-all', textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                          >
                            {threat.link}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {threat.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: 'var(--cyber-text-dim)',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--cyber-border)',
                        borderRadius: '9999px',
                        padding: '2px 10px',
                        fontWeight: '500'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : threat.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--cyber-border)',
                        borderRadius: '9999px',
                        padding: '6px 18px',
                        color: 'var(--cyber-text-dim)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: '700'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--cyber-blue)'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--cyber-border)'
                        e.currentTarget.style.color = 'var(--cyber-text-dim)'
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {isOpen ? ui.less : ui.more}
                    </button>
                    
                    <button
                      onClick={() => handleOpen(threat)}
                      style={{
                        background: sev.bg,
                        border: `1px solid ${sev.color}66`,
                        borderRadius: '9999px',
                        padding: '6px 20px',
                        color: sev.color,
                        fontFamily: 'var(--font-display)',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: '700'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 4px 16px ${sev.glow}`
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {ui.cveDetailBtn}
                    </button>

                    <button
                      onClick={() => handleAiAnalyze(threat)}
                      style={{
                        background: 'rgba(139,92,246,0.08)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        borderRadius: '9999px',
                        padding: '6px 20px',
                        color: 'var(--cyber-purple)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: '700'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(139,92,246,0.18)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,92,246,0.2)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      💡 {ui.aiAnalyzeBtn}
                    </button>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination (Load More) ── */}
      {!loading && !error && filtered.length > visibleCount && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2.5rem', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-text-dim)', fontWeight: '600' }}>
            {ui.showingText}
          </span>
          <button
            onClick={() => setVisibleCount(prev => prev + 25)}
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(192,132,252,0.12))',
              border: '1px solid var(--cyber-border2)',
              borderRadius: '9999px',
              padding: '10px 32px',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontWeight: '800',
              boxShadow: '0 4px 16px rgba(139,92,246,0.15)',
              transition: 'all 0.25s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(192,132,252,0.22))'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,92,246,0.3)'
              e.currentTarget.style.borderColor = 'var(--cyber-blue)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(192,132,252,0.12))'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.15)'
              e.currentTarget.style.borderColor = 'var(--cyber-border2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {ui.loadMore}
          </button>
        </div>
      )}

      {/* ── Auto-refresh footer ── */}
      {!loading && !error && threats.length > 0 && (
        <div style={{
          marginTop: '2.5rem',
          background: 'rgba(139,92,246,0.02)',
          border: '1px solid rgba(139,92,246,0.12)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>🔄</div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--cyber-blue)', marginBottom: '3px', fontWeight: '600' }}>
              {ui.autoRefreshFooter}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cyber-text-dim)', fontWeight: '500', lineHeight: 1.5 }}>
              {ui.autoRefreshDesc}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}