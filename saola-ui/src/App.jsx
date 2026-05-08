/**
 * SAOLA AI LABS — Complete Multi-Page SaaS Website (ESLint-clean)
 * All unused imports removed, unused variables cleaned, setState-in-effect fixed.
 */
import {
  useState, useEffect, useRef, useCallback, createContext, useContext
} from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Shield, Zap, Eye, BarChart3, FileCheck, Users, ChevronRight,
  Menu, X, ArrowRight, Cpu, Database, CheckCircle2, Star,
  Layers, Bell, ArrowUpRight, Building2,
  LayoutDashboard, GitBranch, FileText, Download, Link2,
  ScanLine, KeyRound, PieChart, ShieldCheck,
  Target, Briefcase, Code2, GraduationCap,
  Plus, Mail, Globe, Rocket, Lightbulb,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const C = {
  teal:       "#00E5CC",
  tealDim:    "#00B5A0",
  tealFaint:  "rgba(0,229,204,0.08)",
  gold:       "#F5C842",
  goldFaint:  "rgba(245,200,66,0.1)",
  violet:     "#A78BFA",
  violetFaint:"rgba(167,139,250,0.08)",
  coral:      "#F87171",
  coralFaint: "rgba(248,113,113,0.08)",
  bg:         "#030712",
  surface:    "#0D1117",
  surface2:   "#161B22",
  surface3:   "#1C2230",
  border:     "rgba(255,255,255,0.07)",
  border2:    "rgba(255,255,255,0.13)",
  muted:      "#6B7280",
  muted2:     "#94A3B8",
  text:       "#F0F6FC",
  textDim:    "#CBD5E1",
};

const ROUTES = {
  home:      "/",
  platform:  "/platform",
  security:  "/ai-security-tools",
  services:  "/services",
  pricing:   "/pricing",
  resources: "/resources",
  about:     "/about",
  problems:  "/problems-we-solve",
};

const NAV_LINKS = [
  { label: "Platform",    path: ROUTES.platform },
  { label: "AI Security", path: ROUTES.security },
  { label: "Consulting",  path: ROUTES.services },
  { label: "Pricing",     path: ROUTES.pricing },
  { label: "Resources",   path: ROUTES.resources },
  { label: "About",       path: ROUTES.about },
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

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease },
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
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-30%", left: "-20%",
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal} 0%, transparent 70%)`,
          opacity: 0.10 * intensity,
        }}
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute", top: "40%", right: "-15%",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)`,
          opacity: 0.07 * intensity,
        }}
      />
      <motion.div
        animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        style={{
          position: "absolute", bottom: "-10%", left: "35%",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.violet} 0%, transparent 70%)`,
          opacity: 0.06 * intensity,
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

function SectionLabel({ children, color = C.teal }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>
      {children}
    </p>
  );
}

function SectionHead({ label, title, sub, center = false, maxW = "max-w-2xl", color = C.teal }) {
  const [ref, inView] = useScrollReveal();
  return (
    <div ref={ref} className={`${maxW} ${center ? "mx-auto text-center" : ""} mb-16`}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <SectionLabel color={color}>{label}</SectionLabel>
      </motion.div>
      <motion.h2
        custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
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

function Pill({ children, color = C.teal, bg }) {
  return (
    <span
      className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md"
      style={{ color, background: bg || `${color}18` }}
    >
      {children}
    </span>
  );
}

function GlowBtn({ children, href = "#", primary = true, icon: Icon = ArrowRight, small = false }) {
  return (
    <motion.a
      href={href.startsWith("/") ? `#${href}` : href}
      whileHover={{ scale: 1.04, boxShadow: primary ? `0 0 36px rgba(0,229,204,0.38)` : undefined }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center gap-2 rounded-xl font-bold ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`}
      style={primary
        ? { background: C.teal, color: "#030712" }
        : { border: `1px solid ${C.border2}`, color: C.text, background: "rgba(255,255,255,0.04)" }
      }
    >
      {children} {Icon && <Icon size={small ? 13 : 15} />}
    </motion.a>
  );
}

function FeatureCard({ icon: Icon, title, features = [], accent = C.teal, custom = 0, inView = true }) {
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

function PageHero({ eyebrow, title, sub, cta1, cta2, noOrbs = false }) {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-20 pb-16"
      style={{ background: C.bg }}>
      {!noOrbs && <Orbs intensity={0.7} />}
      <GridLines />
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <motion.div {...PAGE_TRANSITION} key="hero-content">
            {eyebrow && (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border"
                style={{ border: `1px solid rgba(0,229,204,0.3)`, background: "rgba(0,229,204,0.06)", color: C.teal }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.teal }} />
                {eyebrow}
              </div>
            )}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.07] tracking-tight mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {title}
            </h1>
            {sub && <p className="text-lg mb-8 leading-relaxed max-w-xl" style={{ color: C.muted2 }}>{sub}</p>}
            {(cta1 || cta2) && (
              <div className="flex flex-wrap gap-3">
                {cta1 && <GlowBtn href={cta1.href || "#"}>{cta1.label}</GlowBtn>}
                {cta2 && <GlowBtn href={cta2.href || "#"} primary={false} icon={cta2.icon || ChevronRight}>{cta2.label}</GlowBtn>}
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

  // FIX: close mobile menu on route change without setState-in-effect warning
  const prevPath = useRef(path);
  useEffect(() => {
  if (prevPath.current !== path) {
    prevPath.current = path;
    setOpen(false);
  }
}, [path]);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 inset-x-0 h-[2px] z-[60] pointer-events-none">
        <motion.div
          className="h-full"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`,
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
            background: scrolled ? "rgba(3,7,18,0.88)" : "transparent",
            backdropFilter: scrolled ? "blur(24px)" : "none",
            borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.home} className="flex items-center gap-3 shrink-0">
  <img
  src="/logo.png"
  alt="Saola AI Labs"
  className="w-14 h-14 object-contain"
/>

  <div className="flex flex-col leading-tight">
    <span
      className="font-bold text-2xl tracking-tight"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <span style={{ color: C.teal }}>Saola</span>{" "}
      <span style={{ color: "white" }}>AI Labs</span>
    </span>

    <span
      className="text-sm"
      style={{ color: "#D1D5DB" }}
    >
      Intelligence with integrity.
    </span>
  </div>
</Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 ml-10">
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
                        style={{ background: C.teal }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to={ROUTES.home} className="text-sm font-medium" style={{ color: C.muted }}>
                Sign in
              </Link>
              <GlowBtn href={ROUTES.pricing} small>Book a Demo</GlowBtn>
            </div>

            {/* Mobile toggle */}
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

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease }}
              className="md:hidden overflow-hidden"
              style={{
                background: "rgba(13,17,23,0.97)",
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
                        style={{ color: active ? C.teal : C.muted2, borderColor: C.border }}
                      >
                        {link.label}
                        <ChevronRight size={14} />
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-4">
                  <GlowBtn href={ROUTES.pricing}>Book a Demo</GlowBtn>
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

// Simple LinkedIn SVG (lucide-react doesn't reliably export it)
function LinkedInicon({ size = 14 }) {
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
      title: "Product",
      links: [
        { label: "Platform",          path: ROUTES.platform },
        { label: "AI Security Tools", path: ROUTES.security },
        { label: "Consulting",        path: ROUTES.services },
        { label: "Pricing",           path: ROUTES.pricing },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog",     path: ROUTES.resources },
        { label: "Guides",   path: ROUTES.resources },
        { label: "Webinars", path: ROUTES.resources },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About",            path: ROUTES.about },
        { label: "Problems We Solve",path: ROUTES.problems },
        { label: "Careers",          path: ROUTES.about },
        { label: "Contact",          path: ROUTES.about },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy",     path: ROUTES.home },
        { label: "Terms",       path: ROUTES.home },
        { label: "DPA Notice",  path: ROUTES.home },
      ],
    },
  ];

  const socialIcons = [
    { Icon: Mail, label: "Email" },
    { Icon: Globe, label: "Website" },
    { Icon: LinkedInicon, label: "LinkedIn" },
  ];

  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
               src="/logo.png"
               alt="Saola AI Labs"
               className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Saola AI Labs
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>
              AI Security, Privacy & Compliance for Indian SMBs and beyond.
            </p>
            <div className="flex gap-2">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-200"
                  style={{ border: `1px solid ${C.border}`, color: C.muted }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.teal;
                    e.currentTarget.style.color = C.teal;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.muted;
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>
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
          <p className="text-xs" style={{ color: C.muted }}>Built for the era of AI-everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED SECTION COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function FinalCTABand({ title = "Ready to turn AI risk into a competitive advantage?", sub }) {
  const [ref, inView] = useScrollReveal();
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: C.bg }}>
      <Orbs intensity={0.8} />
      <div className="max-w-3xl mx-auto px-6 text-center relative" ref={ref}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <SectionLabel>Get started today</SectionLabel>
        </motion.div>
        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
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
          <GlowBtn href={ROUTES.pricing}>Start Free Trial</GlowBtn>
          <GlowBtn href={ROUTES.services} primary={false} icon={ChevronRight}>Talk to an Expert</GlowBtn>
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
            <div className="text-3xl lg:text-4xl font-bold mb-1"
              style={{ color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>{s.val}</div>
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
    { q: "Saola AI Labs made AI compliance simple and visible across our product teams. The readiness score moved 22 points in the first month.", name: "Arjun Mehta", role: "CTO · SaaS company, Bengaluru" },
    { q: "The risk dashboard and policy automation eliminated our cross-border data worry in 30 days. The ROI was immediate.", name: "Priya Rao", role: "CISO · Fintech Startup, Delhi" },
    { q: "Training plus platform workflows gave our leadership real confidence heading into our first AI audit. Zero surprises.", name: "Kiran Joshi", role: "Head of Security Ops · Healthcare Tech, Hyderabad" },
  ];
  return (
    <section className="py-24" style={{ background: C.surface }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <SectionHead label="Social proof" title="Trusted by growing SMBs"
          sub="Indian and international clients in SaaS, fintech, healthcare, and manufacturing."
          center maxW="max-w-xl" />
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border relative overflow-hidden cursor-default"
              style={{ background: C.bg, border: `1px solid ${C.border}` }}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} fill={C.gold} style={{ color: C.gold }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: C.textDim }}>"{t.q}"</p>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{t.role}</p>
              </div>
              <div className="absolute -bottom-2 -right-2 text-[80px] font-serif leading-none select-none"
                style={{ color: "rgba(0,229,204,0.05)" }}>"</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ══════════════════════════════════════════════════════════════════════════════

function DashboardCard() {
  const risks = [
    { label: "Sales Assistant",  risk: "High",   color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
    { label: "Support Bot",      risk: "Medium", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    { label: "Doc Summarizer",   risk: "Low",    color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  ];
  const bars = [
    { label: "GDPR Readiness",  pct: 94, color: C.teal },
    { label: "DPDPA Readiness", pct: 78, color: C.gold },
    { label: "ISO 42001",       pct: 61, color: C.violet },
  ];
  return (
    <div className="rounded-2xl p-5 border"
      style={{
        background: "rgba(13,17,23,0.9)", border: `1px solid ${C.border2}`,
        backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}>
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold" style={{ color: C.muted }}>COMPLIANCE OVERVIEW</span>
        <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.teal }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.teal }} />
          Live
        </span>
      </div>
      {bars.map((b, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: C.muted }}>
            <span>{b.label}</span><span style={{ color: C.text }}>{b.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${b.pct}%` }}
              transition={{ duration: 1.4, delay: 0.7 + i * 0.2, ease }}
              className="h-full rounded-full" style={{ background: b.color }}
            />
          </div>
        </div>
      ))}
      <div className="mt-5 mb-3 text-xs font-semibold" style={{ color: C.muted }}>AI USE CASES</div>
      {risks.map((it, i) => (
        <motion.div
          key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 + i * 0.1 }}
          className="flex items-center justify-between py-2.5 border-b last:border-0"
          style={{ borderColor: C.border }}
        >
          <span className="text-sm" style={{ color: C.text }}>{it.label}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ color: it.color, background: it.bg }}>{it.risk}</span>
        </motion.div>
      ))}
      <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: C.teal }}>
        <Bell size={12} /> 4 policy updates recommended
      </div>
    </div>
  );
}

function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const heroO = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const problems = [
    { icon: Eye,       title: "Shadow GenAI usage",        desc: "Teams use external models without security review, risking data leaks and reputation damage." },
    { icon: FileCheck, title: "No AI governance policy",   desc: "Policy gaps create inconsistent controls and unclear accountability across departments." },
    { icon: Database,  title: "PII in prompts",            desc: "Sensitive data flows into AI engines unintentionally, triggering GDPR/DPDPA exposure." },
    { icon: BarChart3, title: "Compliance visibility gap", desc: "No single pane of glass for obligations across AI use cases and regulatory frameworks." },
    { icon: Users,     title: "Budget & team limits",      desc: "SMBs can't hire large privacy teams but still need institutional-grade controls." },
  ];

  const capabilities = [
    { icon: Layers,  title: "Platform · Privacy & Compliance", accent: C.teal,   features: ["GDPR, DPDPA, ISO 42001 readiness workspace", "Automated assessments & gap analysis", "Audit-ready evidence tracking", "Dynamic compliance scoring"] },
    { icon: Shield,  title: "AI Security Tools",               accent: C.gold,   features: ["PII/PHI detection & masking", "Role-based model access control", "Continuous misuse monitoring", "Exportable risk reports"] },
    { icon: Users,   title: "Advisory & Training",             accent: C.violet, features: ["NIST AI RMF aligned design", "GDPR/DPDPA gap analysis", "Executive & developer training", "Policy playbooks & frameworks"] },
  ];

  const steps = [
    { n: "01", icon: Eye,       title: "Discover",    desc: "Inventory AI use cases, data flows, and risks via guided questionnaires." },
    { n: "02", icon: Cpu,       title: "Design",      desc: "Auto-suggest controls, policies, and technical safeguards tailored to your profile." },
    { n: "03", icon: Zap,       title: "Deploy",      desc: "Activate workflows, secure LLM access, and launch role-based training." },
    { n: "04", icon: BarChart3, title: "Demonstrate", desc: "Maintain audit evidence, dashboards, and compliance reports for any regulator." },
  ];

  const [probRef, probInView] = useScrollReveal();
  const [capRef, capInView]   = useScrollReveal();
  const [stepRef, stepInView] = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-28" style={{ background: C.bg }}>
        <Orbs />
        <GridLines />
        <motion.div style={{ y: heroY, opacity: heroO }}
          className="relative max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8 border"
              style={{ border: `1px solid rgba(0,229,204,0.3)`, background: "rgba(0,229,204,0.06)", color: C.teal }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.teal }} />
              AI Governance · GDPR · DPDPA · ISO 42001
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Bridge AI innovation<br />
              with <span style={{ color: C.teal }}>Kavach</span>-level<br />
              protection.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: C.muted2 }}
            >
              Saola AI Labs helps growing businesses design, secure, and govern AI—with compliance for GDPR, DPDPA, and ISO 42001 built in from day one.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <GlowBtn href={ROUTES.pricing}>Book a Demo</GlowBtn>
              <GlowBtn href={ROUTES.pricing} primary={false} icon={ChevronRight}>Explore Pricing</GlowBtn>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-2.5"
            >
              {["Built for Indian SMBs", "Fast onboarding", "AI Privacy + Security", "No big team needed"].map((t, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ color: C.muted, border: `1px solid ${C.border}` }}>{t}</span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
            className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-[360px]"
          >
            <DashboardCard />
          </motion.div>
        </motion.div>
      </section>

      <StatsBand stats={[
        { val: "82%",  label: "Avg compliance lift in 30 days" },
        { val: "3×",   label: "Faster audit preparation" },
        { val: "Zero", label: "Large team required" },
        { val: "500+", label: "SMBs across India & beyond" },
      ]} />

      {/* PROBLEMS */}
      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={probRef}>
          <SectionHead label="The Problem" title="Why SMBs struggle with AI today"
            sub="Without structured governance, AI projects quickly become risk exposures and compliance gaps."
            maxW="max-w-xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((it, i) => (
              <motion.div
                key={i} custom={i} variants={fadeUp} initial="hidden" animate={probInView ? "visible" : "hidden"}
                whileHover={{ y: -4, borderColor: "rgba(0,229,204,0.2)" }}
                className="group p-6 rounded-2xl border transition-all duration-300 cursor-default"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: C.tealFaint }}>
                  <it.icon size={18} style={{ color: C.teal }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{it.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{it.desc}</p>
              </motion.div>
            ))}
            <motion.div
              custom={5} variants={fadeUp} initial="hidden" animate={probInView ? "visible" : "hidden"}
              className="p-6 rounded-2xl border flex flex-col justify-between"
              style={{ background: "rgba(0,229,204,0.04)", border: "1px solid rgba(0,229,204,0.15)" }}
            >
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: C.teal }}>Sound familiar?</p>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                  We built Saola AI Labs because we lived these problems inside growing companies.
                </p>
              </div>
              <Link to={ROUTES.problems}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: C.teal }}>
                See all challenges <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6" ref={capRef}>
          <SectionHead label="What we do" title="Three pillars of AI governance"
            sub="One platform. Three integrated capabilities. Complete AI security and compliance coverage."
            center maxW="max-w-2xl" />
          <div className="grid lg:grid-cols-3 gap-5">
            {capabilities.map((c, i) => (
              <FeatureCard key={i} {...c} custom={i} inView={capInView} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={ROUTES.platform}
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: C.teal }}>
              Compare all capabilities <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={stepRef}>
          <SectionHead label="How it works" title="From chaos to governed AI"
            sub="A 4-step transformation that aligns people, process, and technology in weeks—not months."
            center maxW="max-w-2xl" />
          <div className="grid lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={stepInView ? "visible" : "hidden"}>
                <div className="p-6 rounded-2xl border h-full"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold tabular-nums" style={{ color: C.teal }}>{s.n}</span>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: C.tealFaint }}>
                      <s.icon size={16} style={{ color: C.teal }} />
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTABand
        title="Ready to turn AI risk into a competitive advantage?"
        sub="Join hundreds of SMBs who govern AI with confidence. Start free, scale as you grow."
      />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: PLATFORM
// ══════════════════════════════════════════════════════════════════════════════

function PlatformPage() {
  const modules = [
    { icon: LayoutDashboard, title: "Compliance Workspace",  accent: C.teal,   features: ["Centralized GDPR/DPDPA/ISO 42001 obligations mapped to AI use cases", "Dynamic readiness score per regulation", "Control library with pre-mapped tasks, owners, and evidence", "Automated gap analysis with remediation suggestions"] },
    { icon: Database,        title: "AI Use Case Register",  accent: C.gold,   features: ["Inventory all AI and GenAI implementations across teams", "Risk rating (Low/Medium/High) with rationale", "Links to DPIA/impact assessments and policies", "Always-on updates as AI usage evolves"] },
    { icon: GitBranch,       title: "Data & Consent Flows",  accent: C.violet, features: ["Data mapping: collection, processing, storage, sharing", "Consent and privacy notices registry", "Out-of-the-box templates for SMB websites and apps", "Cross-border data transfer tracking"] },
    { icon: FileText,        title: "Policy & Evidence Hub", accent: "#34D399", features: ["Store AI, security, and privacy policies in one place", "Track training status, attestations, and sign-offs", "Exportable audit reports (PDF/CSV)", "Version control and change history"] },
  ];

  const tableRows = [
    { area: "GDPR / DPDPA", need: "Structured readiness view",         feature: "Guided assessments, gap analysis" },
    { area: "ISO 42001",    need: "AI & GenAI governance",              feature: "Mapped controls and evidence tasks" },
    { area: "Data privacy", need: "Map data and notices",               feature: "Data flow builder, templates" },
    { area: "Reporting",    need: "Show compliance to clients/auditors", feature: "One-click PDF and CSV exports" },
  ];

  const integrations = ["Google Workspace","Microsoft 365","Slack","Jira","GitHub","Salesforce","HubSpot","Notion"];

  const [modRef, modInView]     = useScrollReveal();
  const [tableRef, tableInView] = useScrollReveal();
  const [intRef, intInView]     = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Saola AI Platform"
        title="One platform for AI-era privacy and compliance."
        sub="Operationalize GDPR, DPDPA, ISO 42001 and emerging AI governance obligations—without hiring a large team."
        cta1={{ label: "Book a Demo", href: ROUTES.pricing }}
        cta2={{ label: "Download Feature Sheet", href: "#", icon: Download }}
      />
      <StatsBand stats={[
        { val: "4",       label: "Compliance frameworks" },
        { val: "30d",     label: "Typical onboarding timeline" },
        { val: "94%",     label: "Avg GDPR readiness improvement" },
        { val: "1-click", label: "Audit report generation" },
      ]} />

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={modRef}>
          <SectionHead label="Core modules" title="Everything compliance in one workspace"
            sub="Structured modules to map obligations, data flows, policy, and audit evidence." />
          <div className="grid md:grid-cols-2 gap-5">
            {modules.map((m, i) => <FeatureCard key={i} {...m} custom={i} inView={modInView} />)}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6" ref={tableRef}>
          <SectionHead label="Capability map" title="What you get, mapped to your needs" />
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={tableInView ? "visible" : "hidden"}
            className="rounded-2xl overflow-hidden border" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: C.surface2 }}>
                  {["Area", "SMB need", "Platform feature"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest"
                      style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.surface }}>
                    <td className="px-6 py-4 font-semibold" style={{ color: C.teal, borderBottom: `1px solid ${C.border}` }}>{r.area}</td>
                    <td className="px-6 py-4" style={{ color: C.muted2, borderBottom: `1px solid ${C.border}` }}>{r.need}</td>
                    <td className="px-6 py-4" style={{ color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{r.feature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={intRef}>
          <SectionHead label="Integrations" title="Connect with what you already use"
            sub="Sync evidence and use cases automatically from your existing tools." />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {integrations.map((name, i) => (
              <motion.div key={i} custom={i} variants={scaleIn} initial="hidden" animate={intInView ? "visible" : "hidden"}
                whileHover={{ y: -3, borderColor: "rgba(0,229,204,0.2)" }}
                className="p-4 rounded-xl border text-center text-sm font-medium transition-all duration-300"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted2 }}>
                <Link2 size={16} className="mx-auto mb-2" style={{ color: C.teal }} />
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="See the platform in action." sub="Book a 30-minute live demo with an AI compliance expert." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: AI SECURITY TOOLS
// ══════════════════════════════════════════════════════════════════════════════

function AISecurityPage() {
  const tools = [
    { icon: ScanLine, title: "Prompt & Data Guard",   accent: C.teal,   features: ["Enforce rules on what data can be sent to external LLMs", "PII/PHI detection and masking in real-time", "Policy-based blocking or redaction workflows", "Audit log of all prompt interactions"] },
    { icon: KeyRound,  title: "Model Access Control",  accent: C.gold,   features: ["Role-based access to AI tools and APIs", "Logging and monitoring of sensitive AI operations", "Anomaly alerts for unusual usage patterns", "SSO and MFA integration support"] },
    { icon: PieChart,  title: "AI Risk Dashboard",     accent: C.violet, features: ["Unified risk view by use case, team, and data type", "Integration with the AI Use Case Register", "Exportable risk reports for management and auditors", "Trend analysis and risk trajectory charts"] },
  ];

  const archRows = [
    { icon: Users,       label: "User / Application",   cls: "",         tag: null,        color: C.muted2 },
    { icon: ScanLine,    label: "Prompt & Data Guard",  cls: "protected",tag: "Protected", color: C.teal },
    { icon: KeyRound,    label: "Model Access Control", cls: "gold-p",   tag: "Protected", color: C.gold },
    { icon: Cpu,         label: "LLM / AI Model",       cls: "",         tag: null,        color: C.muted2 },
    { icon: PieChart,    label: "AI Risk Dashboard",    cls: "violet-p", tag: "Protected", color: C.violet },
    { icon: ShieldCheck, label: "Compliance Workspace", cls: "teal-p",   tag: "Monitored", color: C.teal },
  ];

  const scenario = [
    { step: "01", text: "Sales team drafts proposals using GenAI, accidentally including client PII in prompts.", prob: true },
    { step: "02", text: "Without controls, sensitive data leaks to third-party LLMs. No audit trail. DPDPA violation risk.", prob: true },
    { step: "03", text: "With Saola: Policies block sensitive fields, mask PII, and log all interactions automatically.", prob: false },
    { step: "04", text: "Compliance workspace auto-registers the use case, maps controls, and generates evidence.", prob: false },
  ];

  const [toolRef, toolInView] = useScrollReveal();
  const [scenRef, scenInView] = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="AI Security Tools"
        title="Secure your AI and GenAI before attackers or auditors arrive."
        sub="Policy-driven controls that protect prompts, data, and AI outputs across your entire stack."
        cta1={{ label: "Book a Demo", href: ROUTES.pricing }}
        cta2={{ label: "See how it works", href: "#scenario", icon: ChevronRight }}
      />

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={toolRef}>
          <SectionHead label="Tool clusters" title="Three layers of AI security"
            sub="Layer-by-layer protection from prompt to model to output." />
          <div className="grid lg:grid-cols-3 gap-5">
            {tools.map((t, i) => <FeatureCard key={i} {...t} custom={i} inView={toolInView} />)}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Architecture" title="Security built into every layer" center maxW="max-w-xl" />
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            {archRows.map((row, i) => (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border mb-1"
                  style={{
                    background: row.tag ? `${row.color}08` : C.surface2,
                    border: `1px solid ${row.tag ? `${row.color}30` : C.border}`,
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${row.color}18` }}>
                    <row.icon size={15} style={{ color: row.color }} />
                  </div>
                  <span className="font-medium text-sm flex-1"
                    style={{ color: row.tag ? C.text : C.muted2 }}>{row.label}</span>
                  {row.tag && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: `${row.color}14`, color: row.color }}>{row.tag}</span>
                  )}
                </motion.div>
                {i < archRows.length - 1 && (
                  <div style={{ width: 2, height: 14, background: C.border2, margin: "0 auto 4px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="scenario" className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={scenRef}>
          <SectionHead label="Example scenario" title="How Saola prevents prompt data leaks"
            sub="A real-world example from an Indian SMB sales team." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenario.map((s, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={scenInView ? "visible" : "hidden"}
                className="p-5 rounded-2xl border"
                style={{
                  background: s.prob ? "rgba(248,113,113,0.04)" : "rgba(0,229,204,0.04)",
                  border: `1px solid ${s.prob ? "rgba(248,113,113,0.2)" : "rgba(0,229,204,0.2)"}`,
                }}>
                <span className="text-xs font-bold" style={{ color: s.prob ? C.coral : C.teal }}>{s.step}</span>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: C.textDim }}>{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="Start securing your AI stack today." sub="Get a free assessment of your current AI security posture." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: SERVICES
// ══════════════════════════════════════════════════════════════════════════════

function ServiceCards({ items, cols, refEl, inViewState }) {
  return (
    <div ref={refEl} className={`grid ${cols} gap-5`}>
      {items.map((c, i) => (
        <FeatureCard
          key={i}
          icon={c.icon}
          title={c.title}
          features={c.bullets}
          accent={c.accent}
          custom={i}
          inView={inViewState}
        />
      ))}
    </div>
  );
}

function ServicesPage() {
  const [tab, setTab] = useState("consulting");

  const consulting = [
    { icon: Target,     title: "AI Governance Design",       accent: C.teal,   desc: "Map your AI lifecycle to NIST AI RMF. Define roles, processes, and risk assessment criteria.", bullets: ["NIST AI RMF based policy and control framework", "Risk assessments for priority use cases", "Ethical AI principles and accountability structures"] },
    { icon: ShieldCheck,title: "Privacy & Compliance Advisory", accent: C.gold, desc: "GDPR, DPDPA, ISO 42001 implementation roadmaps with hands-on execution support.", bullets: ["GDPR/DPDPA gap analysis and remediation planning", "ISO 42001 policy and evidence path", "AI-specific DPIAs and vendor risk reviews"] },
    { icon: GitBranch,  title: "AI Security Architecture",   accent: C.violet, desc: "Secure AI deployment patterns on cloud with data, identity, and monitoring controls.", bullets: ["Secure AI access control and data flow protections", "Monitoring and alerting implementation", "Incident response playbooks for AI misuse"] },
  ];

  const training = [
    { icon: Briefcase,    title: "Leadership Track",        accent: C.teal,   desc: "Strategic overview for founders, boards, and senior leaders.", bullets: ["AI risk overview and governance responsibilities", "Audit readiness and regulator engagement", "Building AI governance culture across the org"] },
    { icon: Code2,        title: "Technical Track",         accent: C.gold,   desc: "Hands-on upskilling for engineers and security professionals.", bullets: ["Secure AI/GenAI implementation patterns", "Threat modeling for generative AI systems", "Incident response for model misuse events"] },
    { icon: FileCheck,    title: "Compliance & Legal Track",accent: C.violet, desc: "Deep-dive for DPOs, legal, and compliance professionals.", bullets: ["AI policies, DPIAs, and contract implications", "Impact on privacy notices and consent flows", "Regulatory landscape: GDPR, DPDPA, EU AI Act"] },
    { icon: Users,        title: "All-Hands Awareness",     accent: "#34D399", desc: "Short, engaging modules for every employee who uses AI tools.", bullets: ["Safe AI use for everyday business tools", "Spotting and reporting AI misuse", "Data hygiene when working with AI systems"] },
  ];

  const [consRef, consInView]   = useScrollReveal();
  const [trainRef, trainInView] = useScrollReveal();


  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Consulting & Training"
        title="Expert guidance to design your AI governance program."
        sub="Hands-on advisory and role-based training that actually moves the needle on AI security and compliance."
        cta1={{ label: "Request a Proposal", href: ROUTES.pricing }}
        cta2={{ label: "View training tracks", href: "#training", icon: GraduationCap }}
      />

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 p-1 rounded-xl w-fit mb-12 mx-auto" style={{ background: C.surface }}>
            {[{ id: "consulting", label: "Consulting" }, { id: "training", label: "Training" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{ background: tab === t.id ? C.teal : "transparent", color: tab === t.id ? "#030712" : C.muted2 }}>
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "consulting" && (
              <motion.div key="consulting"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}>
                <ServiceCards items={consulting} cols="lg:grid-cols-3" refEl={consRef} inViewState={consInView} />
                <div className="mt-6 rounded-2xl p-8 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <p className="text-sm font-semibold mb-6 text-center" style={{ color: C.muted }}>Our consulting process</p>
                  <div className="grid grid-cols-4 gap-4">
                    {["Assess", "Design", "Implement", "Review"].map((p, i) => (
                      <div key={i} className="text-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold"
                          style={{ background: `${C.teal}18`, color: C.teal }}>{i + 1}</div>
                        <p className="text-sm font-semibold text-white">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {tab === "training" && (
              <motion.div key="training" id="training"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}>
                <ServiceCards items={training} cols="md:grid-cols-2" refEl={trainRef} inViewState={trainInView} />
                <p className="text-center mt-8 text-sm" style={{ color: C.muted }}>
                  Available as on-site, remote live workshops, or self-paced modules.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <FinalCTABand title="Build AI expertise across your entire team." sub="Custom training programs tailored to your industry and AI stack." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: PRICING
// ══════════════════════════════════════════════════════════════════════════════

function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const tiers = [
    { name: "Starter", desc: "For small teams getting started with AI governance.", monthlyINR: 4999,  monthlyUSD: 59,  primary: false, cta: "Start Free Trial", features: ["Up to 10 employees", "5 AI use cases", "Core compliance workspace (GDPR, DPDPA lite)", "Basic AI Use Case Register", "Email support"] },
    { name: "Growth",  desc: "For scaling SMBs with multiple AI initiatives.",      monthlyINR: 14999, monthlyUSD: 179, primary: true,  cta: "Start Free Trial", badge: "Most Popular", features: ["Up to 50 employees", "Unlimited AI use cases", "Everything in Starter", "ISO 42001 module", "AI Security Tools (Prompt & Data Guard)", "Policy & Evidence Hub", "Email + chat support"] },
    { name: "Scale",   desc: "For larger or regulated organizations.",              monthlyINR: 39999, monthlyUSD: 479, primary: false, cta: "Talk to Sales",    features: ["Unlimited employees", "Everything in Growth", "Advanced AI Security Tools", "Custom workflows & SSO", "Audit exports & integrations", "Priority support + dedicated CSM"] },
  ];

  const faqs = [
    { q: "Can I start with Platform only and add consulting later?",   a: "Absolutely. Our platform and consulting services are independent. Most clients start with the platform and add advisory engagements as their program matures." },
    { q: "Do you offer discounts for annual billing?",                 a: "Yes—annual plans include a 20% discount versus monthly billing. We also offer special pricing for early-stage startups and NGOs." },
    { q: "What if I'm just experimenting with AI?",                    a: "The Starter plan is free to trial for 30 days, no credit card required. It covers the essentials for most teams at the exploration stage." },
    { q: "How does consulting pricing work?",                          a: "Consulting is priced separately, starting from ₹25,000/day or as packaged engagements. Request a proposal for a custom quote." },
  ];

  const disc = annual ? 0.8 : 1;
  const [tierRef, tierInView] = useScrollReveal();
  const [faqRef, faqInView]   = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Pricing"
        title="Simple, transparent pricing for every stage."
        sub="Start free. Scale as you grow. No surprise costs."
        noOrbs
      />

      <div className="flex justify-center py-8" style={{ background: C.bg }}>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: annual ? C.muted : C.text }}>Monthly</span>
          <button
            onClick={() => setAnnual(v => !v)}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: annual ? C.teal : C.surface2 }}
          >
            <motion.div animate={{ x: annual ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full"
              style={{ background: "#fff" }} />
          </button>
          <span className="text-sm" style={{ color: annual ? C.text : C.muted }}>
            Annual <span className="text-xs ml-1 font-semibold" style={{ color: C.teal }}>Save 20%</span>
          </span>
        </div>
      </div>

      <section className="pb-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={tierRef}>
          <div className="grid lg:grid-cols-3 gap-5">
            {tiers.map((tier, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={tierInView ? "visible" : "hidden"}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl p-7 border flex flex-col transition-all duration-300"
                style={{
                  background: tier.primary ? "rgba(0,229,204,0.04)" : C.surface,
                  border: tier.primary ? "2px solid rgba(0,229,204,0.35)" : `1px solid ${C.border}`,
                }}>
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: C.teal, color: "#030712" }}>{tier.badge}</span>
                  </div>
                )}
                <h3 className="font-bold text-xl text-white mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{tier.name}</h3>
                <p className="text-sm mb-5" style={{ color: C.muted }}>{tier.desc}</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      ₹{Math.round(tier.monthlyINR * disc).toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm" style={{ color: C.muted }}>/mo</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    ~${Math.round(tier.monthlyUSD * disc)}/mo · {annual ? "billed annually" : "billed monthly"}
                  </p>
                </div>
                <ul className="space-y-3 flex-1 mb-7">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: C.textDim }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0"
                        style={{ color: tier.primary ? C.teal : C.muted2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <GlowBtn href="#" primary={tier.primary}>{tier.cta}</GlowBtn>
              </motion.div>
            ))}
          </div>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate={tierInView ? "visible" : "hidden"}
            className="mt-5 p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase size={16} style={{ color: C.gold }} />
                <h3 className="font-bold text-white">Consulting & Training Add-ons</h3>
              </div>
              <p className="text-sm" style={{ color: C.muted }}>
                From ₹25,000/day or packaged engagements. Custom quotes available for ongoing retainers.
              </p>
            </div>
            <GlowBtn href={ROUTES.services} primary={false} icon={ChevronRight} small>Request a Proposal</GlowBtn>
          </motion.div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-2xl mx-auto px-6" ref={faqRef}>
          <SectionHead label="FAQ" title="Common questions" center />
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={faqInView ? "visible" : "hidden"}
                className="rounded-xl border overflow-hidden"
                style={{ border: `1px solid ${C.border}`, background: C.bg }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white"
                >
                  {faq.q}
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                    <Plus size={16} style={{ color: C.teal }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="Not sure which plan is right?" sub="Talk to us—we'll help you find the best fit for your team." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: RESOURCES
// ══════════════════════════════════════════════════════════════════════════════

function ResourcesPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "AI Governance", "Privacy & Compliance", "AI Security", "SMB Guides"];

  const posts = [
    { title: "A practical AI governance checklist for Indian SMBs",          tag: "AI Governance",        type: "Guide",   time: "8 min read",  excerpt: "Step-by-step framework for inventorying AI use cases, assessing risk, and building a governance baseline." },
    { title: "How to prepare for DPDPA when you use GenAI daily",            tag: "Privacy & Compliance", type: "Blog",    time: "6 min read",  excerpt: "The DPDPA creates specific obligations for businesses using AI tools that process personal data." },
    { title: "Prompt injection attacks: what SMBs need to know",             tag: "AI Security",          type: "Blog",    time: "5 min read",  excerpt: "A practical overview of prompt injection risks and the controls that prevent them in production AI systems." },
    { title: "ISO 42001 explained for non-technical leaders",                tag: "AI Governance",        type: "Guide",   time: "10 min read", excerpt: "The new international standard for AI management systems, decoded for founders, CTOs, and compliance leads." },
    { title: "GDPR and AI: 5 mistakes Indian SaaS companies make",           tag: "Privacy & Compliance", type: "Blog",    time: "7 min read",  excerpt: "EU customers are asking harder questions. Here are the compliance gaps we see most often." },
    { title: "Building zero-trust AI architecture on a startup budget",      tag: "AI Security",          type: "Webinar", time: "45 min",      excerpt: "Practical security controls for AI pipelines, from prompt to output." },
    { title: "The SMB founder's guide to AI risk management",                tag: "SMB Guides",           type: "Guide",   time: "12 min read", excerpt: "A non-technical framework for evaluating, prioritizing, and managing AI risks without a dedicated security team." },
    { title: "Consent flows in the age of AI-powered products",             tag: "Privacy & Compliance", type: "Blog",    time: "6 min read",  excerpt: "How to update your privacy notices and consent mechanisms when your product uses AI to process user data." },
  ];

  const typeColor = { Guide: C.teal, Blog: C.gold, Webinar: C.violet };
  const shown = filter === "All" ? posts : posts.filter(p => p.tag === filter);
  const [gridRef, gridInView] = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Resources"
        title="Learn how to govern AI with confidence."
        sub="Practical guides, deep-dives, and webinars for SMB founders, CTOs, and compliance leads."
      />
      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 mb-12">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: filter === f ? C.teal : C.surface,
                  color: filter === f ? "#030712" : C.muted2,
                  border: `1px solid ${filter === f ? C.teal : C.border}`,
                }}>
                {f}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" ref={gridRef}>
            {shown.map((post, i) => (
              <motion.a
                key={post.title}
                href="#"
                custom={i % 4} variants={fadeUp} initial="hidden" animate={gridInView ? "visible" : "hidden"}
                whileHover={{ y: -4, borderColor: "rgba(0,229,204,0.2)" }}
                className="flex flex-col p-5 rounded-2xl border transition-all duration-300 group cursor-pointer"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: `${typeColor[post.type]}14`, color: typeColor[post.type] }}>
                    {post.type}
                  </span>
                  <span className="text-xs" style={{ color: C.muted }}>{post.time}</span>
                </div>
                <h3 className="font-semibold text-white text-sm leading-snug mb-2 flex-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{post.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: C.muted }}>{post.tag}</span>
                  <ArrowUpRight size={14} style={{ color: C.teal }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="Want resources tailored to your sector?" sub="Our team produces custom guides for your industry. Talk to us." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: ABOUT
// ══════════════════════════════════════════════════════════════════════════════

function AboutPage() {
  const values = [
    { icon: Rocket,    title: "Pragmatic security & privacy",          desc: "We design for real-world teams—not bureaucracies. Every recommendation is actionable." },
    { icon: Globe,     title: "Civilizational roots, global standards", desc: "Rooted in India's digital economy, aligned to GDPR, NIST, and ISO internationally." },
    { icon: Lightbulb, title: "Designed for builders",                 desc: "We speak the language of engineers, founders, and product teams—not just compliance officers." },
    { icon: Shield,    title: "Trust as a competitive edge",           desc: "We believe that trustworthy AI is a market advantage, not just a regulatory burden." },
  ];

  const team = [
    { name: "Founder & CEO",         role: "10+ years in AI/ML and enterprise security. Previously at a top-4 consulting firm." },
    { name: "Co-founder & CTO",      role: "Built data privacy infrastructure for a major Indian fintech. CISSP certified." },
    { name: "Head of Compliance",    role: "Former DPO for a multinational. Expert in GDPR, DPDPA, and ISO 42001." },
    { name: "Head of AI Security",   role: "Red team lead with specialization in adversarial ML and GenAI threat modeling." },
  ];

  const [valRef, valInView]   = useScrollReveal();
  const [teamRef, teamInView] = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="About Saola AI Labs"
        title="Built to be the bridge that protects AI innovation."
        sub='The name Saola means "bridge." We built Saola AI Labs to be the Setu (bridge) and Kavach (shield) between AI innovation and the governance obligations that protect people.'
      />

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>Our story</SectionLabel>
              <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                We lived the problem before building the solution.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: C.muted2 }}>
                <p>We started Saola AI Labs after watching dozens of Indian SMBs scramble to understand their AI obligations when the DPDPA passed and when their first EU customer asked about GDPR compliance.</p>
                <p>The tools that existed were built for Fortune 500 teams with dedicated DPOs, legal counsel, and 6-figure compliance budgets. Nothing was designed for a 30-person SaaS company in Bengaluru.</p>
                <p>So we built it ourselves—a platform that combines automated compliance workflows with expert advisory, priced and designed for growing businesses.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["2023", "Year founded"], ["6+", "Frameworks supported"], ["500+", "SMBs served"], ["25", "Team members"]].map(([v, l], i) => (
                <motion.div key={i} custom={i} variants={scaleIn} initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border text-center"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="text-3xl font-bold mb-1"
                    style={{ color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6" ref={valRef}>
          <SectionHead label="Values" title="What we believe" center maxW="max-w-xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={valInView ? "visible" : "hidden"}
                className="p-6 rounded-2xl border cursor-default"
                style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <v.icon size={22} className="mb-4" style={{ color: C.teal }} />
                <h3 className="font-semibold text-white mb-2 text-sm">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={teamRef}>
          <SectionHead label="Team" title="The people behind Saola" center maxW="max-w-lg" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={teamInView ? "visible" : "hidden"}
                className="p-6 rounded-2xl border"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-sm font-bold"
                  style={{ background: `${C.teal}18`, color: C.teal }}>
                  {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <p className="font-semibold text-white text-sm mb-1">{m.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="Want to join us?" sub="We're hiring across AI governance, security engineering, and product design." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: PROBLEMS WE SOLVE
// ══════════════════════════════════════════════════════════════════════════════

function ProblemsPage() {
  const challenges = [
    { icon: Eye,       title: "No clear AI inventory",           prob: "Teams adopt AI tools ad-hoc; leadership has no single view of which models are in use, what data they touch, or the risk exposure.",                             sol: "Guided AI Use Case Register that stays always-on and auto-classifies risk as new tools are added.",                                                  accent: C.teal },
    { icon: Database,  title: "Data privacy risk with GenAI",    prob: "Customer and employee personal data ends up in prompts and model training without adequate controls or consent.",                                               sol: "Prompt & Data Guard with PII/PHI detection, masking, and policy-based blocking before data ever reaches an LLM.",                                   accent: C.gold },
    { icon: Layers,    title: "Compliance complexity",           prob: "GDPR for EU clients, DPDPA for Indian data, ISO 42001, and industry guidelines all at once—each with different controls.",                                      sol: "Unified platform that maps all obligations to AI use cases and provides a single readiness score across frameworks.",                                 accent: C.teal },
    { icon: Users,     title: "Limited resources",               prob: "No full-time DPO, CISO, or AI governance team. Budgets are limited. The team is already stretched.",                                                           sol: "Self-service workflows, templates, and on-demand advisory. Get institutional-grade governance without the headcount.",                              accent: C.violet },
    { icon: Building2, title: "Client & regulator expectations", prob: "Bigger customers and partners ask about AI use policies, security controls, and compliance certifications you can't yet demonstrate.",                          sol: "Dashboards, audit-ready reports, and policy attestations you can share externally—with confidence.",                                                  accent: "#34D399" },
  ];

  const [challRef, challInView] = useScrollReveal();

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero
        eyebrow="Problems We Solve"
        title="Every challenge Indian SMBs face with AI—addressed."
        sub="We've seen hundreds of companies struggle with the same AI governance, privacy, and security problems. Here's how we solve each one."
      />

      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6" ref={challRef}>
          <div className="space-y-5">
            {challenges.map((c, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={challInView ? "visible" : "hidden"}
                className="grid md:grid-cols-2 gap-0 rounded-2xl border overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}>
                <div className="p-7 border-b md:border-b-0 md:border-r"
                  style={{ background: C.surface, borderColor: C.border }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: C.coralFaint }}>
                      <c.icon size={16} style={{ color: C.coral }} />
                    </div>
                    <div>
                      <Pill color={C.coral} bg={C.coralFaint}>The challenge</Pill>
                      <h3 className="font-bold text-white mt-2">{c.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{c.prob}</p>
                </div>
                <div className="p-7" style={{ background: `${c.accent}06` }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${c.accent}14` }}>
                      <ShieldCheck size={16} style={{ color: c.accent }} />
                    </div>
                    <Pill color={c.accent}>How Saola AI helps</Pill>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.textDim }}>{c.sol}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: C.surface }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Summary" title="Challenge vs. solution at a glance" center />
          <div className="rounded-2xl overflow-hidden border" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: C.surface2 }}>
                  {["Challenge", "How Saola AI helps"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest"
                      style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {challenges.map((c, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.surface }}>
                    <td className="px-6 py-4 font-medium" style={{ color: C.coral, borderBottom: `1px solid ${C.border}` }}>{c.title}</td>
                    <td className="px-6 py-4" style={{ color: C.muted2, borderBottom: `1px solid ${C.border}` }}>{c.sol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTABand
        title="Recognize your challenges here?"
        sub="Book a free 30-minute assessment—we'll map your specific risks and show you how to close them."
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
        <p className="text-6xl font-bold mb-4"
          style={{ color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>404</p>
        <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
        <p className="mb-8" style={{ color: C.muted }}>This route doesn't exist.</p>
        <GlowBtn href={ROUTES.home}>Back to home</GlowBtn>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTE TABLE + LAYOUT
// ══════════════════════════════════════════════════════════════════════════════

const PAGES = {
  [ROUTES.home]:      HomePage,
  [ROUTES.platform]:  PlatformPage,
  [ROUTES.security]:  AISecurityPage,
  [ROUTES.services]:  ServicesPage,
  [ROUTES.pricing]:   PricingPage,
  [ROUTES.resources]: ResourcesPage,
  [ROUTES.about]:     AboutPage,
  [ROUTES.problems]:  ProblemsPage,
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
        body { background: #030712; }
        a { color: inherit; text-decoration: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D1117; }
        ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00E5CC; }
      `}</style>
      <Router>
        <Layout />
      </Router>
    </>
  );
}
