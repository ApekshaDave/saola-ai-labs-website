import { buildSystemPrompt } from '../prompts/systemPrompt'

// All Groq calls go through the secure server-side proxy (/api/groq).
// The real GROQ_API_KEY lives in Vercel's environment variables — never in the browser.
const GROQ_PROXY_URL = '/api/groq'

/**
 * Internal helper — POST a chat completion request through the server proxy.
 */
async function callGroq(body) {
  const response = await fetch(GROQ_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error: ${response.status} — ${err}`)
  }

  return response.json()
}

/**
 * Explain a cybersecurity article, adapted to the user's profile and language.
 */
export async function explainCyberAttack(articleText, userProfile) {
  const language = userProfile?.language || 'en'
  const systemPrompt = buildSystemPrompt(userProfile, language)

  const data = await callGroq({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze and explain this cybersecurity article:\n\n${articleText}` },
    ],
    temperature: 0.3,
    max_tokens: 2500,
  })

  const rawText = data.choices[0].message.content
  const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    console.error('Failed to parse Groq response:', rawText)
    throw new Error('AI returned an unexpected format. Please try again.', { cause: e })
  }
}

/**
 * Generate a short plain-language explanation of a cybersecurity term or text.
 */
export async function generateSimpleExplanation(text, language = 'en') {
  const langInstruction = language === 'hi'
    ? 'Respond ONLY in Hindi language.'
    : 'Respond in English.'

  const data = await callGroq({
    model: 'llama-3.3-70b-versatile',
    messages: [{
      role: 'user',
      content: `${langInstruction}\nExplain this cybersecurity information in 3-4 simple sentences that anyone can understand. Use a real-life analogy. Do not use technical jargon without explaining it.\nText: ${text}`,
    }],
    temperature: 0.4,
    max_tokens: 400,
  })

  return data.choices[0].message.content
}