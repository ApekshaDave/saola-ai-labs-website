import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ShieldCheck, BrainCircuit, GraduationCap,
  TrendingUp, Search, Settings2, Rocket, BarChart3,
  CheckCircle2, AlertTriangle, Zap, Globe, Lock, Users
} from 'lucide-react'

/* animation helpers */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})
const stagger = (i: number) => fadeUp(i * 0.1)

const stats = [
  { value: '94%', label: 'Compliance Score Avg' },
  { value: '< 30d', label: 'Time to Readiness' },
  { value: '3x', label: 'Faster than manual audit' },
  { value: '100+', label: 'AI controls mapped' },
]

const problems = [
  { icon: AlertTriangle, title: 'Shadow GenAI usage', desc: 'Teams use external models without security review, risking data leaks.' },
  { icon: Lock, title: 'No AI governance policy', desc: 'Policy gaps mean inconsistent controls and unclear accountability.' },
  { icon: Globe, title: 'PII flows into prompts', desc: 'Personal data enters AI engines unintentionally, risking DPDPA violations.' },
  { icon: BarChart3, title: 'Compliance visibility gap', desc: 'No single dashboard for obligations across AI use cases and frameworks.' },
  { icon: Users, title: 'Budget and team limits', desc: 'SMBs need institutional-grade controls without large security teams.' },
]

const pillars = [
  { icon: ShieldCheck, bg: 'bg-teal-100', iconColor: 'text-teal-700', tag: 'Platform', tagColor: 'bg-teal-100 text-teal-700', title: 'Privacy and Compliance', desc: 'GDPR, DPDPA, ISO 42001 readiness in one workspace. Automated gap analysis and audit-ready evidence tracking.', href: '/platform', features: ['GDPR / DPDPA readiness score', 'ISO 42001 control mapping', 'Exportable audit evidence'], border: 'hover:border-teal-400' },
  { icon: BrainCircuit, bg: 'bg-violet-100', iconColor: 'text-violet-700', tag: 'AI Security', tagColor: 'bg-violet-100 text-violet-700', title: 'AI Security Tools', desc: 'Policy-driven prompt and data controls. Classify and protect sensitive inputs flowing into LLMs.', href: '/ai-security-tools', features: ['PII masking and redaction', 'Model access control', 'AI risk dashboard'], border: 'hover:border-violet-400' },
  { icon: GraduationCap, bg: 'bg-amber-100', iconColor: 'text-amber-700', tag: 'Services', tagColor: 'bg-amber-100 text-amber-700', title: 'Advisory and Training', desc: 'NIST AI RMF governance design, policy playbooks, and role-based training for leadership and engineers.', href: '/services', features: ['NIST AI RMF framework', 'Ethical AI playbooks', 'Executive and dev training'], border: 'hover:border-amber-400' },
]

const steps = [
  { icon: Search, number: '01', title: 'Discover', desc: 'Inventory all AI use cases, data flows, and hidden risks via guided questionnaires.' },
  { icon: Settings2, number: '02', title: 'Design', desc: 'Auto-suggest controls, policies, and technical safeguards tailored to your stack.' },
  { icon: Rocket, number: '03', title: 'Deploy', desc: 'Activate compliance workflows, secure LLM access, and roll out team training.' },
  { icon: BarChart3, number: '04', title: 'Demonstrate', desc: 'Maintain evidence, live dashboards, and audit reports for management and regulators.' },
]

const testimonials = [
  { quote: 'Saola AI Labs made AI compliance simple and visible across all our product teams. The dashboard is a game changer.', author: 'Priya S.', role: 'CTO, SaaS company', location: 'Bengaluru', initials: 'PS' },
  { quote: 'We went from zero governance to DPDPA-ready in 28 days. The risk dashboard removed all our cross-border data anxiety.', author: 'Rahul M.', role: 'CISO, Fintech startup', location: 'Delhi', initials: 'RM' },
  { quote: 'The platform and training combination gave our leadership real confidence during the audit. Highly recommended.', author: 'Ananya K.', role: 'Head of Security Ops', location: 'Hyderabad', initials: 'AK' },
]

const useCases = [
  { name: 'Sales Proposal AI', status: 'In Review', color: 'text-red-600 bg-red-50 border border-red-200' },
  { name: 'Support Chatbot', status: 'Deployed', color: 'text-amber-600 bg-amber-50 border border-amber-200' },
  { name: 'HR Screening Tool', status: 'Blocked', color: 'text-red-600 bg-red-50 border border-red-200' },
  { name: 'Code Co-pilot', status: 'Approved', color: 'text-green-700 bg-green-50 border border-green-200' },
]

function HeroDashboard() {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="relative">
      <div className="absolute -inset-3 bg-white/20 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/60">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-xs font-medium">DPDPA · GDPR · ISO 42001</p>
            <p className="text-white font-display font-bold text-lg">Compliance Overview</p>
          </div>
          <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30">LIVE</span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-5 p-4 bg-teal-50 rounded-xl mb-4 border border-teal-100">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <motion.circle cx="32" cy="32" r="28" fill="none" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 28}`} initial={{ strokeDashoffset: 2 * Math.PI * 28 }} animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - 0.88) }} transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-teal-800 font-display font-bold text-sm">88%</span>
            </div>
            <div>
              <p className="text-slate-800 font-semibold">Overall Score</p>
              <p className="text-xs text-slate-500">12 pts from last month</p>
              <div className="flex gap-1.5 mt-1.5">
                {['GDPR', 'DPDPA', 'ISO'].map(tag => (<span key={tag} className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{tag}</span>))}
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Use Cases</p>
          <div className="space-y-1.5">
            {useCases.map(uc => (
              <div key={uc.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-sm text-slate-700 font-medium">{uc.name}</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${uc.color}`}>{uc.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-semibold">4 AI policy updates suggested</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-hero-gradient pt-20">
        <div className="orb w-[600px] h-[600px] bg-teal-300 -top-40 -right-40" />
        <div className="orb w-[500px] h-[500px] bg-indigo-400 bottom-0 -left-48" />
        <div className="container-pad w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div {...fadeUp(0)}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 mb-6">
                  <ShieldCheck className="w-3.5 h-3.5" /> AI Governance · Privacy · Security
                </span>
              </motion.div>
              <motion.h1 {...fadeUp(0.1)} className="font-display font-bold text-5xl md:text-6xl leading-[1.05] text-white text-balance mb-6">
                Bridge AI innovation with <span className="text-teal-200">Kavach-level</span> protection
              </motion.h1>
              <motion.p {...fadeUp(0.2)} className="text-teal-50 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                Saola AI Labs helps SMBs design, secure, and govern AI with GDPR, DPDPA, and ISO 42001 readiness built in.
              </motion.p>
              <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 mb-10">
                <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/platform" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
                  Explore Platform
                </Link>
              </motion.div>
              <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-4">
                {['SOC 2 ready', 'NIST AI RMF aligned', 'India + Global', 'Fast onboarding'].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-xs font-medium text-teal-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" />{item}
                  </span>
                ))}
              </motion.div>
            </div>
            <HeroDashboard />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="container-pad">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} {...stagger(i)} className="text-center">
                <p className="font-display font-bold text-4xl gradient-text">{s.value}</p>
                <p className="text-slate-500 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="section-pad bg-slate-50">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-200 mb-4">Common challenges</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Why SMBs struggle with AI today</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Without structured governance, AI projects become risk exposures and compliance gaps overnight.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((p, i) => (
              <motion.div key={i} {...stagger(i)} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-300 hover:shadow-md transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <p.icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-display font-semibold text-slate-800 text-lg mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200 mb-4">Our solution</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">What Saola AI Labs does</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Three integrated pillars for complete AI security, compliance, and governance.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div key={i} {...stagger(i)}>
                <Link to={p.href} className={`group block bg-white rounded-2xl p-7 h-full border border-slate-200 shadow-sm ${p.border} hover:shadow-lg transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-2xl ${p.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                  </div>
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3 ${p.tagColor}`}>{p.tag}</span>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-3">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-2">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-1.5 text-teal-700 text-sm font-semibold group-hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-pad bg-teal-50">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 mb-4">How it works</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">From chaos to governed AI</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">4 steps to align people, process, and technology in under 30 days.</p>
          </motion.div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div key={i} {...stagger(i)} className="text-center">
                  <div className="relative inline-flex mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-white border-2 border-teal-200 shadow-md flex items-center justify-center mx-auto">
                      <step.icon className="w-8 h-8 text-teal-600" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-display font-black flex items-center justify-center">{i + 1}</span>
                  </div>
                  <p className="text-xs font-bold text-teal-600 tracking-widest uppercase mb-2">{step.number}</p>
                  <h3 className="font-display font-bold text-slate-800 text-xl mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 mb-4">Social proof</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Trusted by growing SMBs</h2>
            <p className="text-slate-500 text-lg">India and international clients in SaaS, fintech, healthcare, and manufacturing.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...stagger(i)} className="bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:shadow-md transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (<TrendingUp key={j} className="w-4 h-4 text-amber-400" />))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">{t.initials}</div>
                  <div>
                    <p className="text-slate-800 font-semibold text-sm">{t.author}</p>
                    <p className="text-slate-400 text-xs">{t.role} · {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-pad bg-hero-gradient relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="container-pad text-center relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="font-display font-bold text-4xl md:text-6xl mb-5 text-white leading-tight">
              Ready to turn AI risk into a<br /><span className="text-teal-200">competitive advantage?</span>
            </h2>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-10">Join hundreds of SMBs who leverage Saola AI Labs to govern AI with confidence.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
                Talk to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
