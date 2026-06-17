import { buildSystemPrompt } from '../prompts/systemPrompt'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function explainCyberAttack(articleText, userProfile) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  if (!GROQ_API_KEY) throw new Error('Groq API key not found. Please add VITE_GROQ_API_KEY to your .env file.')

  const language = userProfile?.language || 'en'
  const systemPrompt = buildSystemPrompt(userProfile, language)

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze and explain this cybersecurity article:\n\n${articleText}` }
      ],
      temperature: 0.3, max_tokens: 2500
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error: ${response.status} — ${err}`)
  }

  const data = await response.json()
  const rawText = data.choices[0].message.content
  const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    console.error('Failed to parse Groq response:', rawText)
    throw new Error('AI returned an unexpected format. Please try again.', { cause: e })
  }
}

export async function generateSimpleExplanation(text, language = 'en') {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
  const langInstruction = language === 'hi'
    ? 'Respond ONLY in Hindi language.'
    : 'Respond in English.'

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `${langInstruction}\nExplain this cybersecurity information in 3-4 simple sentences that anyone can understand. Use a real-life analogy. Do not use technical jargon without explaining it.\nText: ${text}`
      }],
      temperature: 0.4, max_tokens: 400
    })
  })

  const data = await response.json()
  return data.choices[0].message.content
}