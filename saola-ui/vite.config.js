import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // CISA KEV JSON catalog proxy to bypass CORS
      '/api/cisa/kev': {
        target: 'https://www.cisa.gov',
        changeOrigin: true,
        rewrite: () => '/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      },
      // Cybersecurity RSS feed proxies — browser calls /api/rss/*, Vite forwards server-side (no CORS)
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
    }
  }
})
