import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Mail } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Compliance Workspace', path: '/platform' },
    { label: 'AI Use Case Register', path: '/platform' },
    { label: 'Data & Consent Flows', path: '/platform' },
    { label: 'Policy & Evidence Hub', path: '/platform' },
  ],
  'AI Security': [
    { label: 'Prompt & Data Guard', path: '/ai-security-tools' },
    { label: 'Model Access Control', path: '/ai-security-tools' },
    { label: 'AI Risk Dashboard', path: '/ai-security-tools' },
  ],
  Services: [
    { label: 'Consulting', path: '/services' },
    { label: 'Training', path: '/services' },
    { label: 'AI Governance', path: '/services' },
  ],
  Company: [
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Blog', path: '/resources' },
    { label: 'Contact', path: '/contact' },
  ],
}

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-pad py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="Saola AI Labs" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              AI Security, Privacy & Compliance for growing SMBs. Built for India and beyond.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-500/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-display font-semibold text-white text-sm mb-4">{group}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 Saola AI Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'DPA / DPDPA Notice', 'Cookie Policy'].map(item => (
              <Link key={item} to="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
