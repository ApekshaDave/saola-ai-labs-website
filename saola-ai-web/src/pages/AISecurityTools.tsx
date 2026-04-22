import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, ShieldAlert,
  KeyRound, BarChart3, Eye, Lock, Cpu, Zap, BrainCircuit
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})
const stagger = (i: number) => fadeUp(i * 0.1)

const tools = [
  {
    icon: ShieldAlert, bg: 'bg-teal-100', iconColor: 'text-teal-700',
    tag: 'Prompt Security', tagColor: 'bg-teal-100 text-teal-700',
    title: 'PromptGuard', sub: 'Real-time prompt inspection and PII masking',
    desc: 'Intercept and sanitise API calls before they reach your LLM. Auto-redact 40+ entity types including Aadhaar UIDs, PAN, emails, account numbers, and medical data.',
    features: ['40+ PII entity detection', 'Real-time redaction / masking', 'Audit log per API call', 'Custom regex rule engine', 'Multi-model support'],
    border: 'border-teal-200 hover:border-teal-400',
  },
  {
    icon: KeyRound, bg: 'bg-violet-100', iconColor: 'text-violet-700',
    tag: 'Access Control', tagColor: 'bg-violet-100 text-violet-700',
    title: 'Model Access Control', sub: 'Role-based LLM access and data tier enforcement',
    desc: 'Define granular policies that control which roles can access which AI models, knowledge bases, and data tiers. Enforce separation between dev, staging, and production.',
    features: ['RBAC for AI models', 'Data tier enforcement', 'Approval workflows', 'SSO / IdP integration', 'Access audit trails'],
    border: 'border-violet-200 hover:border-violet-400',
  },
  {
    icon: BarChart3, bg: 'bg-amber-100', iconColor: 'text-amber-700',
    tag: 'Risk Visibility', tagColor: 'bg-amber-100 text-amber-700',
    title: 'AI Risk Dashboard', sub: 'Live risk scoring across all AI use cases',
    desc: 'Visualise residual risk levels across all deployed and planned AI systems. Surface policy violations, anomalous usage patterns, and overdue control actions in real time.',
    features: ['Live risk heat-maps', 'Anomaly detection alerts', 'Trend analysis over time', 'Violation notifications', 'Executive summary export'],
    border: 'border-amber-200 hover:border-amber-400',
  },
]

const capabilities = [
  { icon: Eye, title: 'Context-aware inspection', desc: 'Detects sensitive data patterns across 15+ languages and mixed-script Indian text.' },
  { icon: Lock, title: 'Zero-trust model layer', desc: 'Every AI request is authenticated, logged, and compared against your active policies.' },
  { icon: Cpu, title: 'Edge-compatible agents', desc: 'Lightweight agents deploy on-premises or as cloud sidecars with <5ms overhead.' },
  { icon: Zap, title: 'Real-time enforcement', desc: 'Block, mask, warn, or route requests — configurable per policy rule priority.' },
]

export default function AISecurityTools() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-hero-gradient pt-28 pb-24 overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-300 -top-40 -right-32" />
        <div className="orb w-[400px] h-[400px] bg-indigo-400 bottom-0 -left-32" />
        <div className="container-pad relative z-10 text-center">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 mb-6">
              <BrainCircuit className="w-3.5 h-3.5" /> AI Security Tools
            </span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="font-display font-bold text-5xl md:text-6xl text-white mb-5 leading-tight">
            Secure every prompt,<br /><span className="text-teal-200">every model, every call</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-teal-100 text-xl max-w-2xl mx-auto mb-10">
            Purpose-built tools to inspect, filter, and control AI data flows — keeping PII, credentials, and sensitive business data out of LLMs.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-4">
            <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/platform" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
              See Full Platform
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Tool Clusters */}
      <section className="section-pad bg-slate-50">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200 mb-4">Tool clusters</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Three layers of AI protection</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">PromptGuard, Model Access Control, and the AI Risk Dashboard work together to cover every surface area of risk.</p>
          </motion.div>
          <div className="space-y-6">
            {tools.map((t, i) => (
              <motion.div key={i} {...stagger(i)} className={`bg-white rounded-2xl p-7 border ${t.border} shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <div className="grid md:grid-cols-3 gap-8 items-start">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${t.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <t.icon className={`w-6 h-6 ${t.iconColor}`} />
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-1 ${t.tagColor}`}>{t.tag}</span>
                        <h3 className="font-display font-bold text-xl text-slate-800">{t.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium italic">{t.sub}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-slate-500 text-sm leading-relaxed mb-5">{t.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {t.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200 mb-4">Under the hood</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Built for real-world AI environments</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Enterprise-grade security architecture designed for SMB budgets and timelines.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilities.map((c, i) => (
              <motion.div key={i} {...stagger(i)} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <c.icon className="w-6 h-6 text-teal-700" />
                </div>
                <h3 className="font-display font-semibold text-slate-800 text-lg mb-2">{c.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PII types strip */}
      <section className="py-14 bg-teal-50 border-y border-teal-100">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-8">
            <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">PII entity types detected and masked</h3>
            <p className="text-slate-500 text-sm">Including India-specific identifiers and mixed-script detection</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Aadhaar UID', 'PAN Number', 'Phone', 'Email', 'Passport', 'Bank IFSC', 'Credit Card', 'IP Address', 'Date of Birth', 'Medical Record ID', 'GST Number', 'Vehicle Number', 'Driving License', 'Voter ID', 'Address'].map((tag, i) => (
              <motion.span key={tag} {...stagger(i)} className="px-3 py-1.5 bg-white border border-teal-200 text-teal-700 text-xs font-semibold rounded-full shadow-sm">{tag}</motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-hero-gradient relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="container-pad text-center relative z-10">
          <motion.div {...fadeUp()}>
            <ShieldAlert className="w-16 h-16 text-teal-200 mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-5">Stop PII leaking into your AI systems</h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-10">Book a 30-minute technical walkthrough and see PromptGuard in action on your own data pipeline.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Book Technical Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
                Talk to Security Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
