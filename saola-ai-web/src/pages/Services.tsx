import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Briefcase, GraduationCap,
  ShieldCheck, FileText, Users, Lightbulb, Code2, Crown
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})
const stagger = (i: number) => fadeUp(i * 0.1)

const consulting = [
  {
    icon: FileText, bg: 'bg-teal-100', iconColor: 'text-teal-700',
    title: 'Governance Design', tag: 'Advisory',
    desc: 'We design your AI governance framework end-to-end — roles, processes, escalation paths, and board reporting — aligned to NIST AI RMF and ISO 42001.',
    deliverables: ['AI governance charter', 'RACI matrix for AI roles', 'Board AI risk report template', 'Quarterly governance calendar'],
    border: 'border-teal-200 hover:border-teal-400',
  },
  {
    icon: ShieldCheck, bg: 'bg-indigo-100', iconColor: 'text-indigo-700',
    title: 'Compliance Readiness', tag: 'Audit Prep',
    desc: 'Gap assessment against DPDPA, GDPR, and ISO 42001. We produce a prioritised remediation roadmap and work with your teams to close every gap.',
    deliverables: ['As-is gap assessment', 'Controls prioritisation matrix', 'Remediation sprint plan', 'Pre-audit evidence pack'],
    border: 'border-indigo-200 hover:border-indigo-400',
  },
  {
    icon: Briefcase, bg: 'bg-violet-100', iconColor: 'text-violet-700',
    title: 'Policy Playbook Design', tag: 'Policy',
    desc: 'Customised AI policy suites covering acceptable use, data handling, risk tiering, model procurement, and vendor management for your industry vertical.',
    deliverables: ['Acceptable use policy', 'Data-handling standard for AI', 'Vendor / third-party AI policy', 'Incident response runbook'],
    border: 'border-violet-200 hover:border-violet-400',
  },
]

const training = [
  {
    icon: Crown, bg: 'bg-amber-100', iconColor: 'text-amber-700',
    title: 'Executive Workshop', audience: 'C-Suite · Board', duration: 'Half day',
    desc: 'Strategic briefing on AI risk landscape, regulatory obligations, and governance responsibilities. Delivered as a facilitated workshop with scenarios tailored to your sector.',
    topics: ['AI risk landscape for boards', 'Regulatory obligations (DPDPA, GDPR)', 'Governance responsibilities', 'AI investment decision framework'],
    border: 'border-amber-200',
  },
  {
    icon: Code2, bg: 'bg-teal-100', iconColor: 'text-teal-700',
    title: 'Developer Security Training', audience: 'Engineers · Architects', duration: 'Full day',
    desc: 'Hands-on technical training covering secure LLM integration patterns, prompt injection defences, data minimisation, and OWASP LLM Top 10 mitigations.',
    topics: ['OWASP LLM Top 10', 'Secure API design for AI', 'Prompt injection defences', 'PII handling in ML pipelines'],
    border: 'border-teal-200',
  },
  {
    icon: Users, bg: 'bg-indigo-100', iconColor: 'text-indigo-700',
    title: 'Team Awareness Programme', audience: 'All employees', duration: 'Modular (online)',
    desc: 'Role-based e-learning modules that build AI literacy across your organisation — from frontline users to data processors. Available in English and Hindi.',
    topics: ['Responsible AI use at work', 'Data privacy basics', 'Spotting AI-generated risks', 'Reporting obligations'],
    border: 'border-indigo-200',
  },
  {
    icon: Lightbulb, bg: 'bg-violet-100', iconColor: 'text-violet-700',
    title: 'Ethical AI Design Sprint', audience: 'Product · Design · Engineering', duration: '2 days',
    desc: 'Facilitated design sprint to embed fairness, transparency, and human oversight into new AI product features. Outputs a responsible AI product backlog.',
    topics: ['Bias and fairness assessment', 'Explainability design', 'Human-in-the-loop patterns', 'Ethical AI product backlog'],
    border: 'border-violet-200',
  },
]

const packages = [
  {
    name: 'Starter', price: '₹1.5L', period: 'one time', color: 'border-slate-200',
    tag: '', tagColor: '',
    items: ['DPDPA gap assessment', 'AI use-case registry setup', '1 policy playbook', '2-hr executive briefing', 'Platform access (3 months)'],
  },
  {
    name: 'Growth', price: '₹4.5L', period: 'per year', color: 'border-teal-400',
    tag: 'Most popular', tagColor: 'bg-teal-600 text-white',
    items: ['Full compliance workspace (all frameworks)', 'PromptGuard deployment', 'Model access control', 'Policy suite (5 policies)', 'Team training (up to 50 users)', 'Quarterly review calls'],
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', color: 'border-indigo-300',
    tag: '', tagColor: '',
    items: ['Unlimited AI use cases', 'Custom integrations', 'Dedicated advisory retainer', 'VCISO support', 'On-site training sessions', 'SLA-backed support'],
  },
]

export default function Services() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-hero-gradient pt-28 pb-24 overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-300 -top-40 -right-32" />
        <div className="orb w-[400px] h-[400px] bg-indigo-400 bottom-0 -left-32" />
        <div className="container-pad relative z-10 text-center">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 mb-6">
              <Briefcase className="w-3.5 h-3.5" /> Advisory and Training
            </span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="font-display font-bold text-5xl md:text-6xl text-white mb-5 leading-tight">
            Expert guidance from<br /><span className="text-teal-200">policy to culture</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-teal-100 text-xl max-w-2xl mx-auto mb-10">
            Consulting engagements and training programmes that embed responsible AI across your governance, technology, and people layers.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-4">
            <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              Discuss Your Needs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/platform" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
              See the Platform
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Consulting */}
      <section className="section-pad bg-slate-50">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200 mb-4">
              <Briefcase className="w-3.5 h-3.5" /> Consulting
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Advisory services</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Structured engagements that produce real artefacts — not slide decks.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {consulting.map((c, i) => (
              <motion.div key={i} {...stagger(i)} className={`bg-white rounded-2xl p-7 border ${c.border} shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <c.icon className={`w-6 h-6 ${c.iconColor}`} />
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${c.bg} ${c.iconColor} inline-block mb-3`}>{c.tag}</span>
                <h3 className="font-display font-bold text-xl text-slate-800 mb-3">{c.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{c.desc}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Deliverables</p>
                <ul className="space-y-2">
                  {c.deliverables.map(d => (
                    <li key={d} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />{d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 mb-4">
              <GraduationCap className="w-3.5 h-3.5" /> Training
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Training programmes</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Role-based learning that builds lasting AI safety and governance skills across every layer of your organisation.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {training.map((t, i) => (
              <motion.div key={i} {...stagger(i)} className={`bg-slate-50 rounded-2xl p-7 border ${t.border} hover:shadow-md transition-all duration-300 group`}>
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${t.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <t.icon className={`w-6 h-6 ${t.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-800">{t.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-slate-500">{t.audience}</span>
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">{t.duration}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{t.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {t.topics.map(topic => (
                    <div key={topic} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />{topic}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-pad bg-teal-50">
        <div className="container-pad">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 mb-4">Pricing</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Simple, transparent packages</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">No hidden fees or per-seat surcharges. Scale as your AI portfolio grows.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((p, i) => (
              <motion.div key={i} {...stagger(i)} className={`relative bg-white rounded-2xl p-7 border-2 ${p.color} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col`}>
                {p.tag && <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-4 py-1 rounded-full ${p.tagColor}`}>{p.tag}</span>}
                <p className="font-display font-bold text-2xl text-slate-800 mb-1">{p.name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display font-black text-4xl text-teal-700">{p.price}</span>
                  {p.period && <span className="text-slate-400 text-sm">/ {p.period}</span>}
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {p.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
                <Link to="/book-demo" className="block text-center bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-full transition-colors duration-200">
                  Get Started <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-hero-gradient relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="container-pad text-center relative z-10">
          <motion.div {...fadeUp()}>
            <GraduationCap className="w-16 h-16 text-teal-200 mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-5">Not sure which service fits your needs?</h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-10">Talk to an advisor. We will map your current AI programme and recommend the right starting point.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book-demo" className="inline-flex items-center gap-2 bg-white text-teal-800 font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Book Free Consultation <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/15 transition-all duration-200">
                Contact the Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
