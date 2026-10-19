import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import GetQuote from './pages/GetQuote'
import { trackPageview } from './lib/analytics'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('zeon-theme', dark ? 'dark' : 'light') } catch (e) { /* ignore */ }
  }, [dark])

  const { pathname } = useLocation()
  useEffect(() => { trackPageview(pathname) }, [pathname])
  if (pathname.startsWith('/admin')) return <Suspense fallback={null}><AdminApp /></Suspense>

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <ScrollToTop />
      <Navbar dark={dark} toggle={() => setDark((d) => !d)} />
      <main id="main" className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-quote" element={<GetQuote />} />
          <Route path="*" element={
            <section className="section wrap text-center">
              <h1 className="text-4xl font-bold">Page not found</h1>
              <p className="mt-3 text-muted">That address does not exist.</p>
              <Link to="/" className="btn-primary mt-8">Back to home</Link>
            </section>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
