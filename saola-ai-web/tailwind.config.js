/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#04081C',
          800: '#080E2A',
          700: '#0D1535',
          600: '#111C42',
        },
        teal: {
          400: '#2DECD9',
          500: '#24D1C5',
          600: '#1AB5AA',
        },
        saffron: {
          400: '#FFD07A',
          500: '#FFC766',
          600: '#F5BA52',
        },
        slate: {
          850: '#0F1631',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0d9488 0%, #0f766e 45%, #3730a3 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,250,0.9) 100%)',
        'teal-gradient': 'linear-gradient(135deg, #0f766e, #0d9488)',
        'cta-gradient': 'linear-gradient(135deg, #0f766e 0%, #1e40af 100%)',
        'section-subtle': 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(36, 209, 197, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(36, 209, 197, 0.5)' },
        },
      },
      boxShadow: {
        'card': '0 4px 32px rgba(0,0,0,0.35)',
        'teal': '0 8px 32px rgba(36, 209, 197, 0.25)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      }
    },
  },
  plugins: [],
}
