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

  const scoreColor = () => { const p = (score / questions.length) * 100; return p >= 80 ? 'var(--cyber-green)' : p >= 50 ? 'var(--cyber-yellow)' : 'var(--cyber-red)' }
  const scoreMsg = () => { const p = (score / questions.length) * 100; return p >= 80 ? t('quiz_excellent') : p >= 50 ? t('quiz_good') : t('quiz_keep') }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
      <div style={{ width: '52px', height: '52px', border: '2px solid var(--cyber-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1.5s linear infinite', boxShadow: '0 0 16px rgba(139,92,246,0.2)' }} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--cyber-blue)', letterSpacing: '2px', fontWeight: '700', textShadow: '0 0 10px rgba(139,92,246,0.3)' }}>{t('quiz_generating')}</div>
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '12px', padding: '2rem' }}>
        <p style={{ color: 'var(--cyber-red)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '1.5rem', fontWeight: '600' }}>{error}</p>
        <button onClick={() => navigate('/explainer')} style={{ background: 'transparent', border: '1px solid var(--cyber-red)', borderRadius: '9999px', padding: '8px 24px', color: 'var(--cyber-red)', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', fontWeight: '700' }}>{t('quiz_back')}</button>
      </div>
    </div>
  )

  if (finished) {
    const sc = scoreColor()
    return (
      <div className="page-container" style={{ maxWidth: '680px', padding: '3.5rem 1.25rem' }}>
        <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: `linear-gradient(90deg, transparent, ${sc}, transparent)` }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: sc, marginBottom: '1.5rem', textShadow: `0 0 8px ${sc}40`, fontWeight: '600' }}>{t('quiz_results')}</div>
          <div style={{ width: '110px', height: '110px', border: `3px solid ${sc}`, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: `0 0 30px ${sc}15, inset 0 0 20px ${sc}05` }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: '800', color: sc, lineHeight: 1, textShadow: `0 0 16px ${sc}60` }}>{score}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyber-text-dim)', fontWeight: '600' }}>/ {questions.length}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', color: 'var(--cyber-text-dim)', marginBottom: '0.5rem', fontWeight: '600' }}>{t('quiz_score')}</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#fff', marginBottom: '2rem', lineHeight: 1.5, fontWeight: '500' }}>{scoreMsg()}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem', textAlign: 'left' }}>
            {answers.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: a.isCorrect ? 'rgba(16,185,129,0.04)' : 'rgba(244,63,94,0.04)', border: `1px solid ${a.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}`, borderRadius: '8px', padding: '10px 14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: a.isCorrect ? 'var(--cyber-green)' : 'var(--cyber-red)', minWidth: '18px', fontWeight: '800' }}>{a.isCorrect ? '✓' : '✗'}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cyber-text-dim)', fontWeight: '600' }}>Q{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--cyber-text)', flex: 1 }}>{questions[i]?.question}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={retry} style={{ padding: '0.8rem 1.75rem', background: 'rgba(139,92,246,0.12)', border: '1px solid var(--cyber-blue)', borderRadius: '9999px', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '700', boxShadow: '0 4px 12px rgba(139,92,246,0.15)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,92,246,0.15)' }}
            >{t('quiz_retry')}</button>
            <button onClick={() => navigate('/explainer')} style={{ padding: '0.8rem 1.75rem', background: 'transparent', border: '1px solid var(--cyber-border)', borderRadius: '9999px', color: 'var(--cyber-text-dim)', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--cyber-blue)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--cyber-text-dim)'; e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.background = 'transparent' }}
            >{t('quiz_back')}</button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  const progress = (currentQ / questions.length) * 100

  return (
    <div className="page-container" style={{ maxWidth: '680px', padding: '3.5rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--cyber-blue)', marginBottom: '0.5rem', fontWeight: '600' }}>{t('quiz_label')}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', fontWeight: '800', color: '#fff', letterSpacing: '1px' }}>{t('quiz_title')}</h1>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--cyber-blue)', textShadow: '0 0 8px rgba(139,92,246,0.3)', fontWeight: '600' }}>{t('quiz_question')} {currentQ + 1} {t('quiz_of')} {questions.length}</span>
        </div>
        <div style={{ height: '3px', background: 'var(--cyber-border)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--cyber-blue), var(--cyber-purple))', transition: 'width 0.4s ease', boxShadow: '0 0 8px rgba(139,92,246,0.3)' }} />
        </div>
      </div>

      <div style={{ background: 'var(--cyber-card)', border: '1px solid var(--cyber-border)', borderRadius: '16px', padding: '2rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyber-blue) 40%, var(--cyber-purple) 60%, transparent)', opacity: 0.6 }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.98rem, 2vw, 1.1rem)', color: '#fff', lineHeight: 1.6, marginBottom: '1.75rem', fontWeight: '600' }}>{q?.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q?.options.map((opt, i) => {
            let borderColor = 'var(--cyber-border)', bg = 'transparent', color = 'var(--cyber-text)', glow = 'none'
            if (answered) {
              if (i === q.correctIndex) { borderColor = 'var(--cyber-green)'; bg = 'rgba(16,185,129,0.06)'; color = 'var(--cyber-green)'; glow = '0 0 12px rgba(16,185,129,0.15)' }
              else if (i === selected) { borderColor = 'var(--cyber-red)'; bg = 'rgba(244,63,94,0.06)'; color = 'var(--cyber-red)' }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: answered ? 'default' : 'pointer', transition: 'all 0.25s', textAlign: 'left', boxShadow: glow }}
                onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor = 'var(--cyber-blue)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' } }}
                onMouseLeave={e => { if (!answered) { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.background = 'transparent' } }}
              >
                <span style={{ minWidth: '28px', height: '28px', border: `1px solid ${borderColor}`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color, flexShrink: 0, transition: 'all 0.2s', fontWeight: '700' }}>
                  {answered && i === q.correctIndex ? '✓' : answered && i === selected && i !== q.correctIndex ? '✗' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color, lineHeight: 1.4, transition: 'color 0.2s', fontWeight: '500' }}>{opt}</span>
              </button>
            )
          })}
        </div>
      </div>

      {answered && (
        <div style={{ background: selected === q.correctIndex ? 'rgba(16,185,129,0.04)' : 'rgba(249,115,22,0.04)', border: `1px solid ${selected === q.correctIndex ? 'rgba(16,185,129,0.15)' : 'rgba(249,115,22,0.15)'}`, borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem', animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', color: selected === q.correctIndex ? 'var(--cyber-green)' : 'var(--cyber-orange)', marginBottom: '6px', fontWeight: '600' }}>
            {selected === q.correctIndex ? `✓ ${t('quiz_correct')}` : `✗ ${t('quiz_wrong')}`} — {t('quiz_explanation')}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--cyber-text)', lineHeight: 1.6, margin: 0 }}>{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button onClick={handleNext} style={{ 
          width: '100%', padding: '1rem', 
          background: 'rgba(139,92,246,0.12)', 
          border: '1px solid var(--cyber-blue)', 
          borderRadius: '9999px', 
          color: '#fff', 
          fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.25s', 
          boxShadow: '0 4px 16px rgba(139,92,246,0.15)', animation: 'fadeInUp 0.3s ease',
          fontWeight: '700'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.15)' }}
        >
          {currentQ < questions.length - 1 ? t('quiz_next') : t('quiz_finish')}
        </button>
      )}
    </div>
  )
}