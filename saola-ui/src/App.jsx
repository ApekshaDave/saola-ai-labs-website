/**
 * SAOLA AI LABS — Enterprise AI Adoption Platform
 * Repositioned per: Portal_Changes.pdf + Saoala_AI_Labs_Repositioning.pdf
 * Category: Enterprise AI Adoption Platform
 * Brand line: Operationalize AI securely.
 */
import {
  useState, useEffect, useRef, useCallback, createContext, useContext
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Eye, BarChart3, Users, ChevronRight,
  Menu, X, ArrowRight, CheckCircle2, Star,
  Bell, ArrowUpRight, FileText,
  KeyRound, ShieldCheck,
  Mail, Globe, Database,
  BookOpen, Cpu, Lock, Settings, TrendingUp,
  Network,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════════════════════
const C = {
  accent:       "#4C3FE0",
  accentLight:  "#7267E8",
  accentFaint:  "rgba(76,63,224,0.10)",
  accentBorder: "rgba(76,63,224,0.30)",
  gold:         "#E8A020",
  goldFaint:    "rgba(232,160,32,0.10)",
  teal:         "#0EA5A0",
  tealFaint:    "rgba(14,165,160,0.10)",
  coral:        "#E05A40",
  coralFaint:   "rgba(224,90,64,0.08)",
  bg:           "#070A12",
  surface:      "#0D1120",
  surface2:     "#141828",
  surface3:     "#1A2035",
  border:       "rgba(255,255,255,0.07)",
  border2:      "rgba(255,255,255,0.13)",
  muted:        "#6B7280",
  muted2:       "#94A3B8",
  text:         "#F0F6FC",
  textDim:      "#CBD5E1",
};

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES & METADATA
// ══════════════════════════════════════════════════════════════════════════════
const ROUTES = {
  home:         "/",
  platform:     "/platform",
  capabilities: "/capabilities",
  usecases:     "/use-cases",
  governance:   "/governance",
  security:     "/security",
  integrations: "/integrations",
  resources:    "/resources",
  company:      "/company",
  bookdemo:     "/book-demo",
};

const PAGE_META = {
  [ROUTES.home]:         { title: "Saola AI Labs | Enterprise AI Adoption Platform", description: "Saola helps organizations deploy AI securely across workflows, systems, and enterprise knowledge with built-in governance, privacy, and operational control." },
  [ROUTES.platform]:     { title: "Platform | Saola AI Labs", description: "Saola's end-to-end platform for governed enterprise AI adoption — combining AI deployment, policy controls, security, and operational visibility." },
  [ROUTES.capabilities]: { title: "Capabilities | Saola AI Labs", description: "Six core capability pillars: AI Workflow Enablement, Governance, Enterprise Security, AI Agent Infrastructure, Knowledge Systems, and Observability." },
  [ROUTES.usecases]:     { title: "Use Cases | Saola AI Labs", description: "Real operational AI deployment scenarios — internal assistants, enterprise search, workflow automation, AI agents, and more." },
  [ROUTES.governance]:   { title: "Governance | Saola AI Labs", description: "Centralized policy controls, access management, approval flows, and audit trails for governed enterprise AI deployment." },
  [ROUTES.security]:     { title: "Security | Saola AI Labs", description: "Enterprise-grade secure organizational intelligence — data privacy controls, secure inference, identity management, and AI deployment assurance." },
  [ROUTES.integrations]: { title: "Integrations | Saola AI Labs", description: "Connect Saola to your enterprise systems, data sources, and workflow tools for unified governed AI adoption." },
  [ROUTES.resources]:    { title: "Resources | Saola AI Labs", description: "Guides, research, and frameworks for enterprise AI adoption, governance, and operational deployment." },
  [ROUTES.company]:      { title: "Company | Saola AI Labs", description: "Saola AI Labs — vision, mission, leadership, and strategic narrative for the enterprise AI adoption platform." },
  [ROUTES.bookdemo]:     { title: "Book a Demo | Saola AI Labs", description: "Book a 30-minute enterprise AI adoption assessment with the Saola team." },
};

const NAV_LINKS = [
  { label: "Platform",     path: ROUTES.platform },
  { label: "Capabilities", path: ROUTES.capabilities },
  { label: "Use Cases",    path: ROUTES.usecases },
  { label: "Governance",   path: ROUTES.governance },
  { label: "Resources",    path: ROUTES.resources },
  { label: "Company",      path: ROUTES.company },
];

// ══════════════════════════════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════════════════════════════
const RouterCtx = createContext({ path: "/", navigate: () => {} });

function Router({ children }) {
  const getPath = () => { const h = window.location.hash.replace("#", "") || "/"; return h.startsWith("/") ? h : "/" + h; };
  const [path, setPath] = useState(getPath);
  useEffect(() => {
    const handler = () => { setPath(getPath()); window.scrollTo({ top: 0, behavior: "instant" }); };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = useCallback((to) => { window.location.hash = to; }, []);
  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>;
}

function useRouter() { return useContext(RouterCtx); }

function Link({ to, children, className, style, onMouseEnter, onMouseLeave, onClick, ...rest }) {
  return <a href={`#${to}`} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} {...rest}>{children}</a>;
}

// ══════════════════════════════════════════════════════════════════════════════
// METADATA HOOK — sets title + meta description per page per PDF spec
// ══════════════════════════════════════════════════════════════════════════════
function usePageMeta(path) {
  useEffect(() => {
    const meta = PAGE_META[path] || PAGE_META[ROUTES.home];
    document.title = meta.title;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) { desc = document.createElement("meta"); desc.name = "description"; document.head.appendChild(desc); }
    desc.content = meta.description;
    ["og:title", "twitter:title"].forEach(prop => {
      const isTw = prop.startsWith("tw");
      let el = document.querySelector(isTw ? `meta[name="${prop}"]` : `meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); isTw ? (el.name = prop) : el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = meta.title;
    });
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement("meta"); ogDesc.setAttribute("property", "og:description"); document.head.appendChild(ogDesc); }
    ogDesc.content = meta.description;
  }, [path]);
}

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════════
function useScrollReveal(margin = "-80px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: margin });
    obs.observe(el); return () => obs.disconnect();
  }, [margin]);
  return [ref, inView];
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => { const el = document.documentElement; const t = el.scrollHeight - el.clientHeight; setP(t > 0 ? el.scrollTop / t : 0); };
    window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h);
  }, []);
  return p;
}

function useScrolled(threshold = 24) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return s;
}

// ══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ══════════════════════════════════════════════════════════════════════════════
const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.09, ease } }),
};
const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

// ══════════════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════
function Orbs({ intensity = 1 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div animate={{ x: [0,50,0], y: [0,-40,0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} style={{ position:"absolute", top:"-30%", left:"-20%", width:700, height:700, borderRadius:"50%", background:`radial-gradient(circle, ${C.accent} 0%, transparent 70%)`, opacity:0.09*intensity }} />
      <motion.div animate={{ x: [0,-60,0], y: [0,50,0] }} transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 5 }} style={{ position:"absolute", top:"40%", right:"-15%", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${C.teal} 0%, transparent 70%)`, opacity:0.07*intensity }} />
      <motion.div animate={{ x: [0,35,0], y: [0,25,0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 10 }} style={{ position:"absolute", bottom:"-10%", left:"35%", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle, ${C.gold} 0%, transparent 70%)`, opacity:0.05*intensity }} />
    </div>
  );
}

function GridLines() {
  return <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage:`linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize:"64px 64px" }} />;
}

function SectionLabel({ children, color = C.accent }) {
  return <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>{children}</p>;
}

function SectionHead({ label, title, sub, center = false, maxW = "max-w-2xl", color = C.accent }) {
  const [ref, inView] = useScrollReveal();
  return (
    <div ref={ref} className={`${maxW} ${center ? "mx-auto text-center" : ""} mb-16`}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <SectionLabel color={color}>{label}</SectionLabel>
      </motion.div>
      <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">{title}</motion.h2>
      {sub && <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ color: C.muted2 }}>{sub}</motion.p>}
    </div>
  );
}

function Pill({ children, color = C.accent, bg }) {
  return <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md" style={{ color, background: bg || `${color}18` }}>{children}</span>;
}

function PrimaryBtn({ children, href = "#", small = false, onClick, type }) {
  if (type === "submit" || onClick) {
    return (
      <motion.button type={type || "button"} onClick={onClick} whileHover={{ scale: 1.04, boxShadow: `0 0 36px rgba(76,63,224,0.40)` }} whileTap={{ scale: 0.96 }} className={`inline-flex items-center gap-2 rounded-xl font-bold cursor-pointer border-0 ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`} style={{ background: C.accent, color: "#ffffff" }}>
        {children} <ArrowRight size={small ? 13 : 15} aria-hidden="true" />
      </motion.button>
    );
  }
  return (
    <motion.a href={href.startsWith("/") ? `#${href}` : href} whileHover={{ scale: 1.04, boxShadow: `0 0 36px rgba(76,63,224,0.40)` }} whileTap={{ scale: 0.96 }} className={`inline-flex items-center gap-2 rounded-xl font-bold ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`} style={{ background: C.accent, color: "#ffffff" }}>
      {children} <ArrowRight size={small ? 13 : 15} aria-hidden="true" />
    </motion.a>
  );
}

function GhostBtn({ children, href = "#", small = false, icon: Icon = ChevronRight }) {
  return (
    <motion.a href={href.startsWith("/") ? `#${href}` : href} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`inline-flex items-center gap-2 rounded-xl font-bold ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`} style={{ border: `1px solid ${C.border2}`, color: C.text, background: "rgba(255,255,255,0.04)" }}>
      {children} {Icon && <Icon size={small ? 13 : 15} aria-hidden="true" />}
    </motion.a>
  );
}

function FeatureCard({ icon: Icon, title, desc, features = [], accent = C.accent, custom = 0, inView = true }) {
  return (
    <motion.div custom={custom} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} whileHover={{ y: -6, borderColor: `${accent}40` }} className="relative rounded-2xl p-7 border overflow-hidden group transition-all duration-300 cursor-default flex flex-col" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
      <div className="absolute top-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0" style={{ background: `${accent}14` }}>
        <Icon size={18} style={{ color: accent }} aria-hidden="true" />
      </div>
      <Pill color={accent}>{title}</Pill>
      {desc && <p className="text-sm mt-3 mb-1 leading-relaxed" style={{ color: C.muted2 }}>{desc}</p>}
      <ul className="mt-3 space-y-2.5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: C.textDim }}>
            <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: accent }} aria-hidden="true" />{f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PageHero({ eyebrow, title, sub, cta1, cta2 }) {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-24 pb-16" style={{ background: C.bg }} aria-labelledby="page-hero-h1">
      <Orbs intensity={0.8} /><GridLines />
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <motion.div {...PAGE_TRANSITION} key="hero-content">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border" style={{ border: `1px solid ${C.accentBorder}`, background: C.accentFaint, color: C.accentLight }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.accent }} aria-hidden="true" />{eyebrow}
              </div>
            )}
            <h1 id="page-hero-h1" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.07] tracking-tight mb-5">{title}</h1>
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
  useEffect(() => { if (prevPath.current !== path) { prevPath.current = path; setOpen(false); } }, [path]);

  return (
    <>
      <div className="fixed top-0 inset-x-0 h-[2px] z-[60] pointer-events-none" aria-hidden="true">
        <motion.div className="h-full" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.teal})` }} />
      </div>
      <motion.header initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease }} className="fixed top-0 inset-x-0 z-50" role="banner">
        <div className="transition-all duration-300" style={{ background: scrolled ? "rgba(7,10,18,0.92)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent" }}>
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to={ROUTES.home} className="flex items-center gap-3 shrink-0" aria-label="Saola AI Labs — Home">
              <img src="/logo.png" alt="Saola AI Labs logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl tracking-tight"><span style={{ color: C.accentLight }}>Saola</span>{" "}<span style={{ color: C.text }}>AI Labs</span></span>
                <span className="text-xs" style={{ color: C.muted }}>Enterprise AI Adoption Platform</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-7 ml-8" aria-label="Primary navigation">
              {NAV_LINKS.map(link => {
                const active = path === link.path;
                return (
                  <Link key={link.path} to={link.path} className="relative text-sm font-medium py-1 transition-colors duration-200" style={{ color: active ? C.text : C.muted }} aria-current={active ? "page" : undefined}>
                    {link.label}
                    {active && <motion.span layoutId="nav-indicator" className="absolute -bottom-0.5 inset-x-0 h-px" style={{ background: C.accent }} />}
                  </Link>
                );
              })}
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <Link to={ROUTES.company} className="text-sm font-medium" style={{ color: C.muted }}>Sign in</Link>
              <PrimaryBtn href={ROUTES.bookdemo} small>Book a Demo</PrimaryBtn>
            </div>
            <button className="md:hidden p-2 rounded-lg border transition-colors" style={{ color: C.text, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)" }} onClick={() => setOpen(v => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease }} className="md:hidden overflow-hidden" style={{ background: "rgba(13,17,32,0.97)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${C.border}` }}>
              <nav className="px-6 py-5 flex flex-col gap-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, i) => {
                  const active = path === link.path;
                  return (
                    <motion.div key={link.path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={link.path} className="flex items-center justify-between py-3 border-b text-sm font-medium" style={{ color: active ? C.accentLight : C.muted2, borderColor: C.border }} aria-current={active ? "page" : undefined}>
                        {link.label}<ChevronRight size={14} aria-hidden="true" />
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-4"><PrimaryBtn href={ROUTES.bookdemo}>Book a Demo</PrimaryBtn></div>
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Footer() {
  const cols = [
    { title: "Platform",  links: [{ label: "Platform Overview", path: ROUTES.platform }, { label: "Capabilities", path: ROUTES.capabilities }, { label: "Governance Layer", path: ROUTES.governance }, { label: "Security Controls", path: ROUTES.security }, { label: "Integrations", path: ROUTES.integrations }] },
    { title: "Solutions", links: [{ label: "Use Cases", path: ROUTES.usecases }, { label: "Enterprise Search", path: ROUTES.usecases }, { label: "AI Agents", path: ROUTES.usecases }, { label: "Workflow Automation", path: ROUTES.usecases }] },
    { title: "Company",   links: [{ label: "About Saola", path: ROUTES.company }, { label: "Vision & Mission", path: ROUTES.company }, { label: "Resources", path: ROUTES.resources }, { label: "Careers", path: ROUTES.company }, { label: "Contact", path: ROUTES.company }] },
    { title: "Legal",     links: [{ label: "Privacy Policy", path: ROUTES.home }, { label: "Terms of Service", path: ROUTES.home }, { label: "Security Overview", path: ROUTES.security }, { label: "DPA Notice", path: ROUTES.home }] },
  ];
  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}` }} role="contentinfo">
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-white mb-1">Start building enterprise AI your organization can trust.</p>
            <p className="text-sm" style={{ color: C.muted }}>Book a 30-minute assessment with our enterprise team.</p>
          </div>
          <PrimaryBtn href={ROUTES.bookdemo}>Book a Demo</PrimaryBtn>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Saola AI Labs" className="w-9 h-9 object-contain" />
              <span className="font-bold text-white">Saola AI Labs</span>
            </div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: C.muted }}>The enterprise infrastructure layer for governed AI adoption.</p>
            <p className="text-xs font-semibold mb-5" style={{ color: C.accentLight }}>Operationalize AI securely.</p>
            <div className="flex gap-2">
              {[{ Icon: Mail, label: "Email" }, { Icon: Globe, label: "Website" }, { Icon: LinkedInIcon, label: "LinkedIn" }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-200" style={{ border: `1px solid ${C.border}`, color: C.muted }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accentLight; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.muted }}>{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm transition-colors duration-200 block" style={{ color: C.muted }} onMouseEnter={e => e.currentTarget.style.color = C.text} onMouseLeave={e => e.currentTarget.style.color = C.muted}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: C.border }}>
          <p className="text-xs" style={{ color: C.muted }}>© 2026 Saola AI Labs · All rights reserved.</p>
          <p className="text-xs" style={{ color: C.muted }}>Enterprise AI Adoption Platform · Operationalize AI securely.</p>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED SECTIONS
// ══════════════════════════════════════════════════════════════════════════════
function FinalCTABand({ title = "Start building enterprise AI systems your organization can trust, govern, and scale.", sub }) {
  const [ref, inView] = useScrollReveal();
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: C.bg }} aria-labelledby="cta-band-h2">
      <Orbs intensity={0.9} />
      <div className="max-w-3xl mx-auto px-6 text-center relative" ref={ref}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <SectionLabel>Get started today</SectionLabel>
        </motion.div>
        <motion.h2 id="cta-band-h2" custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">{title}</motion.h2>
        {sub && <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="mb-10 text-lg" style={{ color: C.muted }}>{sub}</motion.p>}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-wrap gap-4 justify-center">
          <PrimaryBtn href={ROUTES.bookdemo}>Book a Demo</PrimaryBtn>
          <GhostBtn href={ROUTES.usecases}>Explore Use Cases</GhostBtn>
        </motion.div>
      </div>
    </section>
  );
}

function StatsBand({ stats }) {
  const [ref, inView] = useScrollReveal();
  return (
    <div ref={ref} className="py-16 border-y" style={{ background: C.surface, borderColor: C.border }} aria-label="Platform metrics">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center">
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
    { q: "We finally have one layer governing every AI interaction across our teams. Shadow AI usage dropped 60% in the first quarter.", name: "Priya Rao", role: "Chief AI Officer · Fintech, Delhi" },
    { q: "The platform architecture alone convinced our board. Saola is infrastructure, not just tooling — that distinction matters enormously.", name: "Kiran Joshi", role: "VP Engineering · Healthcare Tech, Hyderabad" },
  ];
  return (
    <section className="py-24" style={{ background: C.surface }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <SectionHead label="Enterprise proof" title="Trusted by organizations scaling AI" sub="Enterprises across SaaS, fintech, healthcare, and operations." center maxW="max-w-xl" />
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="rounded-2xl p-7 border flex flex-col gap-4" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <div className="flex gap-1" aria-label="5 stars">
                {[...Array(5)].map((_, s) => <Star key={s} size={13} style={{ color: C.gold }} fill={C.gold} aria-hidden="true" />)}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: C.muted2 }}>&#8220;{t.q}&#8221;</p>
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

function WhySaolaSection() {
  const [ref, inView] = useScrollReveal();
  const reasons = [
    { title: "Governance built in, not bolted on", desc: "Every AI interaction runs through policy enforcement from the start — not retrofitted compliance after the fact." },
    { title: "One platform, not a patchwork", desc: "Adoption, governance, security, and operations unified in a single control plane — not four separate vendor relationships." },
    { title: "Designed for executive buyers", desc: "Built to satisfy CIOs, CTOs, and Chief AI Officers — with platform engineering depth to satisfy technical teams." },
    { title: "Adoption-first architecture", desc: "Security and operational governance are enablers, not gates. Enterprises deploy faster with Saola, not slower." },
    { title: "Scales from one team to the whole org", desc: "Start with a single use case. Extend governed AI adoption across every business function without re-platforming." },
    { title: "Knowledge protection at every layer", desc: "Sensitive organizational data stays protected across every workflow, agent, and retrieval interaction." },
  ];
  return (
    <section className="py-24" style={{ background: C.surface }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead label="Why enterprises choose Saola" title="Enterprise readiness that scales." sub="Strategic enough for executives, concrete enough for platform teams, and trustworthy enough for governance stakeholders." maxW="max-w-xl" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((r, i) => (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="rounded-xl p-6 border" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <CheckCircle2 size={18} style={{ color: C.accent }} className="mb-3" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-white mb-2">{r.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// Section order per PDF: Hero → Stats → Problem → Platform → 6 Capabilities → 6 Use Cases → Why Saola → Testimonials → Final CTA
// ══════════════════════════════════════════════════════════════════════════════
function ArchDiagram() {
  const [ref, inView] = useScrollReveal();
  const nodes = [
    { label: "Enterprise Data",  sub: "Docs, APIs, systems",  icon: Database },
    { label: "Policy Layer",     sub: "Access & governance",  icon: KeyRound },
    { label: "Saola Platform",   sub: "AI operations hub",    icon: Cpu, highlight: true },
    { label: "AI Workflows",     sub: "Agents, copilots",     icon: Rocket },
    { label: "Observability",    sub: "Monitor & audit",      icon: Eye },
  ];
  return (
    <div ref={ref} className="mt-14" role="img" aria-label="Platform architecture: Enterprise Data flows through Policy Layer into Saola Platform, then to AI Workflows and Observability">
      <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: C.muted }}>Platform architecture — end to end</p>
      <div className="flex items-center flex-wrap gap-0">
        {nodes.map((n, i) => {
          const Icon = n.icon;
          return (
            <div key={i} className="flex items-center">
              <motion.div custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="rounded-xl border p-4 flex flex-col items-center text-center min-w-[110px]" style={{ background: n.highlight ? C.accent : C.surface2, border: `1px solid ${n.highlight ? C.accent : C.border}` }}>
                <Icon size={18} style={{ color: n.highlight ? "#fff" : C.accentLight }} className="mb-2" aria-hidden="true" />
                <p className="text-xs font-semibold" style={{ color: n.highlight ? "#fff" : C.text }}>{n.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: n.highlight ? "rgba(255,255,255,0.7)" : C.muted }}>{n.sub}</p>
              </motion.div>
              {i < nodes.length - 1 && <ArrowRight size={16} style={{ color: C.border2, margin: "0 6px", flexShrink: 0 }} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HomePage() {
  usePageMeta(ROUTES.home);
  const [problemRef, problemInView] = useScrollReveal();

  const problems = [
    { num: "01", title: "Fragmented AI adoption",   desc: "Teams deploy AI tools in silos with no central visibility, creating inconsistency, data exposure risk, and governance gaps." },
    { num: "02", title: "Shadow AI behavior",        desc: "Unauthorized models expose sensitive organizational knowledge without policy enforcement or any operational oversight." },
    { num: "03", title: "Pilots that cannot scale",  desc: "Without shared infrastructure, successful experiments cannot cross team boundaries or reach production deployment." },
    { num: "04", title: "Knowledge trapped in silos",desc: "Enterprise data lives in dozens of disconnected systems. AI cannot access it securely without a unified retrieval layer." },
  ];

  const capabilities = [
    { icon: Rocket,   title: "AI Workflow Enablement",        color: C.accent, desc: "Deploy AI into operational processes across every team and function.", features: ["Copilots and AI assistants", "Workflow AI automation", "Multi-model orchestration"] },
    { icon: Settings, title: "Governance and Policy Controls", color: C.teal,   desc: "Manage access, approvals, and compliance centrally — built in, not bolted on.", features: ["Role-based access control", "Approval workflows", "Policy enforcement engine"] },
    { icon: Lock,     title: "Enterprise Security",            color: C.gold,   desc: "Protect sensitive data and organizational knowledge at every layer.", features: ["Secure organizational intelligence", "PII masking and data residency", "Secure inference boundaries"] },
    { icon: Cpu,      title: "AI Agent Infrastructure",        color: C.coral,  desc: "Orchestrate and govern autonomous agents at enterprise scale.", features: ["Agent lifecycle management", "Human-in-the-loop controls", "Multi-agent orchestration"] },
    { icon: Database, title: "Knowledge Systems",              color: C.accent, desc: "Enable secure enterprise AI search and knowledge retrieval.", features: ["Secure RAG pipelines", "Cross-system knowledge retrieval", "Access-controlled knowledge bases"] },
    { icon: Eye,      title: "Observability and Monitoring",   color: C.teal,   desc: "Track AI usage, performance, and deployment assurance in real time.", features: ["AI operations control", "Usage analytics and audit logs", "Policy violation alerting"] },
  ];

  const useCases = [
    { icon: "💬", title: "Internal AI Assistants",       desc: "Policy-aware copilots that answer employee questions using secure, governed enterprise knowledge." },
    { icon: "🔍", title: "Secure Enterprise Search",     desc: "Unified AI search across documents and systems with access controls enforced at every retrieval step." },
    { icon: "🧠", title: "AI Knowledge Copilots",         desc: "Surface institutional knowledge intelligently through pipelines that respect data boundaries and policies." },
    { icon: "🎧", title: "Customer Support Automation",  desc: "AI-powered support workflows that route, respond, and escalate with full observability and governance." },
    { icon: "⚡", title: "Workflow Automation",           desc: "AI operations that process and action enterprise tasks without the risk of ungoverned shadow tooling." },
    { icon: "🤖", title: "Policy-Aware AI Agents",       desc: "Autonomous agents with governance rails, approval flows, and audit trails at every execution stage." },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-16" style={{ background: C.bg }} aria-labelledby="home-h1">
        <Orbs intensity={1} /><GridLines />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border" style={{ border: `1px solid ${C.accentBorder}`, background: C.accentFaint, color: C.accentLight }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.accent }} aria-hidden="true" />
              Enterprise AI Adoption Platform
            </div>
            {/* Approved headline option 3 per PDF */}
            <h1 id="home-h1" className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl">
              Deploy AI across your<br />organization,{" "}
              <span style={{ color: C.accentLight }}>securely</span> and at scale.
            </h1>
            {/* Recommended subheadline per PDF */}
            <p className="text-xl mb-10 leading-relaxed max-w-2xl" style={{ color: C.muted2 }}>
              Deploy AI agents, copilots, and enterprise workflows with built-in governance, privacy, and compliance from day one.
            </p>
            {/* Primary CTA: Book Demo | Secondary: Explore Use Cases — per PDF spec */}
            <div className="flex flex-wrap gap-3">
              <PrimaryBtn href={ROUTES.bookdemo}>Book a Demo</PrimaryBtn>
              <GhostBtn href={ROUTES.usecases}>Explore Use Cases</GhostBtn>
            </div>
          </motion.div>
          {/* Hero visual: product architecture workflow graphic — per PDF */}
          <ArchDiagram />
        </div>
      </section>

      {/* STATS */}
      <StatsBand stats={[
        { val: "4×",   label: "Faster AI pilot to production" },
        { val: "100%", label: "AI interactions governed by default" },
        { val: "60%",  label: "Reduction in shadow AI tool usage" },
        { val: "90d",  label: "Median time to enterprise deployment" },
      ]} />

      {/* SECTION 1: Enterprise AI problem — per PDF homepage section order */}
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="problem-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="The enterprise AI challenge" title="Enterprises want AI. Most cannot deploy it safely." sub="Organizations face four blockers when moving from AI pilots to enterprise production: fragmented tools, shadow AI behavior, governance concerns, data exposure risk, and limited operational control." />
          <div className="grid md:grid-cols-2 gap-1 rounded-2xl overflow-hidden border" style={{ borderColor: C.border }} ref={problemRef}>
            {problems.map((p, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={problemInView ? "visible" : "hidden"} className="p-8 border-b border-r" style={{ background: C.bg, borderColor: C.border }}>
                <div className="text-4xl font-bold mb-4" style={{ color: "#1e1a4a" }} aria-hidden="true">{p.num}</div>
                <h3 className="text-base font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Saola platform — per PDF */}
      <section className="py-24" style={{ background: C.bg }} aria-labelledby="platform-intro-h2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>The Saola platform</SectionLabel>
              <h2 id="platform-intro-h2" className="text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">The operational layer for governed AI adoption.</h2>
              <p className="leading-relaxed mb-6" style={{ color: C.muted2 }}>
                Saola enables organizations to deploy AI securely across workflows, systems, and enterprise knowledge by combining AI adoption, governance, and operational control in one unified platform.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: C.muted2 }}>
                Move beyond isolated experimentation. Reduce shadow AI risk. Protect enterprise knowledge. Give teams the infrastructure to deploy AI with confidence and control.
              </p>
              <div className="flex flex-wrap gap-3">
                <PrimaryBtn href={ROUTES.platform}>See Platform Overview</PrimaryBtn>
                <GhostBtn href={ROUTES.capabilities}>View Capabilities</GhostBtn>
              </div>
            </div>
            <div className="rounded-2xl border p-7" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {[
                { label: "Enterprise AI Adoption",         out: "Business transformation",   color: C.accent },
                { label: "Governance and Policy Controls", out: "Controlled deployment",      color: C.teal },
                { label: "Enterprise Security",            out: "Risk reduction",             color: C.gold },
                { label: "AI Operations Infrastructure",   out: "Scalable AI operations",    color: C.coral },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: C.border }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: row.color }} aria-hidden="true" />
                    <span className="text-sm font-medium text-white">{row.label}</span>
                  </div>
                  <Pill color={row.color}>{row.out}</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Core capabilities — 6 cards per PDF */}
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="caps-home-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Core capabilities" title="Six capabilities. One unified platform." sub="Everything enterprises need to deploy AI across workflows, systems, and knowledge — with governance and operational control built in." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap, i) => (
              <FeatureCard key={i} icon={cap.icon} title={cap.title} desc={cap.desc} accent={cap.color} features={cap.features} custom={i} inView />
            ))}
          </div>
          <div className="mt-10 text-center">
            <GhostBtn href={ROUTES.capabilities}>View All Capabilities</GhostBtn>
          </div>
        </div>
      </section>

      {/* SECTION 4: Enterprise use cases — 6 per PDF */}
      <section className="py-24" style={{ background: C.bg }} aria-labelledby="usecases-home-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Enterprise use cases" title="From pilots to production workflows." sub="Real operational AI deployments Saola enables across organizations today." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((u, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" whileHover={{ y: -4, borderColor: `${C.accent}40` }} className="rounded-2xl p-6 border transition-all duration-300 cursor-default" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="text-2xl mb-4" aria-hidden="true">{u.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{u.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{u.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <GhostBtn href={ROUTES.usecases}>See All Use Cases</GhostBtn>
          </div>
        </div>
      </section>

      {/* SECTION 5: Why enterprises choose Saola */}
      <WhySaolaSection />

      <TestimonialsSection />

      {/* SECTION 6: Final CTA — transformation language per PDF */}
      <FinalCTABand title="Start building enterprise AI systems your organization can trust, govern, and scale." sub="Book a 30-minute enterprise assessment with the Saola team." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PLATFORM PAGE
// ══════════════════════════════════════════════════════════════════════════════
function PlatformPage() {
  usePageMeta(ROUTES.platform);
  const [ref, inView] = useScrollReveal();
  const pillars = [
    { icon: Rocket,   title: "Enterprise AI Adoption",        color: C.accent, features: ["Deploy copilots and assistants into real workflows", "Secure enterprise knowledge retrieval (RAG)", "Multi-model orchestration across teams", "Policy-aware agent execution"] },
    { icon: Settings, title: "Governance and Policy Controls", color: C.teal,   features: ["Role-based access control (RBAC)", "Approval workflows for AI interactions", "Central policy engine and rule management", "Compliance alignment for GDPR, DPDP, SOC 2"] },
    { icon: Lock,     title: "Enterprise Security",            color: C.gold,   features: ["Sensitive data detection and masking", "Secure inference boundaries", "Secure organizational intelligence", "Cross-boundary data controls"] },
    { icon: Eye,      title: "AI Operations Infrastructure",   color: C.coral,  features: ["AI operations control and monitoring", "Agent lifecycle management", "Integration hub for enterprise systems", "Usage analytics and audit trails"] },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Platform Overview" title="The enterprise layer for governed AI adoption." sub="Saola provides the end-to-end infrastructure organizations need to move AI out of pilots and into production — with governance, security, and operational control built in from day one." cta1={{ label: "Book a Demo", href: ROUTES.bookdemo }} cta2={{ label: "Explore Use Cases", href: ROUTES.usecases }} />
      <StatsBand stats={[{ val: "4×", label: "Faster AI deployment" }, { val: "100%", label: "Governed by default" }, { val: "60%", label: "Shadow AI reduction" }, { val: "99.9%", label: "Platform uptime SLA" }]} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="platform-pillars-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Platform pillars" title="Four pillars. One unified enterprise AI platform." sub="Adoption, governance, security, and operations — integrated from the start, not assembled from separate vendors." />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {pillars.map((p, i) => <FeatureCard key={i} icon={p.icon} title={p.title} accent={p.color} features={p.features} custom={i} inView={inView} />)}
          </div>
        </div>
      </section>
      <section className="py-24" style={{ background: C.bg }} aria-labelledby="arch-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Platform architecture" title="How Saola connects your enterprise." sub="A unified control plane that connects data sources, policy enforcement, AI models, and operational monitoring in one governed system." />
          <div className="rounded-2xl border p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Data & Knowledge Sources", items: ["Documents and files", "APIs and databases", "Internal knowledge bases", "Third-party integrations"], icon: Database },
                { label: "Saola Control Plane",      items: ["Policy enforcement engine", "Access and identity controls", "Orchestration layer", "Audit and compliance logging"], icon: Cpu, highlight: true },
                { label: "AI Outputs & Operations",  items: ["Copilots and assistants", "Autonomous agents", "Workflow automation", "AI operations dashboards"], icon: BarChart3 },
              ].map((col, i) => {
                const Icon = col.icon;
                return (
                  <div key={i} className="rounded-xl p-6 border" style={{ background: col.highlight ? C.accent : C.surface2, border: `1px solid ${col.highlight ? C.accent : C.border}` }}>
                    <Icon size={20} style={{ color: col.highlight ? "#fff" : C.accentLight }} className="mb-3" aria-hidden="true" />
                    <h3 className="text-sm font-bold mb-3" style={{ color: col.highlight ? "#fff" : C.text }}>{col.label}</h3>
                    <ul className="space-y-2">
                      {col.items.map((item, j) => (
                        <li key={j} className="text-xs flex items-center gap-2" style={{ color: col.highlight ? "rgba(255,255,255,0.75)" : C.muted }}>
                          <CheckCircle2 size={10} style={{ color: col.highlight ? "rgba(255,255,255,0.6)" : C.accentLight }} aria-hidden="true" />{item}
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
      <FinalCTABand title="Ready to see the full platform in action?" sub="Book a 30-minute technical walkthrough with our enterprise team." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CAPABILITIES PAGE — per PDF: business problem, solution, mechanism, persona, outcome
// ══════════════════════════════════════════════════════════════════════════════
function CapabilitiesPage() {
  usePageMeta(ROUTES.capabilities);
  const [ref, inView] = useScrollReveal();
  const caps = [
    { icon: Rocket,   color: C.accent, title: "AI Workflow Enablement",        problem: "Enterprises have AI ambitions but lack the infrastructure to deploy it into real operational processes across teams.", solution: "Saola provides the deployment layer for AI copilots, assistants, and automation workflows — connected to enterprise systems and governed from day one.", features: ["Copilot deployment for internal teams", "Workflow AI for operational automation", "Secure enterprise knowledge integration", "Multi-model orchestration"], outcome: "Business transformation", persona: ["CIOs", "Business transformation leaders", "Operations leaders"] },
    { icon: Settings, color: C.teal,   title: "Governance and Policy Controls", problem: "Organizations struggle to enforce consistent AI policies across teams, leading to inconsistent outputs and compliance exposure.", solution: "Centralized policy engine with role-based access, approval workflows, and real-time policy enforcement at every AI interaction.", features: ["Role-based access control (RBAC)", "Centralized approval workflows", "Policy versioning and enforcement", "Cross-geography compliance controls"], outcome: "Controlled deployment", persona: ["Chief AI Officers", "Governance leaders", "CTOs"] },
    { icon: Lock,     color: C.gold,   title: "Enterprise Security",            problem: "Sensitive organizational knowledge is exposed when AI tools access enterprise data without proper security controls.", solution: "Secure organizational intelligence layer that protects sensitive data, controls inference boundaries, and governs knowledge access.", features: ["Sensitive data detection and masking", "Secure inference boundaries per tenant", "Knowledge protection controls", "AI deployment assurance"], outcome: "Risk reduction", persona: ["CISOs", "Security teams", "Compliance leaders"] },
    { icon: Cpu,      color: C.coral,  title: "AI Agent Infrastructure",        problem: "Autonomous AI agents deployed without governance rails create uncontrollable execution risks at scale.", solution: "Managed agent infrastructure with governance controls, human-in-the-loop approvals, and full lifecycle observability.", features: ["Agent lifecycle management", "Human-in-the-loop controls", "Multi-agent orchestration", "Agent versioning and rollback"], outcome: "Scalable AI operations", persona: ["Platform engineering", "Chief AI Officers", "CTOs"] },
    { icon: Database, color: C.accent, title: "Knowledge Systems",              problem: "Enterprise knowledge is trapped in disconnected systems. AI cannot access it securely without a unified retrieval layer.", solution: "Secure RAG pipelines that connect enterprise knowledge sources with access controls enforced at every retrieval step.", features: ["Secure RAG deployment", "Cross-system knowledge retrieval", "Access-controlled knowledge bases", "Semantic search with policy enforcement"], outcome: "Governed knowledge access", persona: ["Knowledge managers", "Platform teams", "CKOs"] },
    { icon: Eye,      color: C.teal,   title: "Observability and Monitoring",   problem: "Without visibility into AI operations, organizations cannot manage risk, optimize performance, or demonstrate compliance.", solution: "AI operations control layer providing real-time usage analytics, policy violation alerting, and deployment assurance dashboards.", features: ["Real-time AI operations control", "Usage analytics and anomaly detection", "Policy violation alerting", "Regulator-ready audit exports"], outcome: "Operational accountability", persona: ["Operations leaders", "Governance teams", "Executive stakeholders"] },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Capabilities" title="Six capabilities. Governed AI adoption at scale." sub="Each capability is designed to solve a real enterprise problem — mapped to a business outcome and built into one unified platform." cta1={{ label: "Book a Demo", href: ROUTES.bookdemo }} cta2={{ label: "See Platform", href: ROUTES.platform }} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="caps-detail-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Platform capabilities" title="Built for the business problem, not the feature list." sub="Every capability maps directly to an enterprise deployment outcome." />
          <div className="space-y-5" ref={ref}>
            {caps.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="rounded-2xl border p-8" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${cap.color}14` }}><Icon size={16} style={{ color: cap.color }} aria-hidden="true" /></div>
                        <Pill color={cap.color}>{cap.title}</Pill>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.muted }}>Business problem</p>
                      <p className="text-sm leading-relaxed" style={{ color: C.muted2 }}>{cap.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.muted }}>Saola solution</p>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted2 }}>{cap.solution}</p>
                      <ul className="space-y-1.5">
                        {cap.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs" style={{ color: C.textDim }}>
                            <CheckCircle2 size={11} className="mt-0.5 shrink-0" style={{ color: cap.color }} aria-hidden="true" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Expected outcome</p>
                      <Pill color={cap.color}>{cap.outcome}</Pill>
                      <p className="text-xs font-bold uppercase tracking-widest mt-4 mb-2" style={{ color: C.muted }}>Buyer personas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cap.persona.map((p, j) => <span key={j} className="text-[11px] px-2 py-0.5 rounded" style={{ background: C.surface2, color: C.muted2 }}>{p}</span>)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <FinalCTABand title="See every capability working together." sub="Book a 30-minute platform walkthrough with our enterprise team." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE PAGE
// ══════════════════════════════════════════════════════════════════════════════
function GovernancePage() {
  usePageMeta(ROUTES.governance);
  const [ref, inView] = useScrollReveal();
  const controls = [
    { icon: KeyRound,   title: "Role-Based Access Control",  color: C.accent, features: ["Fine-grained permission management", "Team and department-level policies", "Identity provider integrations (SSO)", "Least-privilege AI access enforcement"] },
    { icon: FileText,   title: "Policy Engine",              color: C.teal,   features: ["Centralized rule definition and versioning", "Automated approval workflows", "Contextual policy enforcement at inference time", "Cross-geography data handling rules"] },
    { icon: Eye,        title: "Audit and Compliance",       color: C.gold,   features: ["Complete audit trails for every AI interaction", "Immutable logs with tamper detection", "Compliance reports for GDPR, DPDP, SOC 2", "Regulator-ready data exports"] },
    { icon: Bell,       title: "AI Deployment Assurance",   color: C.coral,  features: ["Real-time policy violation alerts", "Shadow AI detection and flagging", "Usage anomaly detection", "Executive operational governance dashboards"] },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Governance and Policy Controls" title="Governance built in, not bolted on." sub="Make AI deployment controllable across your organization. Centralized policy enforcement, approval flows, and audit trails that scale from one team to the entire enterprise." cta1={{ label: "Book a Demo", href: ROUTES.bookdemo }} cta2={{ label: "See Platform", href: ROUTES.platform }} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="gov-caps-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Operational governance" title="Every AI interaction, under control." sub="Saola's governance layer enforces policy at the point of inference — not as an afterthought bolted on after deployment." />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {controls.map((c, i) => <FeatureCard key={i} icon={c.icon} title={c.title} accent={c.color} features={c.features} custom={i} inView={inView} />)}
          </div>
        </div>
      </section>
      <section className="py-24" style={{ background: C.bg }} aria-labelledby="compliance-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Compliance alignment" title="Built for regulated industries." sub="Governance controls designed to meet enterprise compliance frameworks in regulated sectors." />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "GDPR",             desc: "Data residency controls, right-to-erasure support, and cross-border data handling policy enforcement." },
              { label: "DPDP Act",         desc: "India's Digital Personal Data Protection Act compliance with granular consent and data principal controls." },
              { label: "SOC 2 Type II",    desc: "Audit-ready evidence generation, access control logging, and continuous monitoring for trust service criteria." },
              { label: "ISO 27001",        desc: "Information security management controls aligned with international enterprise security standards." },
              { label: "HIPAA",            desc: "Healthcare data handling controls, PHI access governance, and audit trail requirements." },
              { label: "Custom Frameworks",desc: "Extend Saola's policy engine with organization-specific controls and compliance rules." },
            ].map((f, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl p-6 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <Pill color={C.accent}>{f.label}</Pill>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: C.muted }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="Make every AI interaction governable." sub="Start with one use case and extend operational governance across your entire organization." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USE CASES PAGE
// ══════════════════════════════════════════════════════════════════════════════
function UseCasesPage() {
  usePageMeta(ROUTES.usecases);
  const cases = [
    { icon: "💬", title: "Internal AI Assistants",      color: C.accent, desc: "Deploy policy-aware copilots that answer employee questions using secure enterprise knowledge bases.", outcomes: ["Reduce support ticket volume by 40%", "Consistent answers grounded in enterprise policy", "Full audit trail on every interaction"], buyers: ["HR leaders", "IT operations", "CIOs"] },
    { icon: "🔍", title: "Secure Enterprise Search",    color: C.teal,   desc: "Unified AI search across documents, databases, and systems with access controls enforced at every retrieval step.", outcomes: ["Surface institutional knowledge instantly", "Data boundary controls enforced at retrieval", "Cross-system search with governance built in"], buyers: ["Knowledge managers", "Platform teams", "CTOs"] },
    { icon: "🧠", title: "AI Knowledge Copilots",        color: C.gold,   desc: "Intelligent knowledge retrieval with context-aware pipelines that respect data boundaries and organizational policies.", outcomes: ["Unlock knowledge trapped across systems", "Context-aware retrieval with policy enforcement", "Reduces knowledge loss from team turnover"], buyers: ["CKOs", "Platform teams", "Operations leaders"] },
    { icon: "🎧", title: "Customer Support Automation", color: C.coral,  desc: "AI-powered support workflows that route, respond, and escalate with governance rails and full observability.", outcomes: ["Automate tier-1 support with policy controls", "Observable, auditable support pipelines", "Seamless escalation to human agents"], buyers: ["Customer success leaders", "Operations", "CIOs"] },
    { icon: "⚡", title: "Workflow Automation",          color: C.accent, desc: "AI-powered operations that route, process, and action enterprise tasks without the risk of ungoverned shadow tooling.", outcomes: ["Automate multi-step processes end to end", "Policy enforcement at every workflow step", "Observable, auditable automation pipelines"], buyers: ["Operations leaders", "Business transformation teams"] },
    { icon: "🤖", title: "Policy-Aware AI Agents",      color: C.teal,   desc: "Orchestrate multi-step autonomous agents with governance rails, observability, and full audit trails at every execution stage.", outcomes: ["Governed agent execution at scale", "Human-in-the-loop controls where required", "Agent lifecycle management and versioning"], buyers: ["Chief AI Officers", "Platform engineering", "CTOs"] },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Use Cases" title="AI across your organization, under control." sub="Real operational deployment scenarios enterprises run on Saola today — organized by business problem, not feature list." cta1={{ label: "Book a Demo", href: ROUTES.bookdemo }} cta2={{ label: "See Platform", href: ROUTES.platform }} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="usecases-detail-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Enterprise use cases" title="From pilots to production workflows." sub="Each use case maps directly to a business outcome — organized by what enterprises need to achieve, not by what the product does." />
          <div className="grid md:grid-cols-2 gap-6">
            {cases.map((c, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" whileHover={{ y: -4 }} className="rounded-2xl p-7 border transition-all duration-300" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-2xl" aria-hidden="true">{c.icon}</div>
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
                        <CheckCircle2 size={11} className="mt-0.5 shrink-0" style={{ color: c.color }} aria-hidden="true" />{o}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {c.buyers.map((b, j) => <span key={j} className="text-[11px] px-2 py-0.5 rounded" style={{ background: C.surface2, color: C.muted2 }}>{b}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="See your use case in action." sub="Book a 30-minute walkthrough specific to your industry and deployment goal." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECURITY PAGE — framed as secure organizational intelligence
// ══════════════════════════════════════════════════════════════════════════════
function SecurityPage() {
  usePageMeta(ROUTES.security);
  const [ref, inView] = useScrollReveal();
  const layers = [
    { icon: Lock,       title: "Secure Organizational Intelligence", color: C.accent, features: ["Sensitive data detection at inference time", "PII masking and anonymization pipelines", "Data residency and sovereignty controls", "Consent management integration"] },
    { icon: ShieldCheck,title: "Secure Inference Layer",             color: C.teal,   features: ["Isolated inference environments per tenant", "Model input/output filtering", "Prompt injection detection", "Secure enterprise knowledge access"] },
    { icon: KeyRound,   title: "Identity and Access",               color: C.gold,   features: ["Enterprise SSO integration (SAML, OIDC)", "Zero-trust access model for AI systems", "Privileged access management for AI agents", "Session-level monitoring and controls"] },
    { icon: Eye,        title: "AI Deployment Assurance",           color: C.coral,  features: ["Shadow AI detection across the organization", "Anomalous usage pattern alerting", "Data exfiltration risk monitoring", "Continuous policy compliance checking"] },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Enterprise Security" title="Security as a trust layer for AI deployment." sub="Protect enterprise data and knowledge across every AI interaction — without slowing down adoption. Security that enables governed deployment, not just controls it." cta1={{ label: "See Platform", href: ROUTES.platform }} cta2={{ label: "Book a Demo", href: ROUTES.bookdemo }} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="security-caps-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Security capabilities" title="Enterprise-grade security without deployment friction." sub="Saola positions security as the trust layer that makes AI adoption possible — not the barrier that prevents it." />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {layers.map((l, i) => <FeatureCard key={i} icon={l.icon} title={l.title} accent={l.color} features={l.features} custom={i} inView={inView} />)}
          </div>
        </div>
      </section>
      <section className="py-24" style={{ background: C.bg }} aria-labelledby="security-approach-h2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Our approach</SectionLabel>
              <h2 id="security-approach-h2" className="text-3xl font-bold text-white mb-4 leading-tight">Security enables adoption.<br />Not the other way around.</h2>
              <p className="mb-6 leading-relaxed" style={{ color: C.muted2 }}>The old model treats AI security as a gate — something that slows deployment and restricts teams. Saola inverts this: security controls are embedded in the platform so enterprises deploy AI faster, not slower.</p>
              <ul className="space-y-3">
                {["Security enforced at infrastructure level, not retrofitted policy layer", "No performance overhead on AI inference pipelines", "Controls that scale automatically as organizational adoption grows", "Security posture strengthens as more teams adopt the platform"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: C.textDim }}>
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: C.accent }} aria-hidden="true" />{item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Language upgrade table per PDF */}
            <div className="rounded-2xl p-8 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: C.muted }}>Language upgrade — how we talk about security</p>
              <div className="space-y-4">
                {[
                  { from: "AI Security",       to: "Enterprise AI Infrastructure" },
                  { from: "Compliance",        to: "Operational Governance" },
                  { from: "Privacy Protection",to: "Secure Organizational Intelligence" },
                  { from: "AI Monitoring",     to: "AI Operations Control" },
                  { from: "Risk Detection",    to: "AI Deployment Assurance" },
                  { from: "AI Governance",     to: "Governed AI Adoption" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded line-through" style={{ background: C.coralFaint, color: C.coral }}>{item.from}</span>
                    <ArrowRight size={12} style={{ color: C.muted }} aria-hidden="true" />
                    <span className="text-xs px-2.5 py-1 rounded" style={{ background: C.accentFaint, color: C.accentLight }}>{item.to}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <FinalCTABand title="Security that accelerates AI adoption." sub="See how Saola's security layer makes enterprise AI deployment faster and safer." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATIONS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function IntegrationsPage() {
  usePageMeta(ROUTES.integrations);
  const [ref, inView] = useScrollReveal();
  const categories = [
    { icon: Database,  title: "Data Sources",          color: C.accent, items: ["Relational databases (PostgreSQL, MySQL)", "Document stores (S3, SharePoint, Confluence)", "Data warehouses (Snowflake, BigQuery)", "Vector databases (Pinecone, Weaviate)"] },
    { icon: Network,   title: "Enterprise Systems",    color: C.teal,   items: ["CRMs (Salesforce, HubSpot)", "ERPs (SAP, Oracle, Workday)", "ITSM (ServiceNow, Jira)", "Communication tools (Slack, Teams)"] },
    { icon: Settings,  title: "Identity and Access",   color: C.gold,   items: ["Okta, Azure AD, Google Workspace SSO", "SAML 2.0 and OIDC integration", "LDAP directory services", "Custom identity providers"] },
    { icon: Eye,       title: "Monitoring and Security",color: C.coral, items: ["SIEM integrations (Splunk, Sentinel)", "Log management (Datadog, Elastic)", "Secret management (HashiCorp Vault)", "Custom webhook endpoints"] },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Integrations" title="Connect Saola to your enterprise ecosystem." sub="Saola integrates with the data sources, systems, and workflow tools your organization already uses — with governance enforced at every connection point." cta1={{ label: "Book a Demo", href: ROUTES.bookdemo }} cta2={{ label: "See Platform", href: ROUTES.platform }} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="integrations-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Integration categories" title="Connect your enterprise data, systems, and workflows." sub="Every integration is governed — access controls and policy enforcement apply at every connection point, not just at the AI output." />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {categories.map((cat, i) => <FeatureCard key={i} icon={cat.icon} title={cat.title} accent={cat.color} features={cat.items} custom={i} inView={inView} />)}
          </div>
        </div>
      </section>
      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Integration approach" title="Governed connectivity at every layer." sub="Saola does not just connect to your systems — it enforces policy at every integration boundary." />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Policy-aware connectors",    desc: "Every data source and system connector enforces access policies and data boundary controls before returning results to AI models." },
              { title: "Credential management",      desc: "Secrets and credentials are managed centrally with rotation, audit logging, and least-privilege access at every integration." },
              { title: "Custom integration support", desc: "Build custom connectors using Saola's integration SDK. Policy enforcement applies automatically to all custom connections." },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="rounded-xl p-6 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="Connect your enterprise to governed AI." sub="Our team will map your integration landscape and design the right connection architecture." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RESOURCES PAGE
// ══════════════════════════════════════════════════════════════════════════════
function ResourcesPage() {
  usePageMeta(ROUTES.resources);
  const posts = [
    { tag: "Guide",      title: "Enterprise AI Adoption Playbook: Pilot to Production",    desc: "A step-by-step framework for moving AI initiatives out of experimentation into governed enterprise workflows.", icon: BookOpen,   color: C.accent },
    { tag: "Report",     title: "The State of Enterprise AI Governance 2026",               desc: "Research across 200+ enterprise organizations on AI adoption maturity, governance gaps, and deployment blockers.", icon: BarChart3,  color: C.teal },
    { tag: "Webinar",    title: "How to Build a Governed AI Adoption Program",              desc: "Live session with enterprise AI practitioners on building infrastructure for safe, scalable AI deployment.", icon: Users,      color: C.gold },
    { tag: "Guide",      title: "Secure RAG Architecture for Enterprise Knowledge Systems", desc: "Technical guide to deploying retrieval-augmented generation with policy enforcement and data boundary controls.", icon: Database,   color: C.coral },
    { tag: "Case Study", title: "90-Day Enterprise AI Deployment: A Saola Customer Story", desc: "How one enterprise moved from fragmented AI experiments to governed production workflows in three months.", icon: TrendingUp, color: C.accent },
    { tag: "Guide",      title: "AI Governance Checklist for CIOs and CTOs",               desc: "The 24-point operational governance checklist every enterprise leader needs before scaling AI across functions.", icon: FileText,   color: C.teal },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Resources" title="The enterprise AI adoption library." sub="Guides, research, and frameworks for organizations moving AI from experimentation to governed production deployment." cta1={{ label: "Book a Demo", href: ROUTES.bookdemo }} cta2={{ label: "See Platform", href: ROUTES.platform }} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="resources-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Resources" title="Everything you need to operationalize AI." sub="Practical resources built for enterprise leaders, platform teams, and AI practitioners." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" whileHover={{ y: -4, borderColor: `${p.color}40` }} className="rounded-2xl p-7 border flex flex-col gap-4 cursor-pointer transition-all duration-300" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between">
                    <Pill color={p.color}>{p.tag}</Pill>
                    <ArrowUpRight size={14} style={{ color: C.muted }} aria-hidden="true" />
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${p.color}14` }}>
                    <Icon size={16} style={{ color: p.color }} aria-hidden="true" />
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
      <FinalCTABand title="Ready to put AI to work across your organization?" sub="Start with a 30-minute enterprise assessment and we will map your AI adoption journey." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPANY PAGE — vision, mission, leadership, strategic narrative per PDF
// ══════════════════════════════════════════════════════════════════════════════
function CompanyPage() {
  usePageMeta(ROUTES.company);
  const team = [
    { name: "Founder & CEO", desc: "Enterprise AI strategy and platform vision. Previously at large-scale AI deployment organizations." },
    { name: "CTO",           desc: "Platform architecture and AI infrastructure engineering. Background in enterprise-grade distributed systems." },
    { name: "VP Governance", desc: "Compliance frameworks, policy engine design, and enterprise risk controls. Former regulatory advisor." },
    { name: "VP Enterprise", desc: "Customer success, enterprise deployment, and strategic partnerships across verticals." },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="About Saola AI Labs" title="Built to help enterprises operationalize AI safely." sub="Saola AI Labs exists because most organizations want to adopt AI across their operations — but lack the infrastructure, governance, and operational controls to do it safely at scale." cta1={{ label: "Book a Demo", href: ROUTES.bookdemo }} cta2={{ label: "See Platform", href: ROUTES.platform }} />
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="vision-h2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel>Vision and mission</SectionLabel>
              <h2 id="vision-h2" className="text-3xl font-bold text-white mb-5 leading-tight">Enable every enterprise to put AI to work with confidence, control, and measurable business value.</h2>
              <p className="leading-relaxed mb-5" style={{ color: C.muted2 }}>AI adoption is accelerating across every industry. But most enterprises are building on fragmented tools, shadow AI usage, and without the infrastructure to deploy it safely across teams, systems, and knowledge.</p>
              <p className="leading-relaxed" style={{ color: C.muted2 }}>Saola provides the infrastructure layer that makes enterprise AI adoption possible — combining workflow enablement, policy controls, enterprise security, and operational visibility in one unified platform.</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Vision",     text: "Enable every enterprise to put AI to work across its people, knowledge, systems, and workflows with confidence, control, and measurable business value." },
                { label: "Mission",    text: "Help organizations deploy and scale AI securely across workflows, systems, and enterprise knowledge through unified governance, operational controls, and enterprise-ready infrastructure." },
                { label: "Category",  text: "Enterprise AI Adoption Platform — the operating layer for organizations moving AI from experimentation to governed production deployment." },
                { label: "Brand line",text: "Operationalize AI securely." },
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
      <section className="py-24" style={{ background: C.bg }} aria-labelledby="narrative-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Strategic narrative" title="Why we built Saola." sub="The go-to-market story behind the platform." maxW="max-w-xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", title: "AI is already happening",   desc: "AI adoption is accelerating across the enterprise before governance, infrastructure, or controls are in place." },
              { step: "02", title: "Without controls, risk compounds", desc: "Fragmented tools, shadow AI behavior, and data exposure concerns grow without centralized operational governance." },
              { step: "03", title: "Enterprises need one layer",desc: "Organizations need a single platform to govern, secure, and operationalize AI across workflows and knowledge systems." },
              { step: "04", title: "Saola provides that layer", desc: "The enterprise infrastructure layer for governed AI adoption — combining adoption, governance, security, and operations." },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl p-6 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="text-3xl font-bold mb-4" style={{ color: "#1e1a4a" }} aria-hidden="true">{item.step}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24" style={{ background: C.surface }} aria-labelledby="team-h2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Leadership" title="Enterprise AI practitioners building for enterprise AI practitioners." sub="Our team combines platform engineering depth with enterprise governance expertise." center maxW="max-w-xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((t, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl p-6 border text-center" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: C.accentFaint, border: `1px solid ${C.accentBorder}` }}>
                  <Users size={20} style={{ color: C.accentLight }} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{t.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTABand title="Join us in building the enterprise AI infrastructure layer." sub="We are hiring across platform engineering, enterprise sales, and AI governance." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BOOK DEMO PAGE — full conversion form per PDF spec
// Fields: Full name, Work email, Company, Role, Team/company size, Primary use case, Optional message
// ══════════════════════════════════════════════════════════════════════════════
// Declared outside BookDemoPage to avoid "component created during render" lint error
function FieldErr({ error }) {
  if (!error) return null;
  return <p role="alert" style={{ color: C.coral, fontSize: "0.7rem", marginTop: "0.25rem" }}>{error}</p>;
}

function BookDemoPage() {
  usePageMeta(ROUTES.bookdemo);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", size: "", usecase: "", message: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Full name is required";
    if (!form.email.trim())   e.email   = "Work email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address";
    if (!form.company.trim()) e.company = "Company name is required";
    if (!form.role.trim())    e.role    = "Your role is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const inputBase = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: C.surface2, color: C.text, fontSize: "0.875rem", outline: "none", fontFamily: "inherit" };
  const inputStyle = (field) => ({ ...inputBase, border: `1px solid ${errors[field] ? C.coral : C.border2}` });
  const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.4rem", color: C.muted2 };

  return (
    <motion.div {...PAGE_TRANSITION}>
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: C.bg }} aria-labelledby="demo-h1">
        <Orbs intensity={0.6} /><GridLines />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: value proposition */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border" style={{ border: `1px solid ${C.accentBorder}`, background: C.accentFaint, color: C.accentLight }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} aria-hidden="true" />Enterprise AI Adoption Platform
              </div>
              <h1 id="demo-h1" className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">Book an enterprise<br />AI assessment.</h1>
              <p className="text-lg mb-10 leading-relaxed" style={{ color: C.muted2 }}>A 30-minute session with the Saola enterprise team. We will map your AI adoption goals, identify governance gaps, and show you how Saola fits your organization.</p>
              <div className="space-y-5">
                {[
                  { title: "Platform walkthrough",     desc: "See the Saola platform running with real enterprise workflows and governance controls." },
                  { title: "Use case mapping",         desc: "We will identify the two or three use cases most likely to deliver early value in your organization." },
                  { title: "Governance gap analysis",  desc: "Understand where your current AI adoption has governance exposure and how Saola closes it." },
                  { title: "No-pressure conversation", desc: "Senior enterprise team, not a sales script. We are interested in what you are trying to build." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} style={{ color: C.accent, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: C.muted }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: form */}
            <div className="rounded-2xl border p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: C.accentFaint, border: `1px solid ${C.accentBorder}` }}>
                    <CheckCircle2 size={28} style={{ color: C.accent }} aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3">Request received.</h2>
                  <p className="text-sm mb-6" style={{ color: C.muted }}>Our enterprise team will reach out within one business day to confirm your session and send calendar details.</p>
                  <Pill color={C.accent}>Expect a reply within 24 hours</Pill>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white mb-6">Book your session</h2>
                  <form onSubmit={handleSubmit} noValidate aria-label="Book a demo form">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="f-name" style={labelStyle}>Full name <span aria-hidden="true" style={{ color: C.coral }}>*</span></label>
                        <input id="f-name" type="text" placeholder="Jane Smith" value={form.name} onChange={e => handleChange("name", e.target.value)} style={inputStyle("name")} aria-required="true" aria-describedby="f-name-err" />
                        <div id="f-name-err"><FieldErr error={errors.name} /></div>
                      </div>
                      <div>
                        <label htmlFor="f-email" style={labelStyle}>Work email <span aria-hidden="true" style={{ color: C.coral }}>*</span></label>
                        <input id="f-email" type="email" placeholder="jane@company.com" value={form.email} onChange={e => handleChange("email", e.target.value)} style={inputStyle("email")} aria-required="true" aria-describedby="f-email-err" />
                        <div id="f-email-err"><FieldErr error={errors.email} /></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="f-company" style={labelStyle}>Company <span aria-hidden="true" style={{ color: C.coral }}>*</span></label>
                        <input id="f-company" type="text" placeholder="Acme Corp" value={form.company} onChange={e => handleChange("company", e.target.value)} style={inputStyle("company")} aria-required="true" aria-describedby="f-company-err" />
                        <div id="f-company-err"><FieldErr error={errors.company} /></div>
                      </div>
                      <div>
                        <label htmlFor="f-role" style={labelStyle}>Your role <span aria-hidden="true" style={{ color: C.coral }}>*</span></label>
                        <input id="f-role" type="text" placeholder="CTO, Head of AI..." value={form.role} onChange={e => handleChange("role", e.target.value)} style={inputStyle("role")} aria-required="true" aria-describedby="f-role-err" />
                        <div id="f-role-err"><FieldErr error={errors.role} /></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="f-size" style={labelStyle}>Company size</label>
                      <select id="f-size" value={form.size} onChange={e => handleChange("size", e.target.value)} style={{ ...inputStyle("size"), appearance: "none" }}>
                        <option value="">Select company size</option>
                        <option value="1-50">1–50 employees</option>
                        <option value="51-200">51–200 employees</option>
                        <option value="201-1000">201–1,000 employees</option>
                        <option value="1001-5000">1,001–5,000 employees</option>
                        <option value="5000+">5,000+ employees</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="f-usecase" style={labelStyle}>Primary use case</label>
                      <select id="f-usecase" value={form.usecase} onChange={e => handleChange("usecase", e.target.value)} style={{ ...inputStyle("usecase"), appearance: "none" }}>
                        <option value="">Select your primary use case</option>
                        <option value="internal-ai">Internal AI assistants</option>
                        <option value="enterprise-search">Secure enterprise search</option>
                        <option value="workflow-automation">Workflow automation</option>
                        <option value="ai-agents">AI agent deployment</option>
                        <option value="knowledge-systems">Knowledge intelligence</option>
                        <option value="governance">Governance and compliance</option>
                        <option value="other">Other / not sure yet</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="f-message" style={labelStyle}>Anything else you would like us to know (optional)</label>
                      <textarea id="f-message" rows={3} placeholder="Share context about your AI adoption goals, current stack, or specific challenges..." value={form.message} onChange={e => handleChange("message", e.target.value)} style={{ ...inputStyle("message"), resize: "vertical" }} />
                    </div>
                    <PrimaryBtn type="submit">Request a Demo Session</PrimaryBtn>
                    <p className="text-xs mt-4" style={{ color: C.muted }}>By submitting, you agree to our Privacy Policy. We will respond within one business day.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NOT FOUND
// ══════════════════════════════════════════════════════════════════════════════
function NotFound() {
  return (
    <motion.div {...PAGE_TRANSITION} className="min-h-screen flex items-center justify-center text-center px-6 pt-20" style={{ background: C.bg }}>
      <div>
        <p className="text-6xl font-bold mb-4" style={{ color: C.accentLight }}>404</p>
        <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
        <p className="mb-8" style={{ color: C.muted }}>This page does not exist.</p>
        <PrimaryBtn href={ROUTES.home}>Back to home</PrimaryBtn>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTE TABLE + LAYOUT
// ══════════════════════════════════════════════════════════════════════════════
const PAGES = {
  [ROUTES.home]:         HomePage,
  [ROUTES.platform]:     PlatformPage,
  [ROUTES.capabilities]: CapabilitiesPage,
  [ROUTES.usecases]:     UseCasesPage,
  [ROUTES.governance]:   GovernancePage,
  [ROUTES.security]:     SecurityPage,
  [ROUTES.integrations]: IntegrationsPage,
  [ROUTES.resources]:    ResourcesPage,
  [ROUTES.company]:      CompanyPage,
  [ROUTES.bookdemo]:     BookDemoPage,
};

function Layout() {
  const { path } = useRouter();
  const Page = PAGES[path] || NotFound;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />
      <main id="main-content" role="main">
        <AnimatePresence mode="wait">
          <Page key={path} />
        </AnimatePresence>
      </main>
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
        button { font-family: inherit; }
        input:focus, select:focus, textarea:focus { outline: 2px solid #4C3FE0; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D1120; }
        ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #4C3FE0; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
      `}</style>
      <Router>
        <Layout />
      </Router>
    </>
  );
}