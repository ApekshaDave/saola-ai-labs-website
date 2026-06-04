/**
 * SAOLA AI LABS — Practical AI Adoption for SMBs
 * Repositioned per: Website_Design_Document.pdf
 * Brand: AI consultancy + operational transformation partner + responsible AI advisor
 * Audience: SMB owners, founders, operators
 * CTA: Book a discovery call
 */
import {
  useState, useEffect, useRef, useCallback, createContext, useContext
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map, Workflow, GraduationCap, ShieldCheck, Lock,
  ChevronRight, Menu, X, ArrowRight, CheckCircle2, Star,
  Mail, Globe, Phone,
  Users,
  TrendingUp, Search, Award, Target,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — light, teal-led, calm, professional per PDF spec
// ══════════════════════════════════════════════════════════════════════════════
const C = {
  // Primary: deep teal / blue-green
  primary:       "#0D6B6E",
  primaryDark:   "#094F52",
  primaryLight:  "#E6F4F4",
  primaryMid:    "#1A8F93",
  primaryFaint:  "rgba(13,107,110,0.08)",
  primaryBorder: "rgba(13,107,110,0.20)",
  // Secondary accent: muted amber for process markers
  amber:         "#D97706",
  amberLight:    "#FEF3C7",
  amberFaint:    "rgba(217,119,6,0.10)",
  // Sage accent
  sage:          "#4A7C59",
  sageFaint:     "rgba(74,124,89,0.09)",
  // Slate for secondary elements
  slate:         "#475569",
  slateLight:    "#F1F5F9",
  // Backgrounds — light theme
  bg:            "#FAFAF9",
  bgAlt:         "#F4F7F7",
  bgDeep:        "#0D6B6E",   // dark teal sections
  surface:       "#FFFFFF",
  surface2:      "#F8FAFA",
  // Borders
  border:        "rgba(13,107,110,0.12)",
  border2:       "rgba(0,0,0,0.08)",
  borderDark:    "rgba(255,255,255,0.15)",
  // Text
  ink:           "#111827",
  inkMid:        "#374151",
  inkMuted:      "#6B7280",
  inkFaint:      "#9CA3AF",
  textOnDark:    "#FFFFFF",
  textOnDarkMid: "rgba(255,255,255,0.80)",
  textOnDarkMuted:"rgba(255,255,255,0.55)",
};

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES & METADATA
// ══════════════════════════════════════════════════════════════════════════════
const ROUTES = {
  home:        "/",
  services:    "/services",
  strategy:    "/services/ai-strategy",
  automation:  "/services/ai-automation",
  training:    "/services/ai-training",
  governance:  "/services/responsible-ai",
  privacy:     "/services/data-privacy",
  whySaola:    "/why-saola",
  usecases:    "/use-cases",
  about:       "/about",
  contact:     "/contact",
};

const PAGE_META = {
  [ROUTES.home]:       { title: "Saola AI Labs | Practical AI Adoption for Growing Businesses", description: "Saola helps SMBs adopt AI securely and responsibly through workflow automation, team training, governance, and hands-on implementation." },
  [ROUTES.services]:   { title: "Services | Saola AI Labs", description: "Five AI adoption service pillars: Strategy & Consulting, Workflow Automation, Team Training, Responsible AI, and Data Privacy." },
  [ROUTES.strategy]:   { title: "AI Strategy & Consulting | Saola AI Labs", description: "Find the right AI opportunities for your business and build a practical adoption strategy with Saola." },
  [ROUTES.automation]: { title: "AI Workflow Automation | Saola AI Labs", description: "Automate repetitive work and help teams operate more efficiently with Saola's AI workflow services." },
  [ROUTES.training]:   { title: "AI Training & Workforce Enablement | Saola AI Labs", description: "Help teams confidently adopt AI in everyday work with Saola's training and enablement services." },
  [ROUTES.governance]: { title: "Responsible AI & Governance | Saola AI Labs", description: "Adopt AI responsibly with clear policies, governance, and oversight that protect your business and customers." },
  [ROUTES.privacy]:    { title: "Data Privacy & AI Security | Saola AI Labs", description: "Ensure AI tools are implemented with strong data privacy and security practices." },
  [ROUTES.whySaola]:   { title: "Why Saola | Saola AI Labs", description: "Why growing businesses choose Saola for practical, secure, and responsible AI adoption." },
  [ROUTES.usecases]:   { title: "Use Cases | Saola AI Labs", description: "Real AI adoption outcomes for SMBs — workflow automation, team enablement, governance, and more." },
  [ROUTES.about]:      { title: "About | Saola AI Labs", description: "Saola AI Labs — vision, mission, and team behind practical AI adoption for SMBs." },
  [ROUTES.contact]:    { title: "Book a Discovery Call | Saola AI Labs", description: "Book a discovery call with Saola to explore where AI can create practical value in your business." },
};

const NAV_LINKS = [
  { label: "Services",   path: ROUTES.services },
  { label: "Why Saola",  path: ROUTES.whySaola },
  { label: "Use Cases",  path: ROUTES.usecases },
  { label: "About",      path: ROUTES.about },
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
// METADATA HOOK
// ══════════════════════════════════════════════════════════════════════════════
function usePageMeta(path) {
  useEffect(() => {
    const meta = PAGE_META[path] || PAGE_META[ROUTES.home];
    document.title = meta.title;
    const setOrCreate = (selector, createFn, contentFn) => {
      let el = document.querySelector(selector);
      if (!el) { el = createFn(); document.head.appendChild(el); }
      el.content = contentFn(meta);
    };
    setOrCreate('meta[name="description"]', () => { const e = document.createElement("meta"); e.name = "description"; return e; }, m => m.description);
    setOrCreate('meta[property="og:title"]', () => { const e = document.createElement("meta"); e.setAttribute("property","og:title"); return e; }, m => m.title);
    setOrCreate('meta[property="og:description"]', () => { const e = document.createElement("meta"); e.setAttribute("property","og:description"); return e; }, m => m.description);
    setOrCreate('meta[name="twitter:title"]', () => { const e = document.createElement("meta"); e.name = "twitter:title"; return e; }, m => m.title);
  }, [path]);
}

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════════
function useScrollReveal(margin = "-60px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: margin });
    obs.observe(el); return () => obs.disconnect();
  }, [margin]);
  return [ref, inView];
}
function useScrolled(threshold = 20) {
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
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease } }),
};
const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.22 } },
};

// ══════════════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════
function SectionLabel({ children, dark = false }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3"
      style={{ color: dark ? "rgba(255,255,255,0.55)" : C.primaryMid }}>
      {children}
    </p>
  );
}

function SectionHead({ label, title, sub, center = false, maxW = "max-w-2xl", dark = false }) {
  const [ref, inView] = useScrollReveal();
  return (
    <div ref={ref} className={`${maxW} ${center ? "mx-auto text-center" : ""} mb-14`}>
      {label && (
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <SectionLabel dark={dark}>{label}</SectionLabel>
        </motion.div>
      )}
      <motion.h2
        custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="text-3xl lg:text-4xl font-bold leading-tight mb-4"
        style={{ color: dark ? C.textOnDark : C.ink }}
      >{title}</motion.h2>
      {sub && (
        <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="text-base leading-relaxed"
          style={{ color: dark ? C.textOnDarkMid : C.inkMuted }}
        >{sub}</motion.p>
      )}
    </div>
  );
}

function Pill({ children, color = C.primary, bg }) {
  return (
    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color, background: bg || `${color}14` }}>
      {children}
    </span>
  );
}

// Primary CTA — teal filled
function PrimaryBtn({ children, href = "#", small = false, onClick, type, dark = false }) {
  const base = `inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-200 ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`;
  if (type === "submit" || onClick) {
    return (
      <motion.button type={type || "button"} onClick={onClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className={`${base} border-0 cursor-pointer`}
        style={{ background: C.primary, color: "#fff" }}>
        {children} <ArrowRight size={small ? 13 : 15} aria-hidden="true" />
      </motion.button>
    );
  }
  return (
    <motion.a href={href.startsWith("/") ? `#${href}` : href} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      className={base} style={{ background: dark ? "#fff" : C.primary, color: dark ? C.primary : "#fff" }}>
      {children} <ArrowRight size={small ? 13 : 15} aria-hidden="true" />
    </motion.a>
  );
}

// Secondary / ghost CTA
function OutlineBtn({ children, href = "#", small = false, dark = false }) {
  return (
    <motion.a href={href.startsWith("/") ? `#${href}` : href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-200 ${small ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-sm"}`}
      style={{ border: `1.5px solid ${dark ? "rgba(255,255,255,0.4)" : C.primary}`, color: dark ? C.textOnDark : C.primary, background: "transparent" }}>
      {children} <ChevronRight size={small ? 13 : 15} aria-hidden="true" />
    </motion.a>
  );
}

// Service card
function ServiceCard({ icon: Icon, title, desc, color = C.primary, href, custom = 0, inView = true }) {
  return (
    <motion.div custom={custom} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(13,107,110,0.12)" }}
      className="relative rounded-2xl p-7 border flex flex-col cursor-default transition-all duration-300"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shrink-0"
        style={{ background: C.primaryFaint }}>
        <Icon size={20} style={{ color: C.primary }} aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold mb-2" style={{ color: C.ink }}>{title}</h3>
      <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: C.inkMuted }}>{desc}</p>
      {href && (
        <Link to={href} className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: C.primary }}
          onMouseEnter={e => e.currentTarget.style.color = C.primaryDark}
          onMouseLeave={e => e.currentTarget.style.color = C.primary}>
          Learn more <ArrowRight size={12} aria-hidden="true" />
        </Link>
      )}
    </motion.div>
  );
}

// Page hero — light version
function PageHero({ eyebrow, title, sub, cta1, cta2, dark = false }) {
  const bg = dark ? C.bgDeep : C.bgAlt;
  return (
    <section className="relative pt-28 pb-20 overflow-hidden" style={{ background: bg }} aria-labelledby="page-h1">
      {dark && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(26,143,147,0.25) 0%, transparent 70%)" }} />
      )}
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div {...PAGE_TRANSITION}>
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: dark ? "rgba(255,255,255,0.12)" : C.primaryFaint, color: dark ? C.textOnDark : C.primary, border: `1px solid ${dark ? "rgba(255,255,255,0.2)" : C.primaryBorder}` }}>
              {eyebrow}
            </div>
          )}
          <h1 id="page-h1" className="text-4xl sm:text-5xl font-bold leading-tight mb-5 max-w-3xl"
            style={{ color: dark ? C.textOnDark : C.ink }}>{title}</h1>
          {sub && <p className="text-lg mb-8 leading-relaxed max-w-xl" style={{ color: dark ? C.textOnDarkMid : C.inkMuted }}>{sub}</p>}
          {(cta1 || cta2) && (
            <div className="flex flex-wrap gap-3">
              {cta1 && <PrimaryBtn href={cta1.href} dark={dark}>{cta1.label}</PrimaryBtn>}
              {cta2 && <OutlineBtn href={cta2.href} dark={dark}>{cta2.label}</OutlineBtn>}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAVBAR — clean, confidence-building per PDF
// ══════════════════════════════════════════════════════════════════════════════
function Navbar() {
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const prevPath = useRef(path);
  useEffect(() => { if (prevPath.current !== path) { prevPath.current = path; setOpen(false); } }, [path]);

  return (
    <motion.header initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease }}
      className="fixed top-0 inset-x-0 z-50" role="banner">
      <div className="transition-all duration-300"
        style={{ background: scrolled ? "rgba(250,250,249,0.96)" : "rgba(250,250,249,0.92)", backdropFilter: "blur(16px)", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent", boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none" }}>
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: 72 }}>
          {/* Logo */}
          <Link to={ROUTES.home} className="flex items-center gap-3 shrink-0" aria-label="Saola AI Labs — Home">
            <img src="/logo-2.png" alt="Saola AI Labs logo" className="w-10 h-10 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg tracking-tight" style={{ color: C.ink }}>
                Saola <span style={{ color: C.primary }}>AI Labs</span>
              </span>
              <span className="text-[10px] font-medium" style={{ color: C.inkMuted }}>Practical AI for Growing Businesses</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV_LINKS.map(link => {
              const active = path === link.path || (link.path === ROUTES.services && path.startsWith("/services"));
              return (
                <Link key={link.path} to={link.path}
                  className="relative text-sm font-medium py-1 transition-colors duration-200"
                  style={{ color: active ? C.primary : C.inkMid }}
                  aria-current={active ? "page" : undefined}>
                  {link.label}
                  {active && <motion.span layoutId="nav-ul" className="absolute -bottom-0.5 inset-x-0 h-0.5 rounded-full" style={{ background: C.primary }} />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to={ROUTES.contact} className="text-sm font-medium transition-colors"
              style={{ color: C.inkMuted }}
              onMouseEnter={e => e.currentTarget.style.color = C.primary}
              onMouseLeave={e => e.currentTarget.style.color = C.inkMuted}>Contact</Link>
            <PrimaryBtn href={ROUTES.contact} small>Book a Discovery Call</PrimaryBtn>
          </div>

          <button className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: C.inkMid, border: `1px solid ${C.border2}`, background: C.surface }}
            onClick={() => setOpen(v => !v)}
            aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(250,250,249,0.98)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
            <nav className="px-6 py-5 flex flex-col gap-1" aria-label="Mobile navigation">
              {[...NAV_LINKS, { label: "Contact", path: ROUTES.contact }].map((link, i) => {
                const active = path === link.path;
                return (
                  <motion.div key={link.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link to={link.path}
                      className="flex items-center justify-between py-3 border-b text-sm font-medium"
                      style={{ color: active ? C.primary : C.inkMid, borderColor: C.border }}
                      aria-current={active ? "page" : undefined}>
                      {link.label} <ChevronRight size={14} aria-hidden="true" />
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-4"><PrimaryBtn href={ROUTES.contact}>Book a Discovery Call</PrimaryBtn></div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════════════════════
function Footer() {
  const serviceLinks = [
    { label: "AI Strategy & Consulting",        path: ROUTES.strategy },
    { label: "AI Workflow Automation",           path: ROUTES.automation },
    { label: "Team Training & Enablement",       path: ROUTES.training },
    { label: "Responsible AI & Governance",      path: ROUTES.governance },
    { label: "Data Privacy & AI Security",       path: ROUTES.privacy },
  ];
  const companyLinks = [
    { label: "Why Saola",  path: ROUTES.whySaola },
    { label: "Use Cases",  path: ROUTES.usecases },
    { label: "About",      path: ROUTES.about },
    { label: "Contact",    path: ROUTES.contact },
  ];
  return (
    <footer style={{ background: C.ink }} role="contentinfo">
      {/* Footer CTA band */}
      <div style={{ background: C.primary }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold text-white mb-1">Explore where AI can create practical value in your business.</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Book a discovery call — no commitment, no jargon.</p>
          </div>
          <PrimaryBtn href={ROUTES.contact} dark>Book a Discovery Call</PrimaryBtn>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Saola AI Labs" className="w-9 h-9 object-contain" />
              <span className="font-bold text-white">Saola AI Labs</span>
            </div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.50)" }}>
              Practical AI adoption for SMBs — with security, governance, and business impact built in.
            </p>
            <p className="text-xs font-semibold mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Strategy · Automation · Enablement · Governance · Privacy
            </p>
            <div className="flex gap-2">
              {[{ Icon: Mail, label: "Email" }, { Icon: Globe, label: "Website" }, { Icon: Phone, label: "Phone" }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.primaryMid; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.40)"; }}>
                  <Icon size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Services</p>
            <ul className="space-y-2.5">
              {serviceLinks.map(l => (
                <li key={l.label}>
                  <Link to={l.path} className="text-sm transition-colors duration-200 block"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.50)"}>{l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Company</p>
            <ul className="space-y-2.5">
              {companyLinks.map(l => (
                <li key={l.label}>
                  <Link to={l.path} className="text-sm transition-colors duration-200 block"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.50)"}>{l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Legal</p>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "AI Usage Policy"].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm transition-colors duration-200 block"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.50)"}>{l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>© 2026 Saola AI Labs · All rights reserved.</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>Practical AI adoption for growing businesses.</p>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED SECTIONS
// ══════════════════════════════════════════════════════════════════════════════

// Final CTA band — used at bottom of every page
function FinalCTA({ title = "Explore where AI can create practical value in your business — with a responsible adoption plan from day one.", sub }) {
  const [ref, inView] = useScrollReveal();
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: C.bgDeep }} aria-labelledby="final-cta-h2">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: "radial-gradient(ellipse 70% 70% at 30% 60%, rgba(26,143,147,0.35) 0%, transparent 70%)" }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center" ref={ref}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <SectionLabel dark>Get started</SectionLabel>
        </motion.div>
        <motion.h2 id="final-cta-h2" custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="text-3xl lg:text-4xl font-bold mb-5 leading-tight" style={{ color: C.textOnDark }}>
          {title}
        </motion.h2>
        {sub && <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="mb-10 text-base" style={{ color: C.textOnDarkMid }}>{sub}</motion.p>}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="flex flex-wrap gap-3 justify-center">
          <PrimaryBtn href={ROUTES.contact} dark>Book a Discovery Call</PrimaryBtn>
          <OutlineBtn href={ROUTES.services} dark>Explore Services</OutlineBtn>
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials
function TestimonialsSection() {
  const [ref, inView] = useScrollReveal();
  const items = [
    { q: "Saola helped us identify three processes where AI could save us 10+ hours a week. We had no idea where to start before working with them.", name: "Priya Mehta", role: "Founder · Retail Operations, Pune" },
    { q: "The training sessions were exactly what our team needed. Now everyone is using AI confidently and consistently in their daily work.", name: "Rohan Kapoor", role: "Head of Operations · Professional Services, Delhi" },
    { q: "What I valued most was the governance framework. We moved fast but we also moved safely — that combination is rare.", name: "Anita Sharma", role: "CEO · Growing B2B Company, Bengaluru" },
  ];
  return (
    <section className="py-20" style={{ background: C.bgAlt }}>
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <SectionHead label="What clients say" title="Practical results for real businesses." center maxW="max-w-lg" />
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="rounded-2xl p-7 border flex flex-col gap-4"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex gap-1" aria-label="5 stars">
                {[...Array(5)].map((_, s) => <Star key={s} size={13} style={{ color: C.amber }} fill={C.amber} aria-hidden="true" />)}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: C.inkMid }}>&#8220;{t.q}&#8221;</p>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.ink }}>{t.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.inkMuted }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME PAGE — 9-section structure per PDF wireframe
// 1 Hero | 2 Brand diff | 3 Services grid | 4 Why Saola |
// 5 Engagement process | 6 Use cases | 7 Trust | 8 Testimonials | 9 Final CTA
// ══════════════════════════════════════════════════════════════════════════════
function HomePage() {
  usePageMeta(ROUTES.home);
  const [servRef, servInView] = useScrollReveal();
  const [whyRef, whyInView]   = useScrollReveal();
  const [procRef, procInView] = useScrollReveal();
  const [ucRef, ucInView]     = useScrollReveal();
  const [trustRef, trustInView] = useScrollReveal();

  const services = [
    { icon: Map,         title: "AI Strategy & Consulting",       desc: "Identify the right AI opportunities for your business and build a practical adoption roadmap.",  href: ROUTES.strategy },
    { icon: Workflow,    title: "AI Workflow Automation",          desc: "Automate repetitive work and improve operational efficiency with AI-enabled systems and workflows.", href: ROUTES.automation },
    { icon: GraduationCap,title: "Team Training & Workforce Enablement", desc: "Help teams use AI confidently and effectively in their daily work.", href: ROUTES.training },
    { icon: ShieldCheck, title: "Responsible AI & Governance",     desc: "Put clear guardrails, policies, and oversight around AI adoption to protect your business.", href: ROUTES.governance },
    { icon: Lock,        title: "Data Privacy & AI Security",      desc: "Protect business data while enabling secure AI implementation across your operations.", href: ROUTES.privacy },
  ];

  const whyItems = [
    { icon: Target,     title: "Practical business focus",        desc: "Every recommendation ties to real operational improvements, not AI hype or abstract transformation." },
    { icon: Users,      title: "SMB-centered approach",           desc: "Built for lean teams and growing businesses — not adapted down from enterprise frameworks." },
    { icon: ShieldCheck,title: "Secure and responsible adoption", desc: "Governance and privacy are embedded into every service, not added as an afterthought." },
    { icon: TrendingUp, title: "End-to-end support",             desc: "From initial strategy and team training through to implementation, optimization, and ongoing governance." },
    { icon: GraduationCap,title: "Human-centered AI adoption",   desc: "We help teams work better with AI — building confidence and capability, not dependency." },
    { icon: Search,     title: "No-hype guidance",                desc: "Straight advice on what AI can realistically do for your business today, not in three years." },
  ];

  const usecaseItems = [
    { function: "Operations", title: "Automate manual reporting",         outcome: "10+ hours saved per week", before: "Manual data gathering across 4 spreadsheets each Friday", after: "Automated weekly report generated and distributed every Friday morning" },
    { function: "Sales",      title: "AI-powered CRM follow-ups",         outcome: "35% more follow-through", before: "Leads going cold due to inconsistent manual outreach", after: "AI drafts personalized follow-up sequences for sales team review" },
    { function: "Support",    title: "Customer query triage",             outcome: "60% faster first response", before: "All support queries routed manually by one person", after: "AI categorizes and routes queries, drafts responses for team approval" },
    { function: "HR",         title: "Onboarding knowledge assistant",    outcome: "Faster new team ramp-up", before: "New hires struggling to find policies and procedures", after: "Internal AI assistant answers onboarding questions from company docs" },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>

      {/* ── SECTION 1: HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden" style={{ background: C.bgAlt }} aria-labelledby="home-h1">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(ellipse 60% 70% at 80% 40%, rgba(13,107,110,0.07) 0%, transparent 70%)" }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-7"
              style={{ background: C.primaryFaint, color: C.primary, border: `1px solid ${C.primaryBorder}` }}>
              Practical AI Adoption for Growing Businesses
            </div>
            {/* Exact headline per PDF */}
            <h1 id="home-h1" className="text-5xl sm:text-6xl font-bold leading-[1.07] tracking-tight mb-6 max-w-3xl"
              style={{ color: C.ink }}>
              Practical AI Solutions for<br />
              <span style={{ color: C.primary }}>Growing Businesses</span>
            </h1>
            {/* Exact subheadline per PDF */}
            <p className="text-xl mb-8 leading-relaxed max-w-2xl" style={{ color: C.inkMuted }}>
              Saola helps SMBs adopt AI securely and responsibly through workflow automation, team training, governance, and hands-on implementation.
            </p>
            {/* Primary: Book a discovery call | Secondary: Explore services — per PDF */}
            <div className="flex flex-wrap gap-3 mb-12">
              <PrimaryBtn href={ROUTES.contact}>Book a Discovery Call</PrimaryBtn>
              <OutlineBtn href={ROUTES.services}>Explore Services</OutlineBtn>
            </div>
            {/* Supporting proof points per PDF */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {["Strategy", "Automation", "Team Enablement", "Governance", "Privacy"].map((p, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: C.inkMuted }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.primary }} aria-hidden="true" />
                  {p}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: BRAND DIFFERENTIATION STATEMENT ─────────────────────── */}
      <section style={{ background: C.surface }} aria-label="Brand differentiation">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl font-medium leading-relaxed" style={{ color: C.inkMid }}>
              Most AI firms focus on tools.{" "}
              <span style={{ color: C.ink, fontWeight: 700 }}>Saola helps businesses adopt AI in ways that improve operations, strengthen team capability, and reduce implementation risk.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FIVE-PILLAR SERVICES GRID ───────────────────────────── */}
      <section className="py-20" style={{ background: C.bg }} aria-labelledby="services-home-h2">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="Services" title="Five ways Saola helps your business adopt AI."
            sub="Each service is designed to deliver real operational value — ordered by how businesses typically engage with AI adoption." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" ref={servRef}>
            {services.map((s, i) => (
              <ServiceCard key={i} icon={s.icon} title={s.title} desc={s.desc} href={s.href} custom={i} inView={servInView} />
            ))}
            {/* Span the 5th card on large screens */}
          </div>
          <div className="mt-10 flex justify-center">
            <OutlineBtn href={ROUTES.services}>View All Services</OutlineBtn>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY SAOLA ────────────────────────────────────────────── */}
      {/* Per PDF: Practical business focus, SMB-centered, secure & responsible, end-to-end, human-centered */}
      <section className="py-20" style={{ background: C.bgAlt }} aria-labelledby="why-home-h2" ref={whyRef}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="Why businesses choose Saola" title="AI adoption built around your business, not your tools." sub="Saola combines practical AI implementation with workforce enablement, governance, and data privacy support. Businesses don't just deploy AI tools — they build the internal capability and trust needed to use them effectively." maxW="max-w-xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyItems.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={whyInView ? "visible" : "hidden"}
                  className="rounded-xl p-6 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: C.primaryFaint }}>
                    <Icon size={16} style={{ color: C.primary }} aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold mb-1.5" style={{ color: C.ink }}>{w.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.inkMuted }}>{w.desc}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center">
            <OutlineBtn href={ROUTES.whySaola}>Full Story — Why Saola</OutlineBtn>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW ENGAGEMENT WORKS ────────────────────────────────── */}
      {/* Per PDF: 3 steps — Assess, Design & Implement, Enable & Govern */}
      <section className="py-20" style={{ background: C.surface }} aria-labelledby="process-h2" ref={procRef}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="How it works" title="A practical process from day one." sub="Simple, low-friction engagement designed for lean teams and growing businesses." maxW="max-w-lg" center />
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[33%] right-[33%] h-px" style={{ background: C.border }} aria-hidden="true" />
            {[
              { step: "01", icon: Search,      title: "Assess opportunities and readiness", desc: "We map your workflows, identify where AI can create real value, and assess what your team is ready to adopt. No generic recommendations." },
              { step: "02", icon: Workflow,     title: "Design and implement practical solutions", desc: "We build, configure, and integrate AI solutions into your actual operations — hands-on, not advisory-only." },
              { step: "03", icon: GraduationCap,title: "Enable teams and establish safe practices", desc: "We train your team, put governance guardrails in place, and ensure AI adoption sticks — responsibly and sustainably." },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={procInView ? "visible" : "hidden"}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border"
                  style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 relative"
                    style={{ background: C.primaryFaint, border: `2px solid ${C.primaryBorder}` }}>
                    <Icon size={22} style={{ color: C.primary }} aria-hidden="true" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: C.amber }}>{step.step}</span>
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: C.ink }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.inkMuted }}>{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: USE CASES / OUTCOMES ────────────────────────────────── */}
      {/* Per PDF: workflow before/after, by function, concrete business outcomes */}
      <section className="py-20" style={{ background: C.bg }} aria-labelledby="outcomes-h2" ref={ucRef}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="Use cases" title="Concrete outcomes for real business workflows."
            sub="Examples of what AI adoption looks like in practice — before and after Saola." />
          <div className="grid md:grid-cols-2 gap-5">
            {usecaseItems.map((uc, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={ucInView ? "visible" : "hidden"}
                className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="px-7 pt-6 pb-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
                  <div>
                    <Pill>{uc.function}</Pill>
                    <h3 className="text-base font-bold mt-2" style={{ color: C.ink }}>{uc.title}</h3>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: C.amberFaint, color: C.amber }}>{uc.outcome}</span>
                </div>
                <div className="grid grid-cols-2 divide-x" style={{ borderColor: C.border }}>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.inkFaint }}>Before</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.inkMuted }}>{uc.before}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.primary }}>After Saola</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.inkMid }}>{uc.after}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <OutlineBtn href={ROUTES.usecases}>See All Use Cases</OutlineBtn>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TRUST SECTION ────────────────────────────────────────── */}
      {/* Per PDF: "AI adoption that balances speed, trust, and business value" */}
      <section className="py-20 relative overflow-hidden" style={{ background: C.bgDeep }} aria-labelledby="trust-h2" ref={trustRef}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(26,143,147,0.20) 0%, transparent 70%)" }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel dark>Responsible adoption</SectionLabel>
              <h2 id="trust-h2" className="text-3xl lg:text-4xl font-bold mb-5 leading-tight" style={{ color: C.textOnDark }}>
                AI adoption that balances speed, trust, and business value.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: C.textOnDarkMid }}>
                Saola helps businesses move quickly with AI while putting the right guardrails, team practices, and data protections in place. Governance and privacy aren't extras — they're built into every engagement from day one.
              </p>
              <PrimaryBtn href={ROUTES.governance} dark>Responsible AI & Governance</PrimaryBtn>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, title: "Governance built in",    desc: "Policies and oversight from day one, not retrofitted after problems arise." },
                { icon: Lock,        title: "Data privacy assured",    desc: "Your data and your customers' data handled with care at every step." },
                { icon: Users,       title: "Team confidence",         desc: "Your team trained to use AI responsibly, consistently, and effectively." },
                { icon: Award,       title: "Trustworthy AI outcomes",  desc: "AI that your business, your team, and your customers can rely on." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={trustInView ? "visible" : "hidden"}
                    className="rounded-xl p-5 border" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <Icon size={18} style={{ color: "rgba(255,255,255,0.70)" }} className="mb-3" aria-hidden="true" />
                    <h3 className="text-sm font-semibold mb-1" style={{ color: C.textOnDark }}>{item.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: C.textOnDarkMuted }}>{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: TESTIMONIALS ─────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── SECTION 9: FINAL CTA ────────────────────────────────────────────── */}
      <FinalCTA />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SERVICES OVERVIEW PAGE
// ══════════════════════════════════════════════════════════════════════════════
function ServicesPage() {
  usePageMeta(ROUTES.services);
  const [ref, inView] = useScrollReveal();

  const services = [
    { icon: Map,          title: "AI Strategy & Consulting",         tag: "Entry point", href: ROUTES.strategy,    color: C.primary, desc: "Identify the right AI opportunities for your business and build a practical roadmap. AI readiness assessments, opportunity mapping, tool selection, and ROI planning." },
    { icon: Workflow,     title: "AI Workflow Automation",           tag: "High demand",  href: ROUTES.automation,  color: C.primaryMid, desc: "Automate repetitive work and help teams operate more efficiently. Process automation, AI-powered workflows, CRM automation, reporting, and knowledge management." },
    { icon: GraduationCap,title: "Team Training & Workforce Enablement",tag: "Adoption layer", href: ROUTES.training, color: C.sage, desc: "Help teams use AI confidently and effectively in daily work. AI fundamentals, secure usage training, department-specific workshops, and leadership education." },
    { icon: ShieldCheck,  title: "Responsible AI & Governance",      tag: "Differentiation", href: ROUTES.governance, color: C.amber, desc: "Put clear guardrails, policies, and oversight around AI adoption. Governance frameworks, usage policies, risk assessments, and compliance-aware AI implementation." },
    { icon: Lock,         title: "Data Privacy & AI Security",       tag: "Trust layer",  href: ROUTES.privacy,    color: C.inkMid, desc: "Protect business data while enabling secure AI implementation. Privacy assessments, data handling guidance, vendor risk reviews, and privacy-aware workflow design." },
  ];

  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Services" title="Five service pillars. One integrated approach."
        sub="Saola's services cover the full arc of AI adoption — from finding the right opportunities to implementing them safely and building team capability that lasts."
        cta1={{ label: "Book a Discovery Call", href: ROUTES.contact }}
        cta2={{ label: "See Use Cases", href: ROUTES.usecases }} />

      <section className="py-20" style={{ background: C.bg }} aria-labelledby="services-detail-h2">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="What we deliver" title="Services designed for growing businesses." sub="Each service pillar addresses a specific phase of practical AI adoption — they work individually and reinforce each other as your program matures." />
          <div className="space-y-5" ref={ref}>
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  className="rounded-2xl border p-8 flex flex-col md:flex-row gap-8 items-start"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: C.primaryFaint }}>
                    <Icon size={24} style={{ color: C.primary }} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold" style={{ color: C.ink }}>{s.title}</h3>
                      <Pill color={C.primary}>{s.tag}</Pill>
                    </div>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: C.inkMuted }}>{s.desc}</p>
                    <Link to={s.href} className="inline-flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: C.primary }}
                      onMouseEnter={e => e.currentTarget.style.color = C.primaryDark}
                      onMouseLeave={e => e.currentTarget.style.color = C.primary}>
                      Learn more about this service <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTA title="Not sure which service fits your situation?" sub="Start with a discovery call — we will map the right entry point for your business." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SERVICE PAGE TEMPLATE — per PDF structure:
// 1. What it solves | 2. Why it matters for SMBs | 3. What Saola delivers
// 4. Example outcomes | 5. Engagement format | 6. CTA
// ══════════════════════════════════════════════════════════════════════════════
function ServiceDetailPage({ meta, eyebrow, title, sub, solves, whyMatters, delivers, outcomes, format }) {
  usePageMeta(meta);
  const [ref, inView] = useScrollReveal();
  const [delRef, delInView] = useScrollReveal();
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow={eyebrow} title={title} sub={sub}
        cta1={{ label: "Book a Discovery Call", href: ROUTES.contact }}
        cta2={{ label: "See All Services", href: ROUTES.services }} />

      {/* What it solves */}
      <section className="py-20" style={{ background: C.surface }} aria-labelledby="solves-h2">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel>What it solves</SectionLabel>
              <h2 id="solves-h2" className="text-2xl font-bold mb-4 leading-tight" style={{ color: C.ink }}>{solves.headline}</h2>
              <p className="text-base leading-relaxed" style={{ color: C.inkMuted }}>{solves.body}</p>
            </div>
            <div className="rounded-2xl p-7 border" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
              <SectionLabel>Why it matters for SMBs</SectionLabel>
              <p className="text-sm leading-relaxed mb-5" style={{ color: C.inkMid }}>{whyMatters}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Saola delivers */}
      <section className="py-20" style={{ background: C.bg }} aria-labelledby="delivers-h2">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="What Saola delivers" title={`Services included in ${eyebrow}`}
            sub="Hands-on delivery, not advisory-only — we work alongside your team through implementation." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" ref={delRef}>
            {delivers.map((d, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={delInView ? "visible" : "hidden"}
                className="rounded-xl p-5 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <CheckCircle2 size={16} style={{ color: C.primary }} className="mb-3" aria-hidden="true" />
                <h3 className="text-sm font-semibold mb-1" style={{ color: C.ink }}>{d.title}</h3>
                {d.desc && <p className="text-xs leading-relaxed" style={{ color: C.inkMuted }}>{d.desc}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example outcomes */}
      <section className="py-20" style={{ background: C.bgAlt }} aria-labelledby="outcomes-h2" ref={ref}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="Example outcomes" title="What businesses achieve." sub="Representative results from this service area." maxW="max-w-lg" />
          <div className="grid md:grid-cols-2 gap-4">
            {outcomes.map((o, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                className="rounded-2xl p-6 border flex gap-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <span className="text-2xl shrink-0">{o.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: C.ink }}>{o.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.inkMuted }}>{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement format */}
      <section className="py-16" style={{ background: C.surface }} aria-labelledby="format-h2">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionLabel>Engagement format</SectionLabel>
          <h2 id="format-h2" className="text-xl font-bold mb-3" style={{ color: C.ink }}>{format.headline}</h2>
          <p className="text-sm leading-relaxed" style={{ color: C.inkMuted }}>{format.body}</p>
        </div>
      </section>

      <FinalCTA title={`Ready to explore ${eyebrow} for your business?`} sub="Book a discovery call — we'll assess your situation and recommend the right starting point." />
    </motion.div>
  );
}

// AI Strategy & Consulting
function AIStrategyPage() {
  return <ServiceDetailPage
    meta={ROUTES.strategy} eyebrow="AI Strategy & Consulting"
    title="Find the right AI opportunities and build a practical roadmap."
    sub="Many SMBs know AI can help — but aren't sure where to start, which tools matter, or how to prioritize investment. Saola cuts through the noise."
    solves={{ headline: "Where can AI actually create value in my business?", body: "Most SMBs approach AI with genuine interest but limited clarity. The risk is either moving too fast with the wrong tools, or waiting too long while competitors move ahead. Saola's strategy work creates confidence by grounding AI decisions in your actual workflows, team, and business goals." }}
    whyMatters="Growing businesses don't have the time or budget for speculative AI experiments. Strategy work that maps real opportunities, prioritizes by impact, and guides tool selection saves money and avoids costly restarts."
    delivers={[
      { title: "AI readiness assessment",    desc: "Evaluate your team, data, and workflows for AI readiness." },
      { title: "AI opportunity mapping",     desc: "Identify specific processes where AI can create measurable value." },
      { title: "Workflow analysis",          desc: "Deep review of current processes to surface automation candidates." },
      { title: "AI roadmap development",     desc: "A sequenced, practical plan for AI adoption over 6–18 months." },
      { title: "Tool selection guidance",    desc: "Vendor-neutral advice on which AI tools fit your situation." },
      { title: "ROI planning",               desc: "Realistic business case framing for AI investment decisions." },
    ]}
    outcomes={[
      { icon: "🗺️", title: "Clear AI roadmap in 2–3 weeks", desc: "A prioritized plan with specific use cases, tools, and sequencing rather than a generic strategy deck." },
      { icon: "💡", title: "2–4 high-impact use cases identified", desc: "Specific workflow automation opportunities with realistic ROI estimates and implementation timelines." },
      { icon: "🛡️", title: "Avoided costly wrong-tool decisions", desc: "Vendor-neutral guidance that saves businesses from locking into tools that don't fit their actual workflows." },
      { icon: "📋", title: "Leadership alignment on AI priorities", desc: "A shared understanding across business leaders on where to invest and in what order." },
    ]}
    format={{ headline: "Flexible advisory and workshop format", body: "Strategy engagements typically run 2–4 weeks and combine structured workshops with async analysis. Deliverables include an AI opportunity map, readiness assessment, tool recommendations, and a practical adoption roadmap. Engagements can continue into implementation or remain advisory." }}
  />;
}

// AI Workflow Automation
function AIAutomationPage() {
  return <ServiceDetailPage
    meta={ROUTES.automation} eyebrow="AI Workflow Automation"
    title="Automate repetitive work and help teams operate more efficiently."
    sub="Businesses lose hours every week to manual, fragmented work that AI-enabled systems can handle — freeing your team to focus on what matters."
    solves={{ headline: "Where is time being lost to manual, repetitive work?", body: "Most SMBs have at least 3–5 recurring workflows that consume significant team time without requiring genuine human judgment. Identifying and automating these creates immediate, measurable return without disrupting operations." }}
    whyMatters="For lean teams, time saved on manual work compounds quickly. Automating one repetitive workflow can free 5–15 hours per week across a team — hours redirected to growth, customer work, and higher-value activity."
    delivers={[
      { title: "Process automation",             desc: "End-to-end automation of recurring operational workflows." },
      { title: "AI-powered workflows",            desc: "Intelligent workflows that handle routing, drafting, and decision support." },
      { title: "Internal productivity systems",  desc: "AI tools embedded into how your team already works." },
      { title: "CRM and sales automation",       desc: "Follow-up sequences, lead routing, and pipeline management." },
      { title: "Customer support workflows",     desc: "Query triage, response drafting, and escalation routing." },
      { title: "Reporting automation",           desc: "Automated data gathering, formatting, and distribution." },
      { title: "Knowledge management workflows", desc: "Internal knowledge retrieval and documentation systems." },
    ]}
    outcomes={[
      { icon: "⏱️", title: "5–15 hours saved per workflow per week", desc: "Recurring manual processes replaced with automated systems that run reliably without team input." },
      { icon: "📊", title: "Consistent, error-reduced outputs", desc: "Automation removes the inconsistency and occasional errors that come from manual repetitive work." },
      { icon: "🔗", title: "Integrated with existing tools",    desc: "Workflows built around your current stack — CRM, email, spreadsheets — not a new platform to manage." },
      { icon: "📈", title: "Team capacity redirected to growth", desc: "Hours freed from manual work redirected to customer-facing, strategic, and revenue-generating activity." },
    ]}
    format={{ headline: "Hands-on implementation with knowledge transfer", body: "Automation engagements involve scoping, building, testing, and embedding workflows into your operations. Each engagement ends with your team understanding how to maintain, adapt, and extend the automation — not dependent on Saola for every change." }}
  />;
}

// AI Training & Workforce Enablement
function AITrainingPage() {
  return <ServiceDetailPage
    meta={ROUTES.training} eyebrow="Team Training & Workforce Enablement"
    title="Help teams confidently adopt AI in everyday work."
    sub="AI adoption fails when teams are unsure how to use tools effectively, securely, or consistently. Saola's training builds real capability — not just awareness."
    solves={{ headline: "Why does AI adoption stall after tool deployment?", body: "Many businesses buy or deploy AI tools and see limited adoption because teams haven't been trained on practical use, secure usage habits, or consistent application to their specific workflows. Training that connects AI to real daily work changes this." }}
    whyMatters="For SMBs, low adoption of AI tools means low return on investment. Training that is specific to how each team works — not generic AI awareness content — creates the consistent usage that generates real business value."
    delivers={[
      { title: "AI fundamentals training",      desc: "Practical grounding in what AI tools can and cannot do." },
      { title: "Secure AI usage training",      desc: "How to use AI tools without exposing sensitive business or customer data." },
      { title: "Team workshops",                desc: "Hands-on sessions focused on your team's actual workflows." },
      { title: "Department-specific training",  desc: "Tailored programs for sales, operations, support, HR, and other functions." },
      { title: "Prompting best practices",      desc: "Practical prompting skills that improve AI output quality." },
      { title: "AI productivity enablement",    desc: "Embedding AI tools into daily team habits and workflows." },
      { title: "Leadership AI education",       desc: "Executive sessions on AI strategy, risk, and team enablement." },
    ]}
    outcomes={[
      { icon: "🙋", title: "Teams using AI daily within 2–4 weeks", desc: "Practical, workflow-specific training creates adoption that actually sticks across the team." },
      { icon: "🔒", title: "Consistent, secure AI usage habits",    desc: "Teams understand what to share and what not to share — protecting business and customer data." },
      { icon: "⚡", title: "Measurable productivity improvement",   desc: "Teams using AI confidently complete specific task types faster and at higher quality." },
      { icon: "📚", title: "Internal AI capability that compounds", desc: "Trained teams continue improving and sharing practices — building organizational AI capability over time." },
    ]}
    format={{ headline: "Workshop series with ongoing support", body: "Training engagements combine structured workshop sessions with role-specific practice exercises. Programs are typically delivered over 2–6 weeks depending on team size and depth. Post-training support includes a resource library, usage guidelines, and an optional check-in session 4–6 weeks after completion." }}
  />;
}

// Responsible AI & Governance
function AIGovernancePage() {
  return <ServiceDetailPage
    meta={ROUTES.governance} eyebrow="Responsible AI & Governance"
    title="Adopt AI responsibly with clear policies, governance, and oversight."
    sub="As your business adopts AI, you need practical guardrails — not just good intentions. Saola builds the internal clarity and oversight that makes AI adoption trustworthy."
    solves={{ headline: "How do we use AI without creating problems we can't see?", body: "Without internal AI policies, teams make inconsistent decisions about what AI to use, what data to share, and how to handle AI outputs. This creates reputational risk, data handling issues, and uneven results. Governance makes adoption sustainable." }}
    whyMatters="SMBs often assume governance is for enterprises. In practice, getting governance right early is far easier and cheaper than fixing problems after they surface. A practical governance framework protects your business, your team, and your customers."
    delivers={[
      { title: "AI governance framework",       desc: "A practical structure for how AI is used, reviewed, and managed in your business." },
      { title: "AI usage policies",             desc: "Clear, plain-language policies for how teams should and should not use AI tools." },
      { title: "Responsible AI guidelines",     desc: "Principles and practices for fair, consistent, and trustworthy AI use." },
      { title: "Internal AI standards",         desc: "Standards for output review, human oversight, and quality control." },
      { title: "Human oversight processes",     desc: "Defined checkpoints where humans review and approve AI outputs." },
      { title: "AI risk assessment",            desc: "Identification and mitigation planning for your specific AI adoption risks." },
      { title: "Compliance-aware AI adoption",  desc: "Implementation practices that account for relevant regulatory considerations." },
      { title: "Vendor and tool evaluation",    desc: "Assessment of AI vendors' data handling, security, and policy terms." },
    ]}
    outcomes={[
      { icon: "📋", title: "Clear internal AI policies deployed",  desc: "Your team knows what AI tools are approved, how to use them, and what guardrails apply." },
      { icon: "👁️", title: "Human oversight embedded",            desc: "Review processes in place so AI outputs are checked before they reach customers or decision-makers." },
      { icon: "🛡️", title: "Reduced risk from AI misuse",         desc: "Documented policies reduce the risk of data exposure, inconsistent outputs, or reputational issues." },
      { icon: "🤝", title: "Customer trust maintained",            desc: "Customers and partners can see that AI is being used responsibly and with appropriate controls." },
    ]}
    format={{ headline: "Governance sprint followed by policy documentation", body: "Governance engagements typically run 3–5 weeks and deliver a practical governance framework, usage policies, oversight processes, and a risk register. Saola can also provide ongoing governance advisory as your AI adoption expands into new areas." }}
  />;
}

// Data Privacy & AI Security
function AIPrivacyPage() {
  return <ServiceDetailPage
    meta={ROUTES.privacy} eyebrow="Data Privacy & AI Security"
    title="Ensure AI is implemented with strong data privacy and security practices."
    sub="AI tools can create real data exposure risks if implemented carelessly. Saola helps businesses move forward with AI confidently — without compromising data security or privacy."
    solves={{ headline: "Are we exposing sensitive data by using AI tools?", body: "Many businesses adopt AI tools without fully understanding what data those tools process, retain, or share. This creates real risk — both compliance risk and reputational risk — that is preventable with the right implementation practices." }}
    whyMatters="For SMBs handling customer data, employee information, or commercially sensitive content, data privacy is not optional. Implementing AI without a privacy lens creates risks that are expensive to remediate and damaging to trust."
    delivers={[
      { title: "AI data privacy assessments",    desc: "Review of how your AI tools handle, process, and store data." },
      { title: "Data handling guidance",         desc: "Practical rules for what data can be used with which AI tools." },
      { title: "Secure AI implementation",       desc: "Implementation practices that protect sensitive data throughout AI workflows." },
      { title: "Internal AI usage controls",     desc: "Technical and process controls that govern how AI tools access company data." },
      { title: "Vendor risk reviews",            desc: "Assessment of AI vendor data practices, terms, and security posture." },
      { title: "Data governance support",        desc: "Policies and processes for responsible data management in AI contexts." },
      { title: "Privacy-aware workflow design",  desc: "Workflow design that incorporates privacy protections from the start." },
    ]}
    outcomes={[
      { icon: "🔍", title: "Full visibility into data exposure",  desc: "A clear picture of what data your AI tools access, process, and retain — and what risks that creates." },
      { icon: "📁", title: "Data handling rules your team follows", desc: "Plain-language data guidance that teams understand and apply in their daily AI usage." },
      { icon: "✅", title: "Vendor risk assessed and documented",  desc: "Informed decisions about which AI vendors are appropriate for sensitive workloads." },
      { icon: "🔐", title: "Privacy-confident AI adoption",       desc: "Moving forward with AI without the nagging concern that you're creating unseen data risks." },
    ]}
    format={{ headline: "Assessment-led engagement with practical deliverables", body: "Privacy and security engagements begin with an assessment of your current AI tool landscape and data handling practices. Deliverables include a data exposure risk review, vendor assessment, usage guidelines, and a remediation roadmap. Engagements can be scoped as standalone assessments or integrated into broader AI adoption programs." }}
  />;
}

// ══════════════════════════════════════════════════════════════════════════════
// WHY SAOLA PAGE
// ══════════════════════════════════════════════════════════════════════════════
function WhySaolaPage() {
  usePageMeta(ROUTES.whySaola);
  const [ref, inView] = useScrollReveal();
  const diff = [
    { title: "Practical business focus over AI hype", desc: "Every recommendation Saola makes is tied to your actual operations, your team's capacity, and your business goals. We do not sell AI for AI's sake." },
    { title: "SMB-centered — not enterprise methods adapted down", desc: "Saola's approach is built from the ground up for lean teams and growing businesses. No bloated frameworks, no enterprise overhead, no tool-first thinking." },
    { title: "Governance and privacy built into every engagement", desc: "Whether you are working on automation, training, or strategy, responsible adoption practices are embedded — not offered as an upsell." },
    { title: "End-to-end support — strategy through optimization", desc: "From the initial AI readiness assessment through to team training, implementation, and ongoing governance, Saola provides continuity across the full adoption journey." },
    { title: "Human-centered AI adoption", desc: "AI adoption fails when teams fear or resist the tools. Saola helps businesses build team confidence and capability — so AI actually gets used and improves how people work." },
    { title: "No-hype, vendor-neutral guidance", desc: "Saola has no reseller relationships or platform commissions. Recommendations are based on what is right for your business, not what generates a referral fee." },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Why Saola" title="Why businesses choose Saola for practical AI adoption."
        sub="Most AI consulting firms focus on implementation alone. Saola combines practical AI adoption with workforce enablement, governance, and data privacy — delivered in a way that works for growing businesses."
        cta1={{ label: "Book a Discovery Call", href: ROUTES.contact }}
        cta2={{ label: "See Our Services", href: ROUTES.services }} />

      {/* Differentiation per PDF copy */}
      <section className="py-20" style={{ background: C.surface }} aria-labelledby="diff-h2">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="What makes Saola different" title="AI adoption built around your business, not your tools."
            sub="Saola combines practical AI implementation with workforce enablement, governance, and data privacy support. That means businesses do not just deploy AI tools — they build the internal capability and trust needed to use them effectively." />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {diff.map((d, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                className="rounded-xl p-6 border flex gap-4" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
                <CheckCircle2 size={18} style={{ color: C.primary, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold mb-1.5" style={{ color: C.ink }}>{d.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.inkMuted }}>{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Saola is not — per PDF */}
      <section className="py-20" style={{ background: C.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="What Saola is not" title="Clear about our positioning." sub="Being specific about what we are helps businesses understand exactly what they are engaging." maxW="max-w-lg" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { not: "An AI tool reseller",            is: "Vendor-neutral advisory — we recommend what is right for your business." },
              { not: "A pure automation agency",       is: "Full-arc support including strategy, training, governance, and privacy." },
              { not: "A cybersecurity vendor",         is: "A practical AI adoption partner with data privacy built into delivery." },
              { not: "A compliance consultancy",       is: "Governance that is practical, plain-language, and operationally focused." },
              { not: "An abstract innovation brand",   is: "Grounded in real operational improvement for real SMB teams." },
              { not: "An enterprise firm scaled down", is: "Built from the ground up for lean, growing businesses." },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-xl p-5 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-xs font-semibold line-through mb-2" style={{ color: C.inkFaint }}>{item.not}</p>
                <p className="text-sm leading-relaxed" style={{ color: C.inkMid }}>{item.is}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTA title="Discover how Saola can support your AI adoption journey." sub="Book a discovery call — a practical conversation about where AI can help your business." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USE CASES PAGE
// ══════════════════════════════════════════════════════════════════════════════
function UseCasesPage() {
  usePageMeta(ROUTES.usecases);
  const [ref, inView] = useScrollReveal();
  const cases = [
    { fn: "Operations", icon: "⚙️", title: "Automated weekly operations reporting", before: "One team member spends 3+ hours each Friday pulling data from multiple spreadsheets and formatting a report manually.", after: "An automated workflow gathers data, formats the report, and distributes it by 8am Friday — every week, without manual input.", outcome: "12 hours saved per month", service: ROUTES.automation },
    { fn: "Sales",      icon: "📈", title: "AI-assisted CRM follow-up sequences",  before: "Sales team manually writing follow-up emails for each lead, often delayed or forgotten under workload pressure.", after: "AI drafts personalized follow-up emails based on CRM data. Sales team reviews and sends with one click — consistently and on time.", outcome: "35% more follow-through", service: ROUTES.automation },
    { fn: "Support",    icon: "🎧", title: "Customer query triage and response drafting", before: "All inbound support queries reviewed manually, categorized by hand, and responded to from scratch each time.", after: "AI categorizes queries, drafts initial responses, and routes to the right team member. Human reviews and sends.", outcome: "60% faster first response", service: ROUTES.training },
    { fn: "HR",         icon: "🧑‍💼", title: "Onboarding knowledge assistant",         before: "New team members repeatedly asking the same questions about policies, procedures, and internal processes.", after: "An internal AI assistant answers onboarding questions directly from company documentation — always accurate, always available.", outcome: "Faster ramp-up, fewer interruptions", service: ROUTES.automation },
    { fn: "Finance",    icon: "💰", title: "Invoice and expense processing automation", before: "Finance team manually reviewing, categorizing, and entering invoice data each week — time-consuming and error-prone.", after: "AI extracts data from invoices, suggests categorization, and flags anomalies for human review before entry.", outcome: "8 hours saved per week", service: ROUTES.automation },
    { fn: "Governance", icon: "📋", title: "AI usage policy deployment for a 40-person team", before: "Team adopting AI tools ad hoc, sharing client data with consumer AI tools without realizing the risk.", after: "Clear AI usage policy implemented, team trained on secure AI habits, and approved tools list communicated and enforced.", outcome: "Risk eliminated, team confident", service: ROUTES.governance },
  ];
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="Use Cases" title="What AI adoption looks like in practice."
        sub="Real-world examples of how SMBs use Saola's services to improve operations, build team capability, and adopt AI responsibly."
        cta1={{ label: "Book a Discovery Call", href: ROUTES.contact }}
        cta2={{ label: "See Services", href: ROUTES.services }} />
      <section className="py-20" style={{ background: C.bg }} aria-labelledby="uc-h2">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead label="Business outcomes" title="Before and after — by business function." sub="Organized by where in the business the value is created, not by which AI technology is involved." />
          <div className="grid md:grid-cols-2 gap-5" ref={ref}>
            {cases.map((c, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="px-7 pt-6 pb-4 border-b flex items-start justify-between gap-4" style={{ borderColor: C.border }}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{c.icon}</span>
                      <Pill>{c.fn}</Pill>
                    </div>
                    <h3 className="text-base font-bold" style={{ color: C.ink }}>{c.title}</h3>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                    style={{ background: C.amberFaint, color: C.amber }}>{c.outcome}</span>
                </div>
                <div className="grid grid-cols-2 divide-x" style={{ borderColor: C.border }}>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.inkFaint }}>Before</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.inkMuted }}>{c.before}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.primary }}>After Saola</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.inkMid }}>{c.after}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA title="See how AI can improve operations in your business." sub="Book a discovery call — we will map the right opportunities for your specific situation." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ══════════════════════════════════════════════════════════════════════════════
function AboutPage() {
  usePageMeta(ROUTES.about);
  return (
    <motion.div {...PAGE_TRANSITION}>
      <PageHero eyebrow="About Saola AI Labs" title="An AI adoption partner built for growing businesses."
        sub="Saola was built to fill a gap — practical, responsible AI adoption support for SMBs who want to move forward with AI but need guidance, not just tools."
        cta1={{ label: "Book a Discovery Call", href: ROUTES.contact }}
        cta2={{ label: "Why Saola", href: ROUTES.whySaola }} />

      <section className="py-20" style={{ background: C.surface }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel>Our mission</SectionLabel>
              <h2 className="text-3xl font-bold mb-5 leading-tight" style={{ color: C.ink }}>
                Help SMBs adopt AI in practical, secure, and responsible ways that improve efficiency, streamline operations, and support business growth.
              </h2>
              <p className="leading-relaxed mb-5" style={{ color: C.inkMuted }}>
                Most AI guidance is written for large enterprises or for technical audiences. Growing businesses — the ones with lean teams, tight budgets, and real operational challenges — often have to figure it out alone.
              </p>
              <p className="leading-relaxed" style={{ color: C.inkMuted }}>
                Saola exists to change that. We combine practical AI implementation with workforce enablement, governance, and data privacy support — delivered in a way that works for teams that can't afford to get it wrong.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Positioning",   text: "Practical AI adoption partner for SMBs — not a tool reseller, automation agency, or compliance firm." },
                { label: "Brand promise", text: "Saola helps growing businesses modernize with AI in ways that are useful, low-friction, and trustworthy." },
                { label: "Approach",      text: "Governance and privacy built into every engagement — not sold separately. Business value first, technical detail second." },
                { label: "Audience",      text: "SMB owners, founders, operators, and functional leaders who want AI adoption with practical guidance and responsible implementation." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-5 border" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
                  <Pill>{item.label}</Pill>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: C.inkMid }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection />
      <FinalCTA title="Learn whether Saola is the right fit for your AI adoption goals." sub="A 30-minute discovery call is the best way to find out." />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CONTACT / DISCOVERY CALL PAGE — per PDF field spec + consultative CTA tone
// ══════════════════════════════════════════════════════════════════════════════
function FieldErr({ error }) {
  if (!error) return null;
  return <p role="alert" style={{ color: "#DC2626", fontSize: "0.7rem", marginTop: "0.3rem" }}>{error}</p>;
}

function ContactPage() {
  usePageMeta(ROUTES.contact);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", size: "", interest: "", message: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Your name is required";
    if (!form.email.trim())   e.email   = "Work email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.company.trim()) e.company = "Company name is required";
    return e;
  };
  const handleSubmit = (e) => { e.preventDefault(); const errs = validate(); if (Object.keys(errs).length > 0) { setErrors(errs); return; } setSubmitted(true); };
  const handleChange = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => ({ ...p, [f]: undefined })); };

  const iStyle = (field) => ({ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "0.5rem", background: C.bgAlt, color: C.ink, fontSize: "0.875rem", outline: "none", fontFamily: "inherit", border: `1px solid ${errors[field] ? "#DC2626" : C.border2}` });
  const lStyle = { display: "block", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.35rem", color: C.inkMid };

  return (
    <motion.div {...PAGE_TRANSITION}>
      <section className="relative pt-28 pb-20 overflow-hidden" style={{ background: C.bgAlt }} aria-labelledby="contact-h1">
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-7"
                style={{ background: C.primaryFaint, color: C.primary, border: `1px solid ${C.primaryBorder}` }}>
                Discovery Call
              </div>
              <h1 id="contact-h1" className="text-4xl font-bold leading-tight mb-5" style={{ color: C.ink }}>
                Discuss your AI opportunities.
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: C.inkMuted }}>
                A practical, no-pressure conversation about where AI can create value in your business — and how Saola can support responsible adoption from day one.
              </p>
              <div className="space-y-5 mb-10">
                {[
                  { title: "AI opportunity mapping",    desc: "We identify 2–3 specific areas where AI can improve your operations." },
                  { title: "Honest fit assessment",     desc: "We will tell you if Saola is the right partner for your situation — or point you in the right direction if not." },
                  { title: "No commitment required",    desc: "A discovery call is a conversation, not a sales pitch. You leave with clarity either way." },
                  { title: "30 minutes, practical focus", desc: "Focused on your business specifically — not a generic AI presentation." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} style={{ color: C.primary, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.ink }}>{item.title}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: C.inkMuted }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-5 border" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.inkFaint }}>What to expect</p>
                <p className="text-sm leading-relaxed" style={{ color: C.inkMid }}>We respond within one business day to confirm your session. Discovery calls are 30 minutes, conducted by a senior Saola team member, and focused entirely on your business situation.</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-2xl border p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ background: C.primaryFaint, border: `1.5px solid ${C.primaryBorder}` }}>
                    <CheckCircle2 size={28} style={{ color: C.primary }} aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: C.ink }}>Request received.</h2>
                  <p className="text-sm mb-5" style={{ color: C.inkMuted }}>We will reach out within one business day to confirm your discovery call.</p>
                  <Pill>Expect a reply within 24 hours</Pill>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold mb-6" style={{ color: C.ink }}>Book your discovery call</h2>
                  <form onSubmit={handleSubmit} noValidate aria-label="Discovery call booking form">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="c-name" style={lStyle}>Your name <span aria-hidden="true" style={{ color: "#DC2626" }}>*</span></label>
                        <input id="c-name" type="text" placeholder="Jane Smith" value={form.name} onChange={e => handleChange("name", e.target.value)} style={iStyle("name")} aria-required="true" />
                        <FieldErr error={errors.name} />
                      </div>
                      <div>
                        <label htmlFor="c-email" style={lStyle}>Work email <span aria-hidden="true" style={{ color: "#DC2626" }}>*</span></label>
                        <input id="c-email" type="email" placeholder="jane@company.com" value={form.email} onChange={e => handleChange("email", e.target.value)} style={iStyle("email")} aria-required="true" />
                        <FieldErr error={errors.email} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="c-company" style={lStyle}>Company <span aria-hidden="true" style={{ color: "#DC2626" }}>*</span></label>
                      <input id="c-company" type="text" placeholder="Your business name" value={form.company} onChange={e => handleChange("company", e.target.value)} style={iStyle("company")} aria-required="true" />
                      <FieldErr error={errors.company} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="c-role" style={lStyle}>Your role</label>
                        <input id="c-role" type="text" placeholder="Founder, Head of Ops..." value={form.role} onChange={e => handleChange("role", e.target.value)} style={iStyle("role")} />
                      </div>
                      <div>
                        <label htmlFor="c-size" style={lStyle}>Team size</label>
                        <select id="c-size" value={form.size} onChange={e => handleChange("size", e.target.value)} style={{ ...iStyle("size"), appearance: "none" }}>
                          <option value="">Select team size</option>
                          <option value="1-10">1–10 people</option>
                          <option value="11-30">11–30 people</option>
                          <option value="31-100">31–100 people</option>
                          <option value="100+">100+ people</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="c-interest" style={lStyle}>Primary area of interest</label>
                      <select id="c-interest" value={form.interest} onChange={e => handleChange("interest", e.target.value)} style={{ ...iStyle("interest"), appearance: "none" }}>
                        <option value="">What are you most interested in exploring?</option>
                        <option value="strategy">AI strategy and opportunity mapping</option>
                        <option value="automation">Workflow automation</option>
                        <option value="training">Team training and enablement</option>
                        <option value="governance">Responsible AI and governance</option>
                        <option value="privacy">Data privacy and AI security</option>
                        <option value="unsure">Not sure yet — need guidance</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="c-message" style={lStyle}>Anything else useful to know (optional)</label>
                      <textarea id="c-message" rows={3} placeholder="Describe your current AI situation, specific challenges, or what you are hoping to achieve..." value={form.message} onChange={e => handleChange("message", e.target.value)} style={{ ...iStyle("message"), resize: "vertical" }} />
                    </div>
                    <PrimaryBtn type="submit">Book My Discovery Call</PrimaryBtn>
                    <p className="text-xs mt-4" style={{ color: C.inkFaint }}>We will reply within one business day. No commitment required.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
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
        <p className="text-6xl font-bold mb-4" style={{ color: C.primary }}>404</p>
        <h1 className="text-3xl font-bold mb-4" style={{ color: C.ink }}>Page not found</h1>
        <p className="mb-8" style={{ color: C.inkMuted }}>This page does not exist.</p>
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
  [ROUTES.services]:   ServicesPage,
  [ROUTES.strategy]:   AIStrategyPage,
  [ROUTES.automation]: AIAutomationPage,
  [ROUTES.training]:   AITrainingPage,
  [ROUTES.governance]: AIGovernancePage,
  [ROUTES.privacy]:    AIPrivacyPage,
  [ROUTES.whySaola]:   WhySaolaPage,
  [ROUTES.usecases]:   UseCasesPage,
  [ROUTES.about]:      AboutPage,
  [ROUTES.contact]:    ContactPage,
};

function Layout() {
  const { path } = useRouter();
  const Page = PAGES[path] || NotFound;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}>
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        body { background: #FAFAF9; color: #111827; }
        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }
        input:focus, select:focus, textarea:focus { outline: 2px solid #0D6B6E; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F4F7F7; }
        ::-webkit-scrollbar-thumb { background: #94A3B8; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #0D6B6E; }
      `}</style>
      <Router>
        <Layout />
      </Router>
    </>
  );
}