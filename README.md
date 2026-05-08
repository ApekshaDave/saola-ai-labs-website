# Saola AI Labs — Complete Multi-Page SaaS Website

## Quick start (Vite + React)

```bash
npm create vite@latest saola-ai-labs -- --template react
cd saola-ai-labs
npm install framer-motion lucide-react react-router-dom
# Copy SaolaAILabs_Complete.jsx → src/App.jsx
# Replace src/index.css with the reset below
npm run dev
```

---

## Recommended folder structure (production split)

```
src/
├── constants/
│   ├── colors.js          # C token object
│   ├── routes.js          # ROUTES + NAV_LINKS
│   └── content.js         # All page copy arrays
│
├── hooks/
│   ├── useScrollReveal.js
│   ├── useScrollProgress.js
│   └── useScrolled.js
│
├── animations/
│   ├── variants.js        # fadeUp, fadeIn, scaleIn, PAGE_TRANSITION
│   └── transitions.js     # ease curve, spring configs
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── shared/
│   │   ├── Orbs.jsx
│   │   ├── GridLines.jsx
│   │   ├── SectionLabel.jsx
│   │   ├── SectionHead.jsx
│   │   ├── Pill.jsx
│   │   ├── GlowBtn.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── PageHero.jsx
│   │   ├── StatsBand.jsx
│   │   ├── TestimonialsSection.jsx
│   │   └── FinalCTABand.jsx
│   └── home/
│       └── DashboardCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Platform.jsx
│   ├── AISecurityTools.jsx
│   ├── Services.jsx
│   ├── Pricing.jsx
│   ├── Resources.jsx
│   ├── About.jsx
│   ├── ProblemsSolved.jsx
│   └── NotFound.jsx
│
├── router/
│   ├── Router.jsx         # RouterCtx + Router + Link
│   └── routes.jsx         # PAGES map + Layout
│
└── App.jsx                # Root: <Router><Layout /></Router>
```

---

## Routing system

The artifact uses a lightweight hash router (`window.location.hash`) so it
runs in any environment without a build step. In a real Vite/Next project:

```jsx
// With React Router v6
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Navbar />
  <Routes>
    <Route path="/"                   element={<Home />} />
    <Route path="/platform"           element={<Platform />} />
    <Route path="/ai-security-tools"  element={<AISecurityTools />} />
    <Route path="/services"           element={<Services />} />
    <Route path="/pricing"            element={<Pricing />} />
    <Route path="/resources"          element={<Resources />} />
    <Route path="/about"              element={<About />} />
    <Route path="/problems-we-solve"  element={<ProblemsSolved />} />
    <Route path="*"                   element={<NotFound />} />
  </Routes>
  <Footer />
</BrowserRouter>
```

Page transitions with AnimatePresence:

```jsx
import { useLocation } from "react-router-dom";
const location = useLocation();

<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* ... */}
  </Routes>
</AnimatePresence>
```

---

## Design token reference

```js
// constants/colors.js
export const C = {
  teal:       "#00E5CC",   // Primary accent — CTAs, links, progress
  tealDim:    "#00B5A0",   // Hover state for teal
  tealFaint:  "rgba(0,229,204,0.08)",
  gold:       "#F5C842",   // Secondary accent — warnings, stars, Growth tier
  goldFaint:  "rgba(245,200,66,0.1)",
  violet:     "#A78BFA",   // Tertiary accent — advisory, training
  violetFaint:"rgba(167,139,250,0.08)",
  coral:      "#F87171",   // Problem/error states
  coralFaint: "rgba(248,113,113,0.08)",
  bg:         "#030712",   // Page background
  surface:    "#0D1117",   // Card/section background
  surface2:   "#161B22",   // Elevated surface (table headers)
  surface3:   "#1C2230",   // Highest elevation
  border:     "rgba(255,255,255,0.07)",  // Default border
  border2:    "rgba(255,255,255,0.12)",  // Emphasized border
  muted:      "#6B7280",   // Secondary text
  muted2:     "#94A3B8",   // Body text
  text:       "#F0F6FC",   // Primary text
  textDim:    "#CBD5E1",   // Feature list text
};
```

---

## Animation system

```js
// animations/variants.js
export const ease = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.09, ease }
  }),
};

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25 } },
};
```

Usage pattern:
```jsx
// In any page component
const [ref, inView] = useScrollReveal();

<div ref={ref}>
  {items.map((item, i) => (
    <motion.div
      key={i}
      custom={i}           // stagger index
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* content */}
    </motion.div>
  ))}
</div>
```

---

## Pages implemented

| Route | Page | Key sections |
|---|---|---|
| `/` | Home | Hero + Dashboard, Stats, Problems, Capabilities, How it works, Testimonials, CTA |
| `/platform` | Platform | Hero, Stats, Core modules (2×2), Feature table, Integrations |
| `/ai-security-tools` | AI Security | Hero, Tool clusters, Architecture diagram, Scenario walkthrough |
| `/services` | Consulting & Training | Tab switcher, Consulting cards, Training tracks, Process strip |
| `/pricing` | Pricing | Annual toggle, 3 tiers + INR/USD, Add-on band, FAQ accordion |
| `/resources` | Resources | Filter bar, Article grid (8 posts) |
| `/about` | About | Story, Stats grid, Values, Team cards |
| `/problems-we-solve` | Problems | Challenge/solution side-by-side, Summary table, Testimonials |

---

## Tailwind config additions

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Sans", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        teal: { 400: "#00E5CC", 500: "#00B5A0" },
        gold: { 400: "#F5C842" },
        violet: { 400: "#A78BFA" },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
```

---

## index.css reset

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: "DM Sans", system-ui, sans-serif;
  background: #030712;
  color: #F0F6FC;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: #0D1117; }
::-webkit-scrollbar-thumb { background: #30363D; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #00E5CC; }
```

---

## Key UX decisions

- **Hash routing** — zero-dependency, works in any iframe/artifact host
- **IntersectionObserver** — scroll reveals without layout thrashing
- **AnimatePresence mode="wait"** — ensures exit animation completes before next page mounts
- **Stagger via custom prop** — each grid item gets `custom={i}` so delay is `i * 0.09s`
- **GlowBtn hover** — `boxShadow: "0 0 36px rgba(0,229,204,0.38)"` on primary, none on ghost
- **Scroll progress bar** — 2px fixed top bar driven by scroll position (not `useScroll`)
- **Pricing toggle** — INR + USD, annual 20% discount, smooth number update
- **FAQ accordion** — AnimatePresence height animation, no CSS `overflow: hidden` flicker
- **Resources filter** — client-side, instant, no rerender flash
- **Services tabs** — AnimatePresence mode="wait" between Consulting/Training

---

© 2026 Saola AI Labs