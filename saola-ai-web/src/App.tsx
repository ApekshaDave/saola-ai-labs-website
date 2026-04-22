import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Platform from './pages/Platform'
import AISecurityTools from './pages/AISecurityTools'
import Services from './pages/Services'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-white mb-3">{title}</h1>
        <p className="text-gray-400">Coming soon</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/ai-security-tools" element={<AISecurityTools />} />
        <Route path="/services" element={<Services />} />
        <Route path="/resources" element={<Placeholder title="Resources" />} />
        <Route path="/pricing" element={<Placeholder title="Pricing" />} />
        <Route path="/about" element={<Placeholder title="About" />} />
        <Route path="/contact" element={<Placeholder title="Contact" />} />
        <Route path="/book-demo" element={<Placeholder title="Book a Demo" />} />
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
