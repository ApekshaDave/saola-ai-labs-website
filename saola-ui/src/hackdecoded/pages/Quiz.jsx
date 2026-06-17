import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

async function generateQuiz(articleText, language, userProfile) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  const langInst = language === 'hi' ? 'Generate ALL questions, options, and explanations in Hindi. Keep CVE numbers and tool names in English.' : 'Generate in English.'
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: `${langInst}\nAdapt difficulty for: ${userProfile?.background?.prompt || 'general audience'}.\nGenerate 5 multiple choice questions about this article. Return ONLY valid JSON:\n{"questions":[{"question":"?","options":["A","B","C","D"],"correctIndex":0,"explanation":"why"}]}\nArticle: ${articleText.substring(0, 3500)}` }],
      temperature: 0.4, max_tokens: 2000
    })
  })
  const data = await response.json()
  const raw = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(raw)
}

export default function Quiz({ userProfile }) {
  const { t, language } = useLang()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    const txt = localStorage.getItem('articleText')
    if (!txt) { navigate('/'); return }
    generateQuiz(txt, language, userProfile)
      .then(d => setQuestions(d.questions))
      .catch(() => setError(t('quiz_error')))
      .finally(() => setLoading(false))
  }, [navigate, language, userProfile, t])

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === questions[currentQ].correctIndex
    if (correct) setScore(s => s + 1)
    setAnswers(prev => [...prev, { selected: idx, correct: questions[currentQ].correctIndex, isCorrect: correct }])
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(q => q + 1); setSelected(null); setAnswered(false) }
    else setFinished(true)
  }

  const retry = () => { setCurrentQ(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); setAnswers([]) }

  const scoreColor = () => { const p = (score / questions.length) * 100; return p >= 80 ? '#00ff88' : p >= 50 ? '#ffcc00' : '#ff2244' }
  const scoreMsg = () => { const p = (score / questions.length) * 100; return p >= 80 ? t('quiz_excellent') : p >= 50 ? t('quiz_good') : t('quiz_keep') }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
      <div style={{ width: '50px', height: '50px', border: '1px solid #00d4ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1.5s linear infinite', boxShadow: '0 0 16px rgba(0,212,255,0.3)' }} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#00d4ff', letterSpacing: '3px' }}>{t('quiz_generating')}</div>
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      <div style={{ background: 'rgba(255,34,68,0.08)', border: '1px solid rgba(255,34,68,0.3)', borderRadius: '8px', padding: '2rem' }}>
        <p style={{ color: '#ff2244', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={() => navigate('/explainer')} style={{ background: 'transparent', border: '1px solid #ff2244', borderRadius: '4px', padding: '8px 20px', color: '#ff2244', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer' }}>{t('quiz_back')}</button>
      </div>
    </div>
  )

  if (finished) {
    const sc = scoreColor()
    return (
      <div className="page-container" style={{ maxWidth: '680px' }}>
        <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: `linear-gradient(90deg, transparent, ${sc}, transparent)` }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '4px', color: sc, marginBottom: '1.5rem', textShadow: `0 0 8px ${sc}60` }}>{t('quiz_results')}</div>
          <div style={{ width: '110px', height: '110px', border: `3px solid ${sc}`, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: `0 0 30px ${sc}30, inset 0 0 20px ${sc}08` }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: '800', color: sc, lineHeight: 1, textShadow: `0 0 16px ${sc}80` }}>{score}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)' }}>/ {questions.length}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', color: 'var(--cyber-text-dim)', marginBottom: '0.5rem' }}>{t('quiz_score')}</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#fff', marginBottom: '2rem', lineHeight: 1.5 }}>{scoreMsg()}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem', textAlign: 'left' }}>
            {answers.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: a.isCorrect ? 'rgba(0,255,136,0.05)' : 'rgba(255,34,68,0.05)', border: `1px solid ${a.isCorrect ? 'rgba(0,255,136,0.15)' : 'rgba(255,34,68,0.15)'}`, borderRadius: '4px', padding: '10px 14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: a.isCorrect ? '#00ff88' : '#ff2244', minWidth: '18px', textShadow: a.isCorrect ? '0 0 8px rgba(0,255,136,0.6)' : '0 0 8px rgba(255,34,68,0.6)' }}>{a.isCorrect ? '✓' : '✗'}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)' }}>Q{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--cyber-text)', flex: 1 }}>{questions[i]?.question}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={retry} style={{ padding: '0.8rem 1.5rem', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '6px', color: '#00d4ff', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(0,212,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >{t('quiz_retry')}</button>
            <button onClick={() => navigate('/explainer')} style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '1px solid var(--cyber-border)', borderRadius: '6px', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer' }}>{t('quiz_back')}</button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  const progress = (currentQ / questions.length) * 100

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: '#00d4ff', marginBottom: '0.5rem' }}>{t('quiz_label')}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: '700', color: '#fff', letterSpacing: '2px' }}>{t('quiz_title')}</h1>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.5)' }}>{t('quiz_question')} {currentQ + 1} {t('quiz_of')} {questions.length}</span>
        </div>
        <div style={{ height: '3px', background: 'var(--cyber-border)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #00d4ff, #9944ff)', transition: 'width 0.4s ease', boxShadow: '0 0 8px rgba(0,212,255,0.4)' }} />
        </div>
      </div>

      <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '8px', padding: '1.75rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #00d4ff 40%, #9944ff 60%, transparent)', opacity: 0.6 }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: '#fff', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: '500' }}>{q?.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q?.options.map((opt, i) => {
            let borderColor = 'var(--cyber-border)', bg = 'transparent', color = 'var(--cyber-text)', glow = 'none'
            if (answered) {
              if (i === q.correctIndex) { borderColor = '#00ff88'; bg = 'rgba(0,255,136,0.07)'; color = '#00ff88'; glow = '0 0 12px rgba(0,255,136,0.15)' }
              else if (i === selected) { borderColor = '#ff2244'; bg = 'rgba(255,34,68,0.07)'; color = '#ff2244' }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: '5px', padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', boxShadow: glow }}
                onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.background = 'rgba(0,212,255,0.05)' } }}
                onMouseLeave={e => { if (!answered) { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.background = 'transparent' } }}
              >
                <span style={{ minWidth: '28px', height: '28px', border: `1px solid ${borderColor}`, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color, flexShrink: 0, transition: 'all 0.2s' }}>
                  {answered && i === q.correctIndex ? '✓' : answered && i === selected && i !== q.correctIndex ? '✗' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color, lineHeight: 1.4, transition: 'color 0.2s' }}>{opt}</span>
              </button>
            )
          })}
        </div>
      </div>

      {answered && (
        <div style={{ background: selected === q.correctIndex ? 'rgba(0,255,136,0.05)' : 'rgba(255,102,0,0.05)', border: `1px solid ${selected === q.correctIndex ? 'rgba(0,255,136,0.2)' : 'rgba(255,102,0,0.2)'}`, borderRadius: '6px', padding: '1.1rem', marginBottom: '1rem', animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '3px', color: selected === q.correctIndex ? '#00ff88' : '#ff6600', marginBottom: '5px' }}>
            {selected === q.correctIndex ? `✓ ${t('quiz_correct')}` : `✗ ${t('quiz_wrong')}`} — {t('quiz_explanation')}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text)', lineHeight: 1.6, margin: 0 }}>{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button onClick={handleNext} style={{ width: '100%', padding: '1rem', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '6px', color: '#00d4ff', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 16px rgba(0,212,255,0.08)', animation: 'fadeInUp 0.3s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.15)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,212,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,212,255,0.08)' }}
        >
          {currentQ < questions.length - 1 ? t('quiz_next') : t('quiz_finish')}
        </button>
      )}
    </div>
  )
}