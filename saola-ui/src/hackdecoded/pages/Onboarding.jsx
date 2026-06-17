import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const BACKGROUNDS = [
  { id: 'student', labelKey: 'bg_student', descKey: 'bg_student_desc', icon: '◈', color: 'var(--cyber-blue)', prompt: 'Explain everything like I am a student learning for the first time. Use simple analogies, relatable examples, and encouraging language.' },
  { id: 'it_professional', labelKey: 'bg_it', descKey: 'bg_it_desc', icon: '◉', color: 'var(--cyber-green)', prompt: 'I work in IT. Explain security aspects in depth but avoid assuming deep security knowledge.' },
  { id: 'manager', labelKey: 'bg_manager', descKey: 'bg_manager_desc', icon: '◆', color: 'var(--cyber-purple)', prompt: 'I am a manager. Focus on business impact, financial consequences, and reputational risks.' },
  { id: 'developer', labelKey: 'bg_developer', descKey: 'bg_developer_desc', icon: '◇', color: 'var(--cyber-yellow)', prompt: 'I am a developer. Explain technical attack vectors clearly and how developers can prevent them.' },
  { id: 'general', labelKey: 'bg_general', descKey: 'bg_general_desc', icon: '○', color: 'var(--cyber-orange)', prompt: 'I have no technical background. Use everyday language and real life analogies.' },
  { id: 'security', labelKey: 'bg_security', descKey: 'bg_security_desc', icon: '◎', color: 'var(--cyber-red)', prompt: 'I am a security professional. Include technical details, IOC analysis, ATT&CK mappings, CVE details.' }
]

const LANGUAGES = [
  { id: 'en', native: 'English', flag: '🇬🇧', desc: 'All content in English' },
  { id: 'hi', native: 'हिंदी', flag: '🇮🇳', desc: 'सारी जानकारी हिंदी में' }
]

const getBgRGB = (color) => {
  const map = { 'var(--cyber-blue)': '0,212,255', 'var(--cyber-green)': '0,255,136', 'var(--cyber-purple)': '170,68,255', 'var(--cyber-yellow)': '255,221,0', 'var(--cyber-orange)': '255,136,0', 'var(--cyber-red)': '255,51,85' }
  return map[color] || '0,212,255'
}

// Steps: 1=Language, 2=SignIn, 3=Background
export default function Onboarding({ onComplete }) {
  const { t, setLanguage, language } = useLang()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [animating, setAnimating] = useState(false)
  const [selectedLang, setSelectedLang] = useState(language)
  const [selected, setSelected] = useState(null)

  // Sign in form state
  const [authMode, setAuthMode] = useState('login') // login | register
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  const goNext = () => {
    setAnimating(true)
    setTimeout(() => { setStep(s => s + 1); setAnimating(false) }, 250)
  }

  const goBack = () => {
    setAnimating(true)
    setTimeout(() => { setStep(s => s - 1); setAnimating(false) }, 250)
  }

  const handleLangSelect = (langId) => {
    setSelectedLang(langId)
    setLanguage(langId)
    goNext()
  }

  const handleGoogleSignIn = () => {
    // Simulate Google sign-in with a mock user
    const mockUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'G',
      provider: 'google'
    }
    setLoggedInUser(mockUser)
    setAuthError('')
    goNext()
  }

  const handleAuth = (e) => {
    e.preventDefault()
    setAuthError('')

    if (authMode === 'register') {
      if (!username.trim()) { setAuthError('Please enter a username'); return }
      if (!email.includes('@')) { setAuthError('Please enter a valid email'); return }
      if (password.length < 6) { setAuthError('Password must be at least 6 characters'); return }
      if (password !== confirmPassword) { setAuthError('Passwords do not match'); return }

      // Save to localStorage as "registered users"
      const users = JSON.parse(localStorage.getItem('hd_users') || '[]')
      const exists = users.find(u => u.email === email)
      if (exists) { setAuthError('An account with this email already exists'); return }

      const newUser = { name: username, email, password, avatar: username[0]?.toUpperCase() || 'U' }
      users.push(newUser)
      localStorage.setItem('hd_users', JSON.stringify(users))
      setLoggedInUser(newUser)
      goNext()

    } else {
      // Login
      if (!email.trim() || !password.trim()) { setAuthError('Please fill in all fields'); return }
      const users = JSON.parse(localStorage.getItem('hd_users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      if (!user) { setAuthError('Invalid email or password. Try registering first.'); return }
      setLoggedInUser(user)
      goNext()
    }
  }

  const handleComplete = () => {
    if (!selected || !loggedInUser) return
    const profile = {
      name: loggedInUser.name,
      email: loggedInUser.email,
      avatar: loggedInUser.avatar,
      background: selected,
      prompt: selected.prompt,
      language: selectedLang
    }
    onComplete(profile)
    navigate('/')
  }

  // Step indicators
  const STEPS = [
    { n: 1, label: selectedLang === 'hi' ? 'भाषा' : 'Language' },
    { n: 2, label: selectedLang === 'hi' ? 'साइन इन' : 'Sign In' },
    { n: 3, label: selectedLang === 'hi' ? 'प्रोफ़ाइल' : 'Profile' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cyber-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>

      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '8%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(170,68,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '680px', opacity: animating ? 0 : 1, transform: animating ? 'translateY(10px)' : 'translateY(0)', transition: 'all 0.25s ease' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color: 'var(--cyber-blue)', marginBottom: '0.5rem' }}>
            {t('ob_init')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700', color: '#fff', letterSpacing: '2px' }}>
            HACK<span style={{ color: 'var(--cyber-blue)' }}>DECODED</span>
          </h1>
          <p style={{ color: 'var(--cyber-text-dim)', marginTop: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
            Cybersecurity intelligence — translated for humans
          </p>
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '2rem' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  border: `1px solid ${step >= s.n ? 'var(--cyber-blue)' : 'var(--cyber-border)'}`,
                  background: step > s.n ? 'var(--cyber-blue)' : step === s.n ? 'rgba(0,212,255,0.15)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: step >= s.n ? (step > s.n ? '#000' : 'var(--cyber-blue)') : 'var(--cyber-text-dim)',
                  transition: 'all 0.3s', fontWeight: step > s.n ? '700' : '400'
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: step >= s.n ? 'var(--cyber-blue)' : 'var(--cyber-text-dim)', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  {s.label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: '50px', height: '1px', background: step > s.n ? 'var(--cyber-blue)' : 'var(--cyber-border)', transition: 'all 0.3s', marginBottom: '16px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ─── STEP 1 — Language ─── */}
        {step === 1 && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1.25rem 1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-blue), transparent)' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-blue)', marginBottom: '4px' }}>▸ STEP 01 — LANGUAGE</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>Choose your language</h2>
              <p style={{ color: 'var(--cyber-text-dim)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', marginTop: '2px' }}>Select the language for your entire experience.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {LANGUAGES.map(lang => (
                <button key={lang.id} onClick={() => handleLangSelect(lang.id)} style={{
                  background: selectedLang === lang.id ? 'rgba(0,212,255,0.1)' : 'var(--cyber-card)',
                  border: `1px solid ${selectedLang === lang.id ? 'var(--cyber-blue)' : 'var(--cyber-border)'}`,
                  borderRadius: '4px', padding: '2rem 1rem', cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyber-blue)'; e.currentTarget.style.background = 'rgba(0,212,255,0.08)' }}
                  onMouseLeave={e => { if (selectedLang !== lang.id) { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.background = 'var(--cyber-card)' } }}
                >
                  {selectedLang === lang.id && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-blue), transparent)' }} />}
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{lang.flag}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '600', color: selectedLang === lang.id ? 'var(--cyber-blue)' : '#fff', letterSpacing: '1px', marginBottom: '0.25rem' }}>{lang.native}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cyber-text-dim)' }}>{lang.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 2 — Sign In ─── */}
        {step === 2 && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>

            {/* Back button */}
            <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', marginBottom: '1rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cyber-blue)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--cyber-text-dim)'}
            >
              ◀ {selectedLang === 'hi' ? 'वापस जाएं' : 'GO BACK'}
            </button>

            <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-green), transparent)' }} />

              <div style={{ padding: '2rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-green)', marginBottom: '0.5rem' }}>
                  ▸ STEP 02 — {selectedLang === 'hi' ? 'साइन इन' : 'SIGN IN'}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '600', color: '#fff', marginBottom: '0.25rem', letterSpacing: '1px' }}>
                  {selectedLang === 'hi' ? 'अपने खाते में लॉग इन करें' : 'Sign in to your account'}
                </h2>
                <p style={{ color: 'var(--cyber-text-dim)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', marginBottom: '1.75rem' }}>
                  {selectedLang === 'hi' ? 'आपकी प्रगति सहेजी जाएगी' : 'Your progress will be saved'}
                </p>

                {/* Google Button */}
                <button onClick={handleGoogleSignIn} style={{
                  width: '100%', padding: '0.85rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px', color: '#fff',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  marginBottom: '1.25rem'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                >
                  {/* Google G icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {selectedLang === 'hi' ? 'Google से जारी रखें' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--cyber-border)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', letterSpacing: '2px' }}>
                    {selectedLang === 'hi' ? 'या' : 'OR'}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--cyber-border)' }} />
                </div>

                {/* Auth mode toggle */}
                <div style={{ display: 'flex', marginBottom: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '3px' }}>
                  {[
                    { mode: 'login', label: selectedLang === 'hi' ? 'लॉग इन' : 'Log In' },
                    { mode: 'register', label: selectedLang === 'hi' ? 'रजिस्टर करें' : 'Register' }
                  ].map(item => (
                    <button key={item.mode} onClick={() => { setAuthMode(item.mode); setAuthError('') }} style={{
                      flex: 1, padding: '0.6rem',
                      background: authMode === item.mode ? 'rgba(0,212,255,0.15)' : 'transparent',
                      border: `1px solid ${authMode === item.mode ? 'var(--cyber-blue)' : 'transparent'}`,
                      borderRadius: '3px', color: authMode === item.mode ? 'var(--cyber-blue)' : 'var(--cyber-text-dim)',
                      fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>{item.label}</button>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {authMode === 'register' && (
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--cyber-text-dim)', display: 'block', marginBottom: '6px' }}>
                        {selectedLang === 'hi' ? 'USERNAME' : 'USERNAME'}
                      </label>
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={selectedLang === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'} style={{ width: '100%', background: 'rgba(0,212,255,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '0.75rem 1rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = 'var(--cyber-blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--cyber-border)'}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--cyber-text-dim)', display: 'block', marginBottom: '6px' }}>EMAIL</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', background: 'rgba(0,212,255,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '0.75rem 1rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = 'var(--cyber-blue)'}
                      onBlur={e => e.target.style.borderColor = 'var(--cyber-border)'}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--cyber-text-dim)', display: 'block', marginBottom: '6px' }}>
                      {selectedLang === 'hi' ? 'पासवर्ड' : 'PASSWORD'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', background: 'rgba(0,212,255,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '0.75rem 3rem 0.75rem 1rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = 'var(--cyber-blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--cyber-border)'}
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--cyber-text-dim)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--cyber-text-dim)', display: 'block', marginBottom: '6px' }}>
                        {selectedLang === 'hi' ? 'पासवर्ड दोहराएं' : 'CONFIRM PASSWORD'}
                      </label>
                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', background: 'rgba(0,212,255,0.04)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '0.75rem 1rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = 'var(--cyber-blue)'}
                        onBlur={e => e.target.style.borderColor = 'var(--cyber-border)'}
                      />
                    </div>
                  )}

                  {/* Error message */}
                  {authError && (
                    <div style={{ background: 'rgba(255,51,85,0.1)', border: '1px solid rgba(255,51,85,0.4)', borderRadius: '4px', padding: '0.6rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyber-red)' }}>
                      ⚠ {authError}
                    </div>
                  )}

                  <button type="submit" style={{
                    width: '100%', padding: '0.9rem',
                    background: 'rgba(0,255,136,0.1)',
                    border: '1px solid var(--cyber-green)',
                    borderRadius: '4px', color: 'var(--cyber-green)',
                    fontFamily: 'var(--font-display)', fontSize: '12px',
                    letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}
                  >
                    {authMode === 'login'
                      ? (selectedLang === 'hi' ? 'लॉग इन करें ▸' : 'LOG IN ▸')
                      : (selectedLang === 'hi' ? 'खाता बनाएं ▸' : 'CREATE ACCOUNT ▸')
                    }
                  </button>
                </form>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--cyber-text-dim)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.5 }}>
                  {selectedLang === 'hi'
                    ? '🔒 आपका डेटा सुरक्षित है। हम कुछ भी शेयर नहीं करते।'
                    : '🔒 Your data stays private. We never share anything.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3 — Background ─── */}
        {step === 3 && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>

            {/* Back button */}
            <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', marginBottom: '1rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cyber-blue)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--cyber-text-dim)'}
            >
              ◀ {selectedLang === 'hi' ? 'वापस जाएं' : 'GO BACK'}
            </button>

            <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '4px', padding: '1.25rem 1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-purple), transparent)' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--cyber-purple)', marginBottom: '4px' }}>
                ▸ STEP 03 — {selectedLang === 'hi' ? 'प्रोफ़ाइल' : 'PROFILE'}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>
                {selectedLang === 'hi' ? `${loggedInUser?.name}, आपकी पृष्ठभूमि क्या है?` : `${loggedInUser?.name}, what is your background?`}
              </h2>
              <p style={{ color: 'var(--cyber-text-dim)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', marginTop: '2px' }}>
                {selectedLang === 'hi' ? 'AI आपके लिए व्याख्या को व्यक्तिगत बनाएगा।' : 'AI will personalize explanations for your level.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '10px', marginBottom: '1rem' }}>
              {BACKGROUNDS.map((bg, i) => (
                <button key={bg.id} onClick={() => setSelected(bg)} style={{
                  background: selected?.id === bg.id ? `rgba(${getBgRGB(bg.color)},0.1)` : 'var(--cyber-card)',
                  border: `1px solid ${selected?.id === bg.id ? bg.color : 'var(--cyber-border)'}`,
                  borderRadius: '4px', padding: '1rem', cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                  animation: `fadeInUp 0.3s ease ${i * 0.05}s both`
                }}>
                  {selected?.id === bg.id && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${bg.color}, transparent)` }} />}
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.35rem', color: selected?.id === bg.id ? bg.color : 'var(--cyber-text-dim)' }}>{bg.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: '600', color: selected?.id === bg.id ? bg.color : '#fff', letterSpacing: '1px', marginBottom: '0.2rem' }}>{t(bg.labelKey)}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--cyber-text-dim)', lineHeight: 1.4 }}>{t(bg.descKey)}</div>
                </button>
              ))}
            </div>

            <button onClick={handleComplete} disabled={!selected} style={{
              width: '100%', padding: '1rem',
              background: selected ? 'rgba(170,68,255,0.1)' : 'transparent',
              border: `1px solid ${selected ? 'var(--cyber-purple)' : 'var(--cyber-border)'}`,
              borderRadius: '4px', color: selected ? 'var(--cyber-purple)' : 'var(--cyber-text-dim)',
              fontFamily: 'var(--font-display)', fontSize: '12px',
              letterSpacing: '3px', cursor: selected ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
            }}>
              {selectedLang === 'hi' ? 'सिस्टम शुरू करें ▸' : 'INITIALIZE SYSTEM ▸'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}