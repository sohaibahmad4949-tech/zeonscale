import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X, Sun, Moon, ChevronDown, ArrowRight, FileText, Home, Info, Briefcase, FolderKanban, Mail, MessageCircle, Phone } from 'lucide-react'
import Logo from './Logo'
import { site } from '../data/site'
import { useServices } from '../lib/content'

const links = [
  ['/', 'Home', Home], ['/about', 'About', Info], ['/services', 'Services', Briefcase],
  ['/portfolio', 'Our Work', FolderKanban], ['/contact', 'Contact', Mail],
]

function DesktopLink({ to, label, icon: I, children }) {
  return (
    <NavLink to={to} end={to === '/'} className={({ isActive }) => `relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-ink ${isActive ? 'text-brand' : 'text-muted'}`}>
      {({ isActive }) => (
        <>
          {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-brand/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <I size={16} />{label}{children}
        </>
      )}
    </NavLink>
  )
}

export default function Navbar({ dark, toggle }) {
  const services = useServices()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-20 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${scrolled || open ? 'border-line bg-bg/85 shadow-lg shadow-brand/5' : 'border-transparent bg-bg/40'}`}>
      <nav className="wrap flex h-full items-center justify-between" aria-label="Main">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([to, label, Icon]) =>
            to === '/services' ? (
              <div key={to} className="group relative">
                <DesktopLink to={to} label={label} icon={Icon}><ChevronDown size={14} className="transition group-hover:rotate-180 group-focus-within:rotate-180" /></DesktopLink>
                <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="glass rounded-2xl bg-bg/95 p-2 shadow-2xl shadow-brand/10">
                    {services.map((s) => { const I = s.icon; return (
                      <li key={s.slug}>
                        <Link to={`/services#${s.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-brand/10 hover:text-brand">
                          <I size={17} />{s.title}
                        </Link>
                      </li>) })}
                  </ul>
                </div>
              </div>
            ) : <DesktopLink key={to} to={to} label={label} icon={Icon} />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="glass relative grid h-10 w-10 place-items-center overflow-hidden rounded-full transition hover:border-brand">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={dark ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <Link to="/get-quote" className="btn-primary group hidden !py-2.5 sm:inline-flex"><FileText size={16} />Get a Quote<ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></Link>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} className="glass grid h-10 w-10 place-items-center rounded-full lg:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-[-1px] h-0.5 origin-left" aria-hidden="true">
        <div className="h-full w-full" style={{ background: 'linear-gradient(90deg, var(--brand2), #4aa3ff)' }} />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto bg-bg/95 backdrop-blur-xl lg:hidden">
            <div className="wrap flex flex-col gap-2 py-6">
              {links.map(([to, label, I], i) => (
                <motion.div key={to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <NavLink to={to} end={to === '/'} className={({ isActive }) => `flex items-center gap-4 rounded-2xl px-4 py-4 text-lg font-semibold transition ${isActive ? 'bg-brand/10 text-brand' : 'text-ink hover:bg-brand/5'}`}>
                    <I size={20} />{label}
                  </NavLink>
                </motion.div>
              ))}
              <Link to="/get-quote" className="btn-primary mt-4 !py-4 text-base"><FileText size={18} />Get a Quote<ArrowRight size={16} /></Link>
              {(site.email || site.whatsapp || site.phone) && (
                <div className="mt-4 flex flex-col gap-3 border-t border-line pt-5 text-sm text-muted">
                  {site.phone && <a href={site.phoneHref} className="flex items-center gap-3 hover:text-brand"><Phone size={17} />{site.phone}</a>}
                  {site.email && <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-brand"><Mail size={17} />{site.email}</a>}
                  {site.whatsapp && <a href={site.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-brand"><MessageCircle size={17} />Chat on WhatsApp</a>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
