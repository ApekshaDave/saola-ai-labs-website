/**
 * Vercel Serverless Function — Groq API Proxy
 * POST /api/groq
 *
 * Keeps GROQ_API_KEY server-side only. The key is set via Vercel's
 * Environment Variables dashboard (Settings → Environment Variables)
 * and is NEVER exposed to the browser bundle.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key is not configured on the server.' })
  }

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await groqRes.json()

    if (!groqRes.ok) {
      return res.status(groqRes.status).json({ error: data })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('[/api/groq] Proxy error:', err)
    return res.status(500).json({ error: 'Internal proxy error' })
  }
}
