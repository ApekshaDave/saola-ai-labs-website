import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const NEWS_SOURCES = [
  {
    id: 1,
    name: 'The Hacker News',
    url: 'https://thehackernews.com',
    description: 'Most popular cybersecurity news site. Daily threat reports, malware analysis, and breach news.',
    category: 'General Security',
    color: 'var(--cyber-red)',
    icon: '◈',
    language: 'English',
    updateFreq: 'Multiple times daily',
    bestFor: 'Latest breach news and threat reports'
  },
  {
    id: 2,
    name: 'Bleeping Computer',
    url: 'https://www.bleepingcomputer.com',
    description: 'Detailed technical writeups on ransomware, malware, and software vulnerabilities. Very thorough.',
    category: 'Technical Analysis',
    color: 'var(--cyber-blue)',
    icon: '◆',
    language: 'English',
    updateFreq: 'Daily',
    bestFor: 'Detailed technical analysis of attacks'
  },
  {
    id: 3,
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com',
    description: 'Investigative cybersecurity journalism by Brian Krebs. Deep dives into cybercrime operations.',
    category: 'Investigative',
    color: 'var(--cyber-orange)',
    icon: '◉',
    language: 'English',
    updateFreq: 'Few times a week',
    bestFor: 'Investigative reports on cybercrime'
  },
  {
    id: 4,
    name: 'Dark Reading',
    url: 'https://www.darkreading.com',
    description: 'Enterprise security news covering vulnerabilities, threats, and security operations.',
    category: 'Enterprise Security',
    color: 'var(--cyber-purple)',
    icon: '◇',
    language: 'English',
    updateFreq: 'Daily',
    bestFor: 'Enterprise and business security news'
  },
  {
    id: 5,
    name: 'Cyber Scoop',
    url: 'https://cyberscoop.com',
    description: 'Cybersecurity policy, government breaches, and national security stories.',
    category: 'Policy & Government',
    color: 'var(--cyber-green)',
    icon: '○',
    language: 'English',
    updateFreq: 'Daily',
    bestFor: 'Government and policy related cyber news'
  },
  {
    id: 6,
    name: 'SecurityWeek',
    url: 'https://www.securityweek.com',
    description: 'Broad cybersecurity coverage including industry news, vulnerabilities, and threat intelligence.',
    category: 'General Security',
    color: 'var(--cyber-yellow)',
    icon: '◎',
    language: 'English',
    updateFreq: 'Daily',
    bestFor: 'Industry news and vulnerability disclosures'
  },
  {
    id: 7,
    name: 'CERT-In Alerts',
    url: 'https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES01',
    description: 'Official Indian government cybersecurity alerts. Critical for India-specific threats and advisories.',
    category: 'India Specific',
    color: 'var(--cyber-red)',
    icon: '◈',
    language: 'English',
    updateFreq: 'As needed',
    bestFor: 'Official India government security alerts'
  },
  {
    id: 8,
    name: 'CISA Alerts',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    description: 'US government cybersecurity advisories. When CISA warns, everyone should pay attention.',
    category: 'Government Alerts',
    color: 'var(--cyber-blue)',
    icon: '◆',
    language: 'English',
    updateFreq: 'As needed',
    bestFor: 'Official government threat advisories'
  },
  {
    id: 9,
    name: 'Threatpost',
    url: 'https://threatpost.com',
    description: 'Independent news site covering the latest cybersecurity threats, vulnerabilities, and trends.',
    category: 'Threat Intelligence',
    color: 'var(--cyber-orange)',
    icon: '◉',
    language: 'English',
    updateFreq: 'Daily',
    bestFor: 'Threat intelligence and vulnerability news'
  },
  {
    id: 10,
    name: 'SANS Internet Storm Center',
    url: 'https://isc.sans.edu',
    description: 'Real-time threat monitoring and daily threat diaries written by security experts worldwide.',
    category: 'Threat Monitoring',
    color: 'var(--cyber-purple)',
    icon: '◇',
    language: 'English',
    updateFreq: 'Daily',
    bestFor: 'Real-time global threat monitoring'
  },
  {
    id: 11,
    name: 'Recorded Future Blog',
    url: 'https://www.recordedfuture.com/blog',
    description: 'Threat intelligence research from one of the top cyber intelligence companies.',
    category: 'Threat Intelligence',
    color: 'var(--cyber-green)',
    icon: '○',
    language: 'English',
    updateFreq: 'Weekly',
    bestFor: 'In-depth threat intelligence research'
  },
  {
    id: 12,
    name: 'Indian Express Tech',
    url: 'https://indianexpress.com/section/technology/tech-news-technology/',
    description: 'Indian technology and cybersecurity news in simple language. Good for India-specific coverage.',
    category: 'India Specific',
    color: 'var(--cyber-yellow)',
    icon: '◎',
    language: 'English + Hindi',
    updateFreq: 'Daily',
    bestFor: 'India-specific tech and cyber news'
  },
]

const CATEGORIES = ['All', 'General Security', 'Technical Analysis', 'Investigative', 'India Specific', 'Government Alerts', 'Threat Intelligence', 'Threat Monitoring', 'Enterprise Security', 'Policy & Government']

export default function CyberNews() {
  const { t, language } = useLang()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [pastedUrl, setPastedUrl] = useState('')

  const filtered = selectedCategory === 'All'
    ? NEWS_SOURCES
    : NEWS_SOURCES.filter(s => s.category === selectedCategory)

  const handleAnalyzeUrl = () => {
    if (!pastedUrl.trim()) return
    localStorage.setItem('articleText', `Please analyze this URL for cybersecurity news: ${pastedUrl}`)
    navigate('/explainer')
  }

  const handleVisitAndAnalyze = (source) => {
    // Open the URL in new tab
    window.open(source.url, '_blank')
    // Also set a helpful prompt for when they come back
    localStorage.setItem('lastVisitedSource', source.name)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: 'var(--cyber-blue)', marginBottom: '0.75rem' }}>
          ▸ {language === 'hi' ? 'साइबर समाचार स्रोत' : 'CYBER NEWS SOURCES'}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: '700', color: '#fff', letterSpacing: '2px', marginBottom: '0.5rem' }}>
          {language === 'hi' ? 'साइबर समाचार' : 'CYBER NEWS'}
        </h1>
        <p style={{ color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
          {language === 'hi'
            ? 'विश्वसनीय साइबर सुरक्षा समाचार स्रोत। किसी भी लेख को पढ़ें और AI से विश्लेषण करवाएं।'
            : 'Trusted cybersecurity news sources. Read any article then come back to get AI analysis.'
          }
        </p>
      </div>

      {/* Paste URL to analyze */}
      <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.5s ease 0.05s both', boxShadow: '0 8px 24px rgba(139,92,246,0.08)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-blue), transparent)' }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-blue)', marginBottom: '0.75rem', fontWeight: '600' }}>
          ▸ {language === 'hi' ? 'किसी भी लेख का URL पेस्ट करें' : 'ALREADY FOUND AN ARTICLE? PASTE THE URL'}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="url"
            value={pastedUrl}
            onChange={e => setPastedUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyzeUrl()}
            placeholder={language === 'hi' ? 'https://thehackernews.com/2026/...' : 'https://thehackernews.com/2026/...'}
            style={{ flex: 1, background: 'rgba(139,92,246,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '10px', padding: '0.85rem 1.1rem', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--cyber-blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--cyber-border)'; e.target.style.boxShadow = 'none' }}
          />
          <button onClick={handleAnalyzeUrl} disabled={!pastedUrl.trim()} style={{
            background: pastedUrl.trim() ? 'rgba(139,92,246,0.15)' : 'transparent',
            border: `1px solid ${pastedUrl.trim() ? 'var(--cyber-blue)' : 'var(--cyber-border)'}`,
            borderRadius: '9999px', padding: '0.85rem 1.75rem',
            color: pastedUrl.trim() ? '#fff' : 'var(--cyber-text-dim)',
            fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '2px', fontWeight: '700',
            cursor: pastedUrl.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', whiteSpace: 'nowrap',
            boxShadow: pastedUrl.trim() ? '0 4px 12px rgba(139,92,246,0.2)' : 'none'
          }}>
            {language === 'hi' ? 'AI विश्लेषण ▸' : 'AI ANALYZE ▸'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-text-dim)', marginBottom: '0.75rem' }}>
          ▸ {language === 'hi' ? 'श्रेणी के अनुसार फ़िल्टर करें' : 'FILTER BY CATEGORY'}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
              background: selectedCategory === cat ? 'rgba(139,92,246,0.15)' : 'transparent',
              border: `1px solid ${selectedCategory === cat ? 'var(--cyber-blue)' : 'var(--cyber-border)'}`,
              borderRadius: '9999px', padding: '5px 14px',
              color: selectedCategory === cat ? '#fff' : 'var(--cyber-text-dim)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              boxShadow: selectedCategory === cat ? '0 2px 8px rgba(139,92,246,0.2)' : 'none'
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Source Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map((source, i) => (
          <div key={source.id} style={{
            background: 'var(--cyber-card)',
            border: '1px solid var(--cyber-border)',
            borderRadius: '16px', overflow: 'hidden',
            position: 'relative', transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
            animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = source.color; e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px ${source.color}44`; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${source.color}, transparent)`, opacity: 0.9 }} />

            <div style={{ padding: '1.35rem', flex: 1 }}>
              {/* Category badge */}
              <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: source.color, background: `${source.color}12`, border: `1px solid ${source.color}33`, borderRadius: '9999px', padding: '3px 10px', fontWeight: '600' }}>
                  {source.category}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)' }}>
                  🌐 {source.language}
                </span>
              </div>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
                <span style={{ color: source.color, fontSize: '1rem' }}>{source.icon}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: '700', color: '#fff', letterSpacing: '0.5px', margin: 0 }}>
                  {source.name}
                </h3>
              </div>

              {/* Description */}
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--cyber-text-dim)', lineHeight: 1.6, marginBottom: '0.85rem', fontWeight: '500' }}>
                {source.description}
              </p>

              {/* Best for */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: source.color, letterSpacing: '1px', flexShrink: 0, marginTop: '2px', fontWeight: '700' }}>BEST FOR:</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.79rem', color: 'var(--cyber-text-dim)', fontWeight: '500' }}>{source.bestFor}</span>
              </div>

              {/* Update frequency */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', letterSpacing: '1px', fontWeight: '600' }}>
                🕐 {source.updateFreq}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px', padding: '0 1.35rem 1.35rem' }}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, padding: '0.65rem',
                  background: `${source.color}10`,
                  border: `1px solid ${source.color}44`,
                  borderRadius: '9999px', color: source.color,
                  fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: '700',
                  letterSpacing: '2px', textDecoration: 'none',
                  textAlign: 'center', transition: 'all 0.2s', display: 'block'
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${source.color}22`}
                onMouseLeave={e => e.currentTarget.style.background = `${source.color}10`}
              >
                {language === 'hi' ? 'खोलें ▸' : 'OPEN ▸'}
              </a>
              <button
                onClick={() => {
                  setPastedUrl(source.url)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                style={{
                  flex: 1, padding: '0.65rem',
                  background: 'transparent',
                  border: '1px solid var(--cyber-border)',
                  borderRadius: '9999px', color: 'var(--cyber-text-dim)',
                  fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: '600',
                  letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyber-blue)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.color = 'var(--cyber-text-dim)'; e.currentTarget.style.background = 'transparent' }}
              >
                {language === 'hi' ? 'AI विश्लेषण' : 'AI ANALYZE'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* How to use section */}
      <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '16px', padding: '1.75rem', marginTop: '2rem', position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.5s ease 0.3s both', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-purple), transparent)' }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-purple)', marginBottom: '1rem', fontWeight: '600' }}>
          ▸ {language === 'hi' ? 'इसका उपयोग कैसे करें' : 'HOW TO USE THIS'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { step: '01', text: language === 'hi' ? 'ऊपर किसी भी न्यूज़ साइट पर क्लिक करें' : 'Click any news site above to open it', color: 'var(--cyber-blue)' },
            { step: '02', text: language === 'hi' ? 'कोई भी लेख पढ़ें जो आपको दिलचस्प लगे' : 'Read any article that interests you', color: 'var(--cyber-green)' },
            { step: '03', text: language === 'hi' ? 'उस लेख का URL कॉपी करें' : 'Copy the URL of that article', color: 'var(--cyber-yellow)' },
            { step: '04', text: language === 'hi' ? 'ऊपर URL पेस्ट करें और AI विश्लेषण पाएं' : 'Paste URL above and get AI analysis', color: 'var(--cyber-purple)' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '700', color: item.color, flexShrink: 0, lineHeight: 1 }}>{item.step}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cyber-text-dim)', lineHeight: 1.5, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}