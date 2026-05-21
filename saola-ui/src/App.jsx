/**
 * SAOLA AI LABS — Repositioned Enterprise AI Adoption Platform
 * Brand strategy: Enterprise AI Adoption Platform (not AI security vendor)
 * Per: Saoala_AI_Labs_Repositioning.pdf
 */
import {
  useState, useEffect, useRef, useCallback, createContext, useContext
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Shield, Eye, BarChart3, Users, ChevronRight,
  Menu, X, ArrowRight, CheckCircle2, Star,
  Bell, ArrowUpRight,
  FileText,
  KeyRound, ShieldCheck,
  Mail, Globe, Database,
  BookOpen, Cpu, Lock, Settings, TrendingUp,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const C = {
  // Brand accent — deep indigo/violet for enterprise trust
  accent:      "#4C3FE0",
  accentLight: "#7267E8",
  accentFaint: "rgba(76,63,224,0.10)",
  accentBorder:"rgba(76,63,224,0.30)",
  // Secondary accents
  gold:        "#E8A020",
  goldFaint:   "rgba(232,160,32,0.10)",
  teal:        "#0EA5A0",
  tealFaint:   "rgba(14,165,160,0.10)",
  coral:       "#E05A40",
  coralFaint:  "rgba(224,90,64,0.08)",
  // Surfaces — dark enterprise
  bg:          "#070A12",
  surface:     "#0D1120",
  surface2:    "#141828",
  surface3:    "#1A2035",
  border:      "rgba(255,255,255,0.07)",
  border2:     "rgba(255,255,255,0.13)",
  // Text
  muted:       "#6B7280",
  muted2:      "#94A3B8",
  text:        "#F0F6FC",
  textDim:     "#CBD5E1",
};

const ROUTES = {
  home:      "/",
  platform:  "/platform",
  governance:"/governance",
  usecases:  "/use-cases",
  security:  "/security",
  pricing:   "/pricing",
  resources: "/resources",
  about:     "/about",
};

const NAV_LINKS = [
  { label: "Platform",    path: ROUTES.platform },
  { label: "Use Cases",   path: ROUTES.usecases },
  { label: "Governance",  path: ROUTES.governance },
  { label: "Security",    path: ROUTES.security },
  { label: "Pricing",     path: ROUTES.pricing },
  { label: "Resources",   path: ROUTES.resources },
];

// ══════════════════════════════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════════════════════════════

const RouterCtx = createContext({ path: "/", navigate: () => {} });

function Router({ children }) {
  const getPath = () => {
    const hash = window.location.hash.replace("#", "") || "/";
    return hash.startsWith("/") ? hash : "/" + hash;
  };
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handler = () => {
      setPath(getPath());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((to) => {
    window.location.hash = to;
  }, []);

  return (
    <RouterCtx.Provider value={{ path, navigate }}>
      {children}
    </RouterCtx.Provider>
  );
}

function useRouter() { return useContext(RouterCtx); }

function Link({ to, children, className, style, onMouseEnter, onMouseLeave, ...rest }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {children}
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════════

function useScrollReveal(margin = "-80px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return [ref, inView];
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? el.scrollTop / total : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return progress;
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return scrolled;
}

// ══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ══════════════════════════════════════════════════════════════════════════════

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.09, ease },
  }),
};

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

// ══════════════════════════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════

function Orbs({ intensity = 1 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-30%", left: "-20%",
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`,
          opacity: 0.09 * intensity,
        }}
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        style={{
          position: "absolute", top: "40%", right: "-15%",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal} 0%, transparent 70%)`,
          opacity: 0.07 * intensity,
        }}
      />
      <motion.div
        animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        style={{
          position: "absolute", bottom: "-10%", left: "35%",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)`,
          opacity: 0.05 * intensity,
        }}
      />
    </div>
  );
}

function GridLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px),
                          linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }}
    />
  );
}

function SectionLabel({ children, color = C.accent }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>
      {children}
    </p>
  );
}

function SectionHead({ label, title, sub, center = false, maxW = "max-w-2xl", color = C.accent }) {
  const [ref, inView] = useScrollReveal();
  return (
    <div ref={ref} className={`${maxW} ${center ? "mx-auto text-center" : ""} mb-16`}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <SectionLabel color={color}>{label}</SectionLabel>
      </motion.div>
      <motion.h2
        custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ color: C.muted2 }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}

function Pill({ children, color = C.accent, bg }) {
  return (
    <span
      className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md"
      style={{ color, background: bg || `${color}18` }}
    >
      {children}
    </span>
  );
}

function PrimaryBtn({ children, href = "#", small = false, onClick }) {
  return (
    <motion.a
      href={href.startsWith("/") ? `#${href}` : href}
      onClick={onClick}
      whileHover={{ scale: 1.04, boxShadow: `0 0 36px rgba(76,63,224,0.40)` }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center gap-2 rounded-xl font-bold ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`}
      style={{ background: C.accent, color: "#ffffff" }}
    >
      {children} <ArrowRight size={small ? 13 : 15} />
    </motion.a>
  );
}

function GhostBtn({ children, href = "#", small = false, icon: Icon = ChevronRight }) {
  return (
    <motion.a
      href={href.startsWith("/") ? `#${href}` : href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 rounded-xl font-bold ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`}
      style={{ border: `1px solid ${C.border2}`, color: C.text, background: "rgba(255,255,255,0.04)" }}
    >
      {children} {Icon && <Icon size={small ? 13 : 15} />}
    </motion.a>
  );
}

function FeatureCard({ icon: Icon, title, features = [], accent = C.accent, custom = 0, inView = true }) {
  return (
    <motion.div
      custom={custom} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -6, borderColor: `${accent}30` }}
      className="relative rounded-2xl p-7 border overflow-hidden group transition-all duration-300 cursor-default flex flex-col"
      style={{ background: C.bg, border: `1px solid ${C.border}` }}
    >
      <div
        className="absolute top-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0"
        style={{ background: `${accent}14` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      <Pill color={accent}>{title}</Pill>
      <ul className="mt-4 space-y-2.5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: C.textDim }}>
            <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: accent }} />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PageHero({ eyebrow, title, sub, cta1, cta2 }) {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-24 pb-16"
      style={{ background: C.bg }}>
      <Orbs intensity={0.8} />
      <GridLines />
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <motion.div {...PAGE_TRANSITION} key="hero-content">
            {eyebrow && (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border"
                style={{ border: `1px solid ${C.accentBorder}`, background: C.accentFaint, color: C.accentLight }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.accent }} />
                {eyebrow}
              </div>
            )}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.07] tracking-tight mb-5"
            >
              {title}
            </h1>
            {sub && <p className="text-lg mb-8 leading-relaxed max-w-xl" style={{ color: C.muted2 }}>{sub}</p>}
            {(cta1 || cta2) && (
              <div className="flex flex-wrap gap-3">
                {cta1 && <PrimaryBtn href={cta1.href || "#"}>{cta1.label}</PrimaryBtn>}
                {cta2 && <GhostBtn href={cta2.href || "#"}>{cta2.label}</GhostBtn>}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════════════════════

function Navbar() {
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const progress = useScrollProgress();
  const prevPath = useRef(path);

  useEffect(() => {
    if (prevPath.current !== path) {
      prevPath.current = path;
      setOpen(false);
    }
  }, [path]);

  return (
    <>
      <div className="fixed top-0 inset-x-0 h-[2px] z-[60] pointer-events-none">
        <motion.div
          className="h-full"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${C.accent}, ${C.teal})`,
          }}
        />
      </div>

      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div
          className="transition-all duration-300"
          style={{
            background: scrolled ? "rgba(7,10,18,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(24px)" : "none",
            borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.home} className="flex items-center gap-3 shrink-0">
              <img src="/logo.png" alt="Saola AI Labs" className="w-12 h-12 object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl tracking-tight">
                  <span style={{ color: C.accentLight }}>Saola</span>{" "}
                  <span style={{ color: C.text }}>AI Labs</span>
                </span>
                <span className="text-xs" style={{ color: C.muted }}>Enterprise AI Adoption Platform</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7 ml-8">
              {NAV_LINKS.map(link => {
                const active = path === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative text-sm font-medium py-1 transition-colors duration-200"
                    style={{ color: active ? C.text : C.muted }}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-0.5 inset-x-0 h-px"
                        style={{ background: C.accent }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link to={ROUTES.home} className="text-sm font-medium" style={{ color: C.muted }}>
                Sign in
              </Link>
              <PrimaryBtn href={ROUTES.pricing} small>Book a Demo</PrimaryBtn>
            </div>

            <button
              className="md:hidden p-2 rounded-lg border transition-colors"
              style={{ color: C.text, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)" }}
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease }}
              className="md:hidden overflow-hidden"
              style={{
                background: "rgba(13,17,32,0.97)",
                backdropFilter: "blur(24px)",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <nav className="px-6 py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => {
                  const active = path === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center justify-between py-3 border-b text-sm font-medium"
                        style={{ color: active ? C.accentLight : C.muted2, borderColor: C.border }}
                      >
                        {link.label}
                        <ChevronRight size={14} />
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-4">
                  <PrimaryBtn href={ROUTES.pricing}>Book a Demo</PrimaryBtn>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════════════════════

function LinkedInIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Footer() {
  const cols = [
    {
      title: "Platform",
      links: [
        { label: "Platform Overview", path: ROUTES.platform },
        { label: "AI Adoption",       path: ROUTES.platform },
        { label: "Governance Layer",  path: ROUTES.governance },
        { label: "Security Controls", path: ROUTES.security },
        { label: "Pricing",           path: ROUTES.pricing },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Use Cases",         path: ROUTES.usecases },
        { label: "By Industry",       path: ROUTES.usecases },
        { label: "Enterprise Search", path: ROUTES.usecases },
        { label: "AI Agents",         path: ROUTES.usecases },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About",     path: ROUTES.about },
        { label: "Resources", path: ROUTES.resources },
        { label: "Blog",      path: ROUTES.resources },
        { label: "Careers",   path: ROUTES.about },
        { label: "Contact",   path: ROUTES.about },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy",   path: ROUTES.home },
        { label: "Terms",     path: ROUTES.home },
        { label: "Security",  path: ROUTES.home },
        { label: "DPA Notice",path: ROUTES.home },
      ],
    },
  ];

  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Saola AI Labs" className="w-9 h-9 object-contain" />
              <span className="font-bold text-white">Saola AI Labs</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: C.muted }}>
              The enterprise infrastructure layer for governed AI adoption. Deploy AI securely at scale.
            </p>
            <div className="flex gap-2">
              {[{ Icon: Mail, label: "Email" }, { Icon: Globe, label: "Website" }, { Icon: LinkedInIcon, label: "LinkedIn" }].map(({ Icon, label }) => (
                <a
                  key={label} href="#" aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-200"
                  style={{ border: `1px solid ${C.border}`, color: C.muted }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accentLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.muted }}>
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors duration-200 block"
                      style={{ color: C.muted }}
                      onMouseEnter={e => e.currentTarget.style.color = C.text}
                      onMouseLeave={e => e.currentTarget.style.color = C.muted}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: C.border }}
        >
          <p className="text-xs" style={{ color: C.muted }}>© 2026 Saola AI Labs · All rights reserved.</p>
          <p className="text-xs" style={{ color: C.muted }}>Operationalize AI securely.</p>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED SECTION COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function FinalCTABand({ title = "Ready to operationalize AI across your enterprise?", sub }) {
  const [ref, inView] = useScrollReveal();
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: C.bg }}>
      <Orbs intensity={0.9} />
      <div className="max-w-3xl mx-auto px-6 text-center relative" ref={ref}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <SectionLabel>Get started today</SectionLabel>
        </motion.div>
        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
        >
          {title}
        </motion.h2>
        {sub && (
          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="mb-10 text-lg" style={{ color: C.muted }}
          >
            {sub}
          </motion.p>
        )}
        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="flex flex-wrap gap-4 justify-center"
        >
          <PrimaryBtn href={ROUTES.pricing}>Book a Demo</PrimaryBtn>
          <GhostBtn href={ROUTES.platform}>See Platform Overview</GhostBtn>
        </motion.div>
      </div>
    </section>
  );
}

function StatsBand({ stats }) {
  const [ref, inView] = useScrollReveal();
  return (
    <div ref={ref} className="py-16 border-y" style={{ background: C.surface, borderColor: C.border }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-center"
          >
            <div className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: C.accentLight }}>{s.val}</div>
            <div className="text-sm" style={{ color: C.muted }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [ref, inView] = useScrollReveal();
  const items = [
    { q: "Saola moved us from fragmented AI experiments to governed, production-ready workflows in under 90 days. The ROI was immediate.", name: "Arjun Mehta", role: "CTO · Enterprise SaaS, Bengaluru" },
    { q: "We finally have one layer that governs every AI interaction across our teams. Shadow AI dropped 60% in the first quarter.", name: "Priya Rao", role: "Chief AI Officer · Fintech, Delhi" },
    { q: "The platform architecture diagram alone convinced our board. Saola is infrastructure, not just tooling.", name: "Kiran Joshi", role: "VP Engineering · Healthcare Tech, Hyderabad" },
  ];
  return (
    <section className="py-24" style={{ background: C.surface }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <SectionHead label="Enterprise proof" title="Trusted by organizations scaling AI"
          sub="Enterprises across SaaS, fintech, healthcare, and operations."
          center maxW="max-w-xl" />
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="rounded-2xl p-7 border flex flex-col gap-4"
              style={{ background: C.bg, border: `1px solid ${C.border}` }}
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={13} style={{ color: C.gold }} fill={C.gold} />
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: C.muted2 }}>"{t.q}"</p>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════════════════════

function ArchDiagram() {
  const [ref, inView] = useScrollReveal();
  const nodes = [
    { label: "Enterprise Data", sub: "Docs, APIs, systems", icon: Database },
    { label: "Policy Layer", sub: "Access & governance", icon: Shield },
    { label: "Saola Platform", sub: "AI operations hub", icon: Cpu, highlight: true },
    { label: "AI Outputs", sub: "Agents, copilots", icon: Rocket },
    { label: "Observability", sub: "Monitor & audit", icon: Eye },
  ];
  return (
    <div ref={ref} className="mt-14">
      <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: C.muted }}>
        How the platform works end-to-end
      </p>
      <div className="flex items-center gap-0 flex-wrap">
        {nodes.map((n, i) => {
          const Icon = n.icon;
          return (
            <div key={i} className="flex items-center">
              <motion.div
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="rounded-xl border p-4 flex flex-col items-center text-center min-w-[110px]"
                style={{
                  background: n.highlight ? C.accent : C.surface2,
                  border: `1px solid ${n.highlight ? C.accent : C.border}`,
                }}
              >
                <Icon size={18} style={{ color: n.highlight ? "#fff" : C.accentLight }} className="mb-2" />
                <p className="text-xs font-semibold" style={{ color: n.highlight ? "#fff" : C.text }}>{n.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: n.highlight ? "rgba(255,255,255,0.7)" : C.muted }}>{n.sub}</p>
              </motion.div>
              {i < nodes.length - 1 && (
                <ArrowRight size={16} style={{ color: C.border2, margin: "0 6px", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HomePage() {
  const [ref, inView] = useScrollReveal();

  const problems = [
    { num: "01", title: "Fragmented AI adoption", desc: "Teams deploy AI tools in silos with no central visibility, creating inconsistency and compliance gaps." },
    { num: "02", title: "Shadow AI risk", desc: "Unauthorized models expose sensitive organizational knowledge without policy enforcement." },
    { num: "03", title: "Pilots that don't scale", desc: "Without shared infrastructure, successful experiments can't cross team boundaries or reach production." },
    { num: "04", title: "Knowledge trapped in silos", desc: "Enterprise data lives in dozens of systems. AI can't access it securely without a unified retrieval layer." },
  ];

  const pillars = [
    { icon: Rocket, title: "Enterprise AI Adoption", color: C.accent, desc: "Deploy copilots, assistants, and knowledge workflows into real operational processes.", tags: ["Copilots", "Workflow AI", "Assistants"] },
    { icon: ShieldCheck, title: "Governance & Policy", color: C.teal, desc: "Manage access, approval flows, audit trails, and compliance centrally. Built in, not bolted on.", tags: ["RBAC", "Audit Logs", "Policy Enforcement"] },
    { icon: Lock, title: "Enterprise Security", color: C.gold, desc: "Protect sensitive data, control inference boundaries, and secure internal knowledge.", tags: ["Data Privacy", "Secure RAG", "Encryption"] },
    { icon: Settings, title: "AI Operations Infrastructure", color: C.coral, desc: "Orchestrate agents, monitor performance, and integrate across your enterprise tech stack.", tags: ["Observability", "Orchestration", "Integrations"] },
  ];

  const useCases = [
    { icon: "💬", title: "Internal AI Assistants", desc: "Policy-aware copilots that answer employee questions using secure enterprise knowledge." },
    { icon: "🔍", title: "Secure Enterprise Search", desc: "Unified AI search across documents and systems with access controls enforced at retrieval." },
    { icon: "⚡", title: "Workflow Automation", desc: "AI-powered operations that route, process, and act without shadow tool risk." },
    { icon: "🤖", title: "AI Agent Deployment", desc: "Orchestrate multi-step agents with governance rails and full observability." },
    { icon: "📋", title: "Compliance-Sensitive AI", desc: "Run AI in regulated environments with audit trails and data boundary controls." },
    { icon: "🧠", title: "Knowledge Intelligence", desc: "Surface institutional knowledge through secure RAG pipelines that respect data boundaries." },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-16"
        style={{ background: C.bg }}>
        <Orbs intensity={1} />
        <GridLines />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border"
              style={{ border: `1px solid ${C.accentBorder}`, background: C.accentFaint, color: C.accentLight }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.accent }} />
              Enterprise AI Adoption Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl">
              Deploy AI across your<br />
              organization,{" "}
              <span style={{ color: C.accentLight }}>securely</span>{" "}
              and at scale.
            </h1>
            <p className="text-xl mb-10 leading-relaxed max-w-xl" style={{ color: C.muted2 }}>
              Saola helps enterprises launch AI copilots, agents, and knowledge workflows with governance, privacy, and operational control built in from day one.
            </p>
            <div className="flex flex-wrap gap-3">
              <PrimaryBtn href={ROUTES.pricing}>Book a Demo</PrimaryBtn>
              <GhostBtn href={ROUTES.platform}>Explore the Platform</GhostBtn>
            </div>
          </motion.div>
          <ArchDiagram />
        </div>
      </section>

      {/* STATS */}
      <StatsBand stats={[
        { val: "4×", label: "Faster AI pilot to production" },
        { val: "100%", label: "AI interactions governed by default" },
        { val: "60%", label: "Reduction in shadow AI tool usage" },
        { val: "90d", label: "Median time to enterprise deployment" },
      ]} />

      {/* PROBLEM */}
      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="The enterprise AI challenge"
            title="AI is happening before governance is ready."
            sub="Most organizations face the same four blockers when moving from AI pilots to enterprise production."
          />
          <div className="grid md:grid-cols-2 gap-1 rounded-2xl overflow-hidden border" style={{ borderColor: C.border }} ref={ref}>
            {problems.map((p, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                className="p-8 border-b border-r"
                style={{ background: C.bg, borderColor: C.border }}
              >
                <div className="text-4xl font-bold mb-4" style={{ color: "#1e1a4a" }}>{p.num}</div>
                <h3 className="text-base font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM PILLARS */}
      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="The Saola platform"
            title="One platform. Four pillars. Enterprise-grade adoption."
            sub="Saola unifies AI deployment, policy enforcement, security controls, and operational visibility into a single infrastructure layer."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {pillars.map((p, i) => (
              <FeatureCard
                key={i} icon={p.icon} title={p.title} accent={p.color} custom={i}
                features={p.tags.map(t => t)}
                inView={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Use cases"
            title="From pilots to production workflows."
            sub="Real operational use cases enterprises deploy on Saola today."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((u, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                whileHover={{ y: -4, borderColor: `${C.accent}40` }}
                className="rounded-2xl p-6 border transition-all duration-300 cursor-default"
                style={{ background: C.bg, border: `1px solid ${C.border}` }}
              >
                <div className="text-2xl mb-4">{u.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{u.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTABand
        title="Operationalize AI securely."
        sub="Start building enterprise AI systems your organization can trust, govern, and scale from day one."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PLATFORM PAGE
// ══════════════════════════════════════════════════════════════════════════════

function PlatformPage() {
  const capabilities = [
    { icon: Rocket, title: "AI Adoption Infrastructure", color: C.accent, features: ["Deploy copilots and assistants into real workflows", "Secure enterprise knowledge retrieval (RAG)", "Multi-model orchestration across teams", "Policy-aware agent execution"] },
    { icon: ShieldCheck, title: "Governance & Policy Controls", color: C.teal, features: ["Role-based access control (RBAC)", "Approval workflows for AI interactions", "Central policy engine and rule management", "Compliance alignment for GDPR, DPDP, SOC 2"] },
    { icon: Lock, title: "Enterprise Security Layer", color: C.gold, features: ["Sensitive data detection and masking", "Secure inference boundaries", "Internal knowledge protection", "Cross-boundary data controls"] },
    { icon: Eye, title: "AI Operations Infrastructure", color: C.coral, features: ["Real-time observability and monitoring", "Agent lifecycle management", "Integration hub for enterprise systems", "Usage analytics and audit trails"] },
  ];

  const [ref, inView] = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Platform Overview"
        title="The enterprise layer for governed AI adoption."
        sub="Saola provides the end-to-end infrastructure organizations need to move AI out of pilots and into production — with governance, security, and operational control built in."
        cta1={{ label: "Book a Demo", href: ROUTES.pricing }}
        cta2={{ label: "See Use Cases", href: ROUTES.usecases }}
      />

      <StatsBand stats={[
        { val: "4×", label: "Faster AI deployment" },
        { val: "100%", label: "Governed by default" },
        { val: "60%", label: "Shadow AI reduction" },
        { val: "99.9%", label: "Platform uptime SLA" },
      ]} />

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Core capabilities"
            title="Everything you need to deploy AI at enterprise scale."
            sub="Four integrated capability layers that work together as a unified platform — not a patchwork of tools."
          />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {capabilities.map((c, i) => (
              <FeatureCard key={i} icon={c.icon} title={c.title} accent={c.color} features={c.features} custom={i} inView={inView} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Architecture"
            title="How Saola connects your enterprise."
            sub="A unified control plane that connects your data, policy layer, AI models, and operations in one governed system."
          />
          <div className="rounded-2xl border p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Data & Knowledge Sources", items: ["Documents & files", "APIs & databases", "Internal knowledge bases", "Third-party integrations"], icon: Database },
                { label: "Saola Control Plane", items: ["Policy enforcement engine", "Access & identity controls", "Orchestration layer", "Audit & compliance logging"], icon: Cpu, highlight: true },
                { label: "AI Outputs & Operations", items: ["Copilots & assistants", "Autonomous agents", "Workflow automation", "Observability dashboards"], icon: BarChart3 },
              ].map((col, i) => {
                const Icon = col.icon;
                return (
                  <div key={i} className="rounded-xl p-6 border"
                    style={{ background: col.highlight ? C.accent : C.surface2, border: `1px solid ${col.highlight ? C.accent : C.border}` }}>
                    <Icon size={20} style={{ color: col.highlight ? "#fff" : C.accentLight }} className="mb-3" />
                    <h3 className="text-sm font-bold mb-3" style={{ color: col.highlight ? "#fff" : C.text }}>{col.label}</h3>
                    <ul className="space-y-2">
                      {col.items.map((item, j) => (
                        <li key={j} className="text-xs flex items-center gap-2"
                          style={{ color: col.highlight ? "rgba(255,255,255,0.75)" : C.muted }}>
                          <CheckCircle2 size={10} style={{ color: col.highlight ? "rgba(255,255,255,0.6)" : C.accentLight }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTABand
        title="Ready to see the full platform?"
        sub="Book a 30-minute technical walkthrough with our enterprise team."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE PAGE
// ══════════════════════════════════════════════════════════════════════════════

function GovernancePage() {
  const [ref, inView] = useScrollReveal();
  const controls = [
    { icon: KeyRound, title: "Role-Based Access Control", color: C.accent, features: ["Fine-grained permission management", "Team and department-level policies", "Identity provider integrations (SSO)", "Least-privilege AI access enforcement"] },
    { icon: FileText, title: "Policy Engine", color: C.teal, features: ["Centralized rule definition and versioning", "Automated approval workflows", "Contextual policy enforcement at inference time", "Cross-geography data handling rules"] },
    { icon: Eye, title: "Audit & Compliance", color: C.gold, features: ["Complete audit trails for every AI interaction", "Immutable logs with tamper detection", "Compliance reports for GDPR, DPDP, SOC 2", "Regulator-ready data exports"] },
    { icon: Bell, title: "Risk & Monitoring", color: C.coral, features: ["Real-time policy violation alerts", "Shadow AI detection and flagging", "Usage anomaly detection", "Executive risk dashboards"] },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Governance & Policy Controls"
        title="Governance built in, not bolted on."
        sub="Make AI deployment controllable across your organization. Centralized policy enforcement, approval flows, and audit trails that scale from one team to the entire enterprise."
        cta1={{ label: "See Platform", href: ROUTES.platform }}
        cta2={{ label: "Book a Demo", href: ROUTES.pricing }}
      />

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Governance capabilities"
            title="Every AI interaction, under control."
            sub="Saola's governance layer sits between your enterprise systems and every AI output — enforcing policy at the point of inference."
          />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {controls.map((c, i) => (
              <FeatureCard key={i} icon={c.icon} title={c.title} accent={c.color} features={c.features} custom={i} inView={inView} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Compliance alignment"
            title="Built for regulated industries."
            sub="Governance controls designed to meet the requirements of enterprise compliance frameworks."
          />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "GDPR", desc: "Data residency controls, right-to-erasure support, cross-border data handling policy enforcement." },
              { label: "DPDP Act", desc: "India's Digital Personal Data Protection Act compliance with granular consent and data principal controls." },
              { label: "SOC 2 Type II", desc: "Audit-ready evidence generation, access control logging, and continuous monitoring for trust service criteria." },
              { label: "ISO 27001", desc: "Information security management controls aligned with international enterprise security standards." },
              { label: "HIPAA", desc: "Healthcare data handling controls, PHI access governance, and audit trail requirements." },
              { label: "Custom Frameworks", desc: "Extend Saola's policy engine with organization-specific controls and compliance rules." },
            ].map((f, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-xl p-6 border"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <Pill color={C.accent}>{f.label}</Pill>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: C.muted }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTABand
        title="Make every AI interaction governable."
        sub="Start with one use case and extend governance controls across your entire organization."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USE CASES PAGE
// ══════════════════════════════════════════════════════════════════════════════

function UseCasesPage() {
  const cases = [
    {
      icon: "💬", title: "Internal AI Assistants", color: C.accent,
      desc: "Deploy policy-aware copilots that answer employee questions using secure enterprise knowledge bases.",
      outcomes: ["Reduce support ticket volume by 40%", "Consistent answers grounded in enterprise policy", "Full audit trail on every interaction"],
      buyers: ["HR leaders", "IT operations", "CIOs"],
    },
    {
      icon: "🔍", title: "Secure Enterprise Search", color: C.teal,
      desc: "Unified AI search across documents, databases, and systems with access controls enforced at every retrieval step.",
      outcomes: ["Surface institutional knowledge instantly", "Data boundary controls enforced at retrieval", "Cross-system search with governance built in"],
      buyers: ["Knowledge managers", "Platform teams", "CTOs"],
    },
    {
      icon: "⚡", title: "Workflow Automation", color: C.gold,
      desc: "AI-powered operations that route, process, and action enterprise tasks without the risk of shadow tooling.",
      outcomes: ["Automate multi-step processes end to end", "Policy enforcement at every step", "Observable, auditable automation pipelines"],
      buyers: ["Operations leaders", "Business transformation teams"],
    },
    {
      icon: "🤖", title: "AI Agent Deployment", color: C.coral,
      desc: "Orchestrate multi-step autonomous agents with governance rails, observability, and full audit trails at every execution stage.",
      outcomes: ["Governed agent execution at scale", "Human-in-the-loop controls where required", "Agent lifecycle management and versioning"],
      buyers: ["Chief AI Officers", "Platform engineering", "CTOs"],
    },
    {
      icon: "📋", title: "Compliance-Sensitive AI", color: C.accent,
      desc: "Run AI in regulated environments — financial services, healthcare, legal — with data controls and compliance-ready audit trails.",
      outcomes: ["Meets GDPR, DPDP, SOC 2, HIPAA controls", "Regulator-ready evidence generation", "Sensitive data masking at inference time"],
      buyers: ["CISOs", "Compliance leaders", "Risk officers"],
    },
    {
      icon: "🧠", title: "Knowledge Intelligence", color: C.teal,
      desc: "Surface institutional knowledge through secure RAG pipelines that respect data boundaries and access policies.",
      outcomes: ["Unlock knowledge trapped across systems", "Context-aware retrieval with policy enforcement", "Reduces knowledge loss from team turnover"],
      buyers: ["CKOs", "Platform teams", "Operations leaders"],
    },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Use Cases"
        title="From pilots to production workflows."
        sub="Real operational use cases enterprises deploy on Saola today — from internal assistants to governed agent networks."
        cta1={{ label: "Book a Demo", href: ROUTES.pricing }}
        cta2={{ label: "See Platform", href: ROUTES.platform }}
      />

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Enterprise use cases"
            title="AI across every function, under control."
            sub="Organize by business problem, not feature. Each use case maps directly to an enterprise outcome."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {cases.map((c, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                whileHover={{ y: -4 }}
                className="rounded-2xl p-7 border transition-all duration-300"
                style={{ background: C.bg, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-2xl">{c.icon}</div>
                  <div>
                    <Pill color={c.color}>{c.title}</Pill>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: C.muted2 }}>{c.desc}</p>
                  </div>
                </div>
                <div className="border-t pt-4" style={{ borderColor: C.border }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Outcomes</p>
                  <ul className="space-y-1.5 mb-4">
                    {c.outcomes.map((o, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs" style={{ color: C.textDim }}>
                        <CheckCircle2 size={11} className="mt-0.5 shrink-0" style={{ color: c.color }} />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {c.buyers.map((b, j) => (
                      <span key={j} className="text-[11px] px-2 py-0.5 rounded" style={{ background: C.surface2, color: C.muted2 }}>{b}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTABand
        title="See your use case in action."
        sub="Book a 30-minute walkthrough specific to your industry and function."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECURITY PAGE
// ══════════════════════════════════════════════════════════════════════════════

function SecurityPage() {
  const [ref, inView] = useScrollReveal();
  const layers = [
    { icon: Lock, title: "Data Privacy Controls", color: C.accent, features: ["Sensitive data detection at inference time", "PII masking and anonymization pipelines", "Data residency and sovereignty controls", "Consent management integration"] },
    { icon: ShieldCheck, title: "Secure Inference Layer", color: C.teal, features: ["Isolated inference environments per tenant", "Model input/output filtering", "Prompt injection detection", "Secure enterprise knowledge access"] },
    { icon: KeyRound, title: "Identity & Access", color: C.gold, features: ["Enterprise SSO integration (SAML, OIDC)", "Zero-trust access model for AI systems", "Privileged access management for AI agents", "Session-level monitoring and controls"] },
    { icon: Eye, title: "Threat Detection", color: C.coral, features: ["Shadow AI detection across the organization", "Anomalous usage pattern alerting", "Data exfiltration risk monitoring", "Continuous policy compliance checking"] },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Enterprise Security"
        title="Security as a trust layer for AI deployment."
        sub="Protect enterprise data and knowledge across every AI interaction — without slowing down adoption. Security that enables, not just controls."
        cta1={{ label: "See Platform", href: ROUTES.platform }}
        cta2={{ label: "Book a Demo", href: ROUTES.pricing }}
      />

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Security capabilities"
            title="Enterprise-grade security without friction."
            sub="Saola positions security as the trust layer that makes AI adoption possible — not the barrier that prevents it."
          />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {layers.map((l, i) => (
              <FeatureCard key={i} icon={l.icon} title={l.title} accent={l.color} features={l.features} custom={i} inView={inView} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Our approach</SectionLabel>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Security enables adoption.<br />Not the other way around.
              </h2>
              <p className="mb-6 leading-relaxed" style={{ color: C.muted2 }}>
                The old model treats AI security as a gate — something that slows deployment and restricts teams. Saola inverts this: security controls are embedded in the platform so enterprises can deploy AI faster, not slower.
              </p>
              <ul className="space-y-3">
                {[
                  "Security enforced at infrastructure level, not policy layer",
                  "No performance overhead on AI inference pipelines",
                  "Controls that scale automatically as adoption grows",
                  "Security posture improves as more teams adopt the platform",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: C.textDim }}>
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: C.accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-8 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: C.muted }}>Language shift</p>
              <div className="space-y-4">
                {[
                  { from: "AI Security", to: "Enterprise AI Infrastructure" },
                  { from: "Compliance", to: "Operational Governance" },
                  { from: "Privacy Protection", to: "Secure Organizational Intelligence" },
                  { from: "AI Monitoring", to: "AI Operations Control" },
                  { from: "Risk Detection", to: "AI Deployment Assurance" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded line-through" style={{ background: C.coralFaint, color: C.coral }}>{item.from}</span>
                    <ArrowRight size={12} style={{ color: C.muted }} />
                    <span className="text-xs px-2.5 py-1 rounded" style={{ background: C.accentFaint, color: C.accentLight }}>{item.to}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTABand
        title="Security that accelerates AI adoption."
        sub="See how Saola's security layer makes enterprise AI deployment faster, not slower."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRICING PAGE
// ══════════════════════════════════════════════════════════════════════════════

function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Custom",
      desc: "For teams beginning their governed AI journey.",
      features: ["Up to 5 AI workflows", "Basic policy controls & RBAC", "Audit trail & compliance logging", "2 enterprise system integrations", "Email support"],
      cta: "Book a Demo",
      highlight: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For organizations deploying AI at scale with full governance.",
      features: ["Unlimited AI workflows & agents", "Advanced policy engine & approval flows", "Full compliance suite (GDPR, DPDP, SOC 2)", "Unlimited system integrations", "Real-time observability & risk dashboards", "Dedicated enterprise success manager", "Custom SLA"],
      cta: "Book a Demo",
      highlight: true,
    },
    {
      name: "Managed",
      price: "Custom",
      desc: "Full-service AI adoption with Saola's enterprise team.",
      features: ["Everything in Enterprise", "Hands-on deployment and integration", "Custom workflow and agent development", "Quarterly business reviews", "Strategic AI adoption consulting"],
      cta: "Talk to an Expert",
      highlight: false,
    },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Pricing"
        title="Infrastructure pricing, not SaaS subscriptions."
        sub="Saola is priced as the enterprise infrastructure layer it is — scaled to your organization's AI adoption journey."
        cta1={{ label: "Book a Demo", href: "#contact" }}
        cta2={{ label: "See Platform", href: ROUTES.platform }}
      />

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl p-8 border flex flex-col relative overflow-hidden"
                style={{
                  background: plan.highlight ? C.accent : C.bg,
                  border: `1px solid ${plan.highlight ? C.accent : C.border}`,
                }}
              >
                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: "rgba(255,255,255,0.3)" }} />
                )}
                <div className="mb-6">
                  <Pill
                    color={plan.highlight ? C.accent : C.accentLight}
                    bg={plan.highlight ? "rgba(255,255,255,0.2)" : C.accentFaint}
                  >
                    {plan.name}
                  </Pill>
                  <div className="text-3xl font-bold mt-3 mb-1" style={{ color: plan.highlight ? "#fff" : C.text }}>{plan.price}</div>
                  <p className="text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.7)" : C.muted }}>{plan.desc}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm"
                      style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : C.textDim }}>
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0"
                        style={{ color: plan.highlight ? "rgba(255,255,255,0.7)" : C.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-colors"
                  style={plan.highlight
                    ? { background: "#fff", color: C.accent }
                    : { background: C.accent, color: "#fff" }
                  }
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTABand
        title="Not sure which plan fits?"
        sub="Our enterprise team will map your AI adoption goals to the right deployment model."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RESOURCES PAGE
// ══════════════════════════════════════════════════════════════════════════════

function ResourcesPage() {
  const posts = [
    { tag: "Guide", title: "Enterprise AI Adoption Playbook: From Pilot to Production", desc: "A step-by-step framework for moving AI initiatives out of experimentation and into governed enterprise workflows.", icon: BookOpen, color: C.accent },
    { tag: "Report", title: "The State of Enterprise AI Governance 2026", desc: "Research across 200+ enterprise organizations on AI adoption maturity, governance gaps, and deployment blockers.", icon: BarChart3, color: C.teal },
    { tag: "Webinar", title: "How to Build a Governed AI Adoption Program", desc: "Live session with enterprise AI practitioners on building infrastructure for safe, scalable AI deployment.", icon: Users, color: C.gold },
    { tag: "Guide", title: "Secure RAG Architecture for Enterprise Knowledge Systems", desc: "Technical guide to deploying retrieval-augmented generation with policy enforcement and data boundary controls.", icon: Database, color: C.coral },
    { tag: "Case Study", title: "90-Day Enterprise AI Deployment: A Saola Customer Story", desc: "How one enterprise moved from fragmented AI experiments to governed production workflows in three months.", icon: TrendingUp, color: C.accent },
    { tag: "Guide", title: "AI Governance Checklist for CIOs and CTOs", desc: "The 24-point governance checklist every enterprise leader needs before scaling AI across business functions.", icon: FileText, color: C.teal },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Resources"
        title="The enterprise AI adoption library."
        sub="Guides, research, and frameworks for organizations moving AI from experimentation to governed production deployment."
        cta1={{ label: "Book a Demo", href: ROUTES.pricing }}
        cta2={{ label: "See Platform", href: ROUTES.platform }}
      />

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="Resources"
            title="Everything you need to operationalize AI."
            sub="Practical resources built for enterprise leaders, platform teams, and AI practitioners."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  whileHover={{ y: -4, borderColor: `${p.color}40` }}
                  className="rounded-2xl p-7 border flex flex-col gap-4 cursor-pointer transition-all duration-300"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center justify-between">
                    <Pill color={p.color}>{p.tag}</Pill>
                    <ArrowUpRight size={14} style={{ color: C.muted }} />
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${p.color}14` }}>
                    <Icon size={16} style={{ color: p.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{p.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTABand
        title="Ready to put AI to work?"
        sub="Start with a 30-minute enterprise assessment — we'll map your AI adoption journey and show you where to begin."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ══════════════════════════════════════════════════════════════════════════════

function AboutPage() {
  const team = [
    { name: "Founder & CEO", desc: "Enterprise AI strategy and platform vision. Previously at large-scale AI deployment organizations." },
    { name: "CTO", desc: "Platform architecture and AI infrastructure engineering. Background in enterprise-grade distributed systems." },
    { name: "VP Governance", desc: "Compliance frameworks, policy engine design, and enterprise risk controls. Former regulatory advisor." },
    { name: "VP Enterprise", desc: "Customer success, enterprise deployment, and strategic partnerships across verticals." },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="About Saola AI Labs"
        title="Built to help enterprises operationalize AI safely."
        sub="Saola AI Labs exists because most organizations want to adopt AI across their operations — but lack the infrastructure, governance, and controls to do it safely at scale."
        cta1={{ label: "Book a Demo", href: ROUTES.pricing }}
        cta2={{ label: "See Platform", href: ROUTES.platform }}
      />

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>Our vision</SectionLabel>
              <h2 className="text-3xl font-bold text-white mb-5 leading-tight">
                Enable every enterprise to put AI to work with confidence, control, and measurable business value.
              </h2>
              <p className="leading-relaxed mb-5" style={{ color: C.muted2 }}>
                AI adoption is accelerating across every industry. But most enterprises are building on fragmented tools, shadow AI usage, and without the infrastructure to deploy it safely across teams, systems, and knowledge.
              </p>
              <p className="leading-relaxed" style={{ color: C.muted2 }}>
                Saola provides the infrastructure layer that makes enterprise AI adoption possible — combining workflow enablement, policy controls, security, and operational visibility in one platform.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Mission", text: "Help organizations deploy and scale AI securely across workflows, systems, and enterprise knowledge through unified governance, operational controls, and enterprise-ready infrastructure." },
                { label: "Category", text: "We are building the Enterprise AI Adoption Platform — the operating layer for organizations moving AI from experimentation to governed production deployment." },
                { label: "Approach", text: "Governance, privacy, compliance, and security are essential capabilities — but they support AI adoption rather than define the company. Saola enables enterprises to deploy AI securely at scale." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-5 border" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <Pill color={C.accent}>{item.label}</Pill>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: C.muted2 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            label="The team"
            title="Enterprise AI practitioners building for enterprise AI practitioners."
            sub="Our team combines platform engineering depth with enterprise governance expertise."
            center maxW="max-w-xl"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((t, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl p-6 border text-center"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: C.accentFaint, border: `1px solid ${C.accentBorder}` }}>
                  <Users size={20} style={{ color: C.accentLight }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{t.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTABand
        title="Join us in building the enterprise AI infrastructure layer."
        sub="We're hiring across platform engineering, enterprise sales, and AI governance."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NOT FOUND
// ══════════════════════════════════════════════════════════════════════════════

function NotFound() {
  return (
    <motion.div {...PAGE_TRANSITION}
      className="min-h-screen flex items-center justify-center text-center px-6 pt-20"
      style={{ background: C.bg }}>
      <div>
        <p className="text-6xl font-bold mb-4" style={{ color: C.accentLight }}>404</p>
        <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
        <p className="mb-8" style={{ color: C.muted }}>This route doesn't exist.</p>
        <PrimaryBtn href={ROUTES.home}>Back to home</PrimaryBtn>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTE TABLE + LAYOUT
// ══════════════════════════════════════════════════════════════════════════════

const PAGES = {
  [ROUTES.home]:       HomePage,
  [ROUTES.platform]:   PlatformPage,
  [ROUTES.governance]: GovernancePage,
  [ROUTES.usecases]:   UseCasesPage,
  [ROUTES.security]:   SecurityPage,
  [ROUTES.pricing]:    PricingPage,
  [ROUTES.resources]:  ResourcesPage,
  [ROUTES.about]:      AboutPage,
};

function Layout() {
  const { path } = useRouter();
  const Page = PAGES[path] || NotFound;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />
      <AnimatePresence mode="wait">
        <Page key={path} />
      </AnimatePresence>
      <Footer />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        body { background: #070A12; }
        a { color: inherit; text-decoration: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D1120; }
        ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #4C3FE0; }
      `}</style>
      <Router>
        <Layout />
      </Router>
    </>
  );
}