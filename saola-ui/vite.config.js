import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Directly read .env file — more reliable than loadEnv for non-VITE_ prefixed vars
function readEnvFile() {
  try {
    const content = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
    const vars = {}
    content.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex !== -1) {
          const key = trimmed.slice(0, eqIndex).trim()
          const val = trimmed.slice(eqIndex + 1).trim()
          vars[key] = val
        }
      }
    })
    return vars
  } catch (e) {
    console.warn('[vite] Could not read .env file:', e.message)
    return {}
  }
}

const dotenv = readEnvFile()
const GROQ_API_KEY = dotenv.GROQ_API_KEY || process.env.GROQ_API_KEY

console.log(
  '[groq-proxy] Key status:',
  GROQ_API_KEY ? `loaded ✅ (${GROQ_API_KEY.length} chars, starts with ${GROQ_API_KEY.slice(0, 8)}...)` : 'MISSING ❌'
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // ── Secure Groq dev proxy ──────────────────────────────────────────────
    // Intercepts POST /api/groq, injects the key server-side, forwards to Groq.
    // The browser never sees the key.
    {
      name: 'groq-dev-proxy',
      configureServer(server) {
        server.middlewares.use('/api/groq', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          const chunks = []
          req.on('data', (chunk) => chunks.push(chunk))
          req.on('end', async () => {
            try {
              const body = Buffer.concat(chunks).toString()
              const groqRes = await fetch(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                  },
                  body,
                }
              )
              const data = await groqRes.json()
              res.statusCode = groqRes.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            } catch (err) {
              console.error('[groq-dev-proxy] error:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Proxy error', detail: String(err) }))
            }
          })
        })
      },
    },
  ],

  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // ── CISA KEV JSON catalog proxy to bypass CORS ─────────────────────
      '/api/cisa/kev': {
        target: 'https://www.cisa.gov',
        changeOrigin: true,
        rewrite: () => '/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      },

      // ── Cybersecurity RSS feed proxies ──────────────────────────────────
      '/api/rss/hackernews': {
        target: 'https://feeds.feedburner.com',
        changeOrigin: true,
        rewrite: () => '/TheHackersNews',
      },
      '/api/rss/bleeping': {
        target: 'https://www.bleepingcomputer.com',
        changeOrigin: true,
        rewrite: () => '/feed/',
      },
      '/api/rss/krebs': {
        target: 'https://krebsonsecurity.com',
        changeOrigin: true,
        rewrite: () => '/feed/',
      },
      '/api/rss/cisa': {
        target: 'https://www.cisa.gov',
        changeOrigin: true,
        rewrite: () => '/cybersecurity-advisories/advisories.xml',
      },
      '/api/rss/darkreading': {
        target: 'https://www.darkreading.com',
        changeOrigin: true,
        rewrite: () => '/rss.xml',
      },
    },
  },
})
