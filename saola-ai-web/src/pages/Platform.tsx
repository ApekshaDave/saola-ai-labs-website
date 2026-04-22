import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, LayoutDashboard, List,
  GitBranch, FolderOpen, Plug2, FileBarChart, ShieldCheck, Zap
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})
const stagger = (i: number) => fadeUp(i * 0.1)

const modules = [
  {
    icon: LayoutDashboard, bg: 'bg-teal-100', iconColor: 'text-teal-700',
    title: 'Compliance Workspace', tag: 'DPDPA · GDPR · ISO 42001',
    desc: 'Centralised readiness score, gap analysis, and control mapping across all active frameworks in a single configurable workspace.',
    features: ['Live readiness score (0–100)', 'Framework gap heatmap', 'Owner assignment per control', 'Progress changelog'],
    border: 'border-teal-200 hover:border-teal-400',
  },
  {
    icon: List, bg: 'bg-indigo-100', iconColor: 'text-indigo-700',
    title: 'AI Use-Case Registry', tag: 'Governance',
    desc: 'Inventory every AI system in your organisation. Rate risks, assign business owners, and track stage gates from discovery to production.',
    features: ['Guided intake questionnaire', 'Risk tier classification', 'Stage-gate approvals', 'Evidence attachments'],
    border: 'border-indigo-200 hover:border-indigo-400',
  },
  {
    icon: GitBranch, bg: 'bg-violet-100', iconColor: 'text-violet-700',
    title: 'Policy Automation', tag: 'Controls',
    desc: 'Auto-generate policy drafts from your AI use-case profile. Version, approve, and distribute governance documents from one hub.',
    features: ['AI-suggested policy templates', 'Version control and approvals', 'Employee acknowledgement tracking', 'Customisable policy workflows'],
    border: 'border-violet-200 hover:border-violet-400',
  },
  {
    icon: FolderOpen, bg: 'bg-amber-100', iconColor: 'text-amber-700',
    title: 'Evidence Locker', tag: 'Audit-ready',
    desc: 'Continuously capture control evidence—screenshots, logs, attestations—so every audit starts with a full, timestamped artefact library.',
    features: ['Auto-tagged evidence collection', 'Chain-of-custody timestamps', 'Auditor sharing with time-limited access', 'ISO 42001 Annex A mapping'],
    border: 'border-amber-200 hover:border-amber-400',
  },
]

const integrations = [
  { name: 'Slack', cat: 'Collaboration' }, { name: 'Jira', cat: 'Project tracking' },
  { name: 'GitHub', cat: 'Code repos' }, { name: 'OpenAI API', cat: 'LLM gateway' },
  { name: 'MS Teams', cat: 'Collaboration' }, { name: 'AWS IAM', cat: 'Cloud access' },
  { name: 'Google Workspace', cat: 'Productivity' }, { name: 'Azure AD', cat: 'Identity' },
]

const complianceRows = [
  { framework: 'DPDPA 2023', items: ['Data classification', 'Consent management', 'DSR workflows', 'DPA template'], color: 'text-teal-700 bg-teal-50' },
  { framework: 'GDPR', items: ['ROPA automation', 'DPIA builder', 'Supervisory notices', 'Transfer mechanisms'], color: 'text-indigo-700 bg-indigo-50' },
  { framework: 'ISO 42001', items: ['AI policy framework', 'Risk assessment', 'Annex A controls', 'Certification prep'], color: 'text-violet-700 bg-violet-50' },
  { framework: 'NIST AI RMF', items: ['Govern function', 'Map function', 'Measure function', 'Manage function'], color: 'text-amber-700 bg-amber-50' },
]

export default function Platform() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-hero-gradient pt-28 pb-24 overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-300 -top-40 -right-32" />
        <div className="orb w-[400px] h-[400px] bg-indigo-400 bottom-0 -left-32" />
        <div className="container-pad relative z-10 text-center">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 mb-6">
              <LayoutDashboard className="w-3.5 h-3.5" /> Platform Overview
            </span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="font-display font-bold text-5xl md:text-6xl text-white mb-5 leading-tight">
            Your AI compliance<br /><span className="text-teal-200">command centre</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-teal-100 text-xl max-w-2xl mx-auto mb-10">
            One workspace for AI policies, evidence, risk registries, and compliance reporting across DPDPA, GDPR, and ISO 42001.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-4">
            <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
              View Services
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* 4 Modules */}
      <section className="section-pad bg-slate-50">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200 mb-4">Core modules</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Everything in one place</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Four tightly integrated modules that eliminate spreadsheets and manual evidence chasing.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((m, i) => (
              <motion.div key={i} {...stagger(i)} className={`bg-white rounded-2xl p-7 border ${m.border} shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${m.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <m.icon className={`w-6 h-6 ${m.iconColor}`} />
                  </div>
                  <div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.bg} ${m.iconColor} mb-1 inline-block`}>{m.tag}</span>
                    <h3 className="font-display font-bold text-xl text-slate-800">{m.title}</h3>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{m.desc}</p>
                <ul className="space-y-2">
                  {m.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Coverage */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 mb-4">Framework coverage</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">All major AI compliance frameworks</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Switch between frameworks without switching tools.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {complianceRows.map((row, i) => (
              <motion.div key={i} {...stagger(i)} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-all duration-300">
                <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full mb-5 ${row.color}`}>{row.framework}</span>
                <div className="grid grid-cols-2 gap-2">
                  {row.items.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="section-pad bg-teal-50">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200 mb-4">
              <Plug2 className="w-3.5 h-3.5" /> Integrations
            </span>
            <h2 className="font-display font-bold text-4xl text-slate-900 mb-4">Works with your existing stack</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">Connect the tools your teams already use.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {integrations.map((int, i) => (
              <motion.div key={i} {...stagger(i)} className="bg-white rounded-2xl p-5 text-center border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group">
                <p className="font-display font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{int.name}</p>
                <p className="text-xs text-slate-400 mt-1">{int.cat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()}>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200 mb-6">
                <FileBarChart className="w-3.5 h-3.5" /> Reporting
              </span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-5 leading-tight">
                Board-ready reports, always on demand
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Export auditor-friendly PDFs or share live dashboards with management. Saola AI Labs keeps every control up to date without manual data collection.
              </p>
              <ul className="space-y-4 mb-8">
                {['One-click PDF exports', 'Live board-level dashboards', 'Evidence package export', 'Custom regulatory report templates'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-slate-700">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-violet-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/book-demo" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                See Reporting Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
              <div className="bg-gradient-to-r from-teal-600 to-indigo-600 rounded-xl p-5 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-display font-bold text-lg">Compliance Dashboard</p>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">Q4 2025</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: 'DPDPA', pct: 92 }, { label: 'GDPR', pct: 88 }, { label: 'ISO 42001', pct: 76 }].map(f => (
                    <div key={f.label} className="bg-white/10 border border-white/20 rounded-xl p-3 text-center">
                      <p className="text-white text-2xl font-display font-black">{f.pct}%</p>
                      <p className="text-teal-100 text-xs">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {[{ label: 'Total Controls', val: '124', desc: '12 open actions' }, { label: 'Evidence Items', val: '847', desc: 'Auto-collected this month' }, { label: 'Audit Readiness', val: '91%', desc: '+7% from last quarter' }].map(r => (
                <div key={r.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-slate-800 font-semibold text-sm">{r.label}</p>
                    <p className="text-slate-400 text-xs">{r.desc}</p>
                  </div>
                  <p className="font-display font-black text-2xl text-teal-600">{r.val}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-hero-gradient relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="container-pad text-center relative z-10">
          <motion.div {...fadeUp()}>
            <ShieldCheck className="w-16 h-16 text-teal-200 mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-5">Ready to see the platform?</h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-10">Get a personalised demo tailored to your industry and compliance obligations.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Book a Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
