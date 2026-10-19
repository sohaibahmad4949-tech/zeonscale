import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, FileText, Briefcase, FolderKanban, Quote, BarChart3, ExternalLink, LogOut, Menu, X, Bell } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from './AuthContext'
import useCounts from './useCounts'

const items = [
  ['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/messages', 'Messages', MessageSquare, false, 'messages'],
  ['/admin/quotes', 'Quote requests', FileText, false, 'quotes'], ['/admin/services', 'Services', Briefcase], ['/admin/projects', 'Projects', FolderKanban],
  ['/admin/testimonials', 'Testimonials', Quote, false, 'testimonials'],
  ['/admin/seo', 'SEO & Analytics', BarChart3],
]
const Count = ({ n }) => n > 0 ? <span className="ml-auto grid min-w-[1.35rem] place-items-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-5 text-white" aria-label={`${n} waiting`}>{n > 99 ? '99+' : n}</span> : null

export default function Layout() {
  const { session, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const [counts, refresh] = useCounts()
  const [bell, setBell] = useState(false)
  const total = counts.messages + counts.quotes + counts.testimonials
  useEffect(() => { setOpen(false); setBell(false); refresh() }, [pathname])
  useEffect(() => { document.title = `${total ? `(${total}) ` : ''}Admin | Zeon Scale Agency` }, [total])

  const Bellbtn = (
    <div className="relative">
      <button onClick={() => setBell((b) => !b)} aria-label={`Notifications${total ? `, ${total} waiting` : ''}`} aria-expanded={bell} className="glass relative grid h-10 w-10 place-items-center rounded-full">
        <Bell size={18} />{total > 0 && <span className="absolute -right-1 -top-1 grid min-w-[1.25rem] place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-5 text-white">{total > 99 ? '99+' : total}</span>}
      </button>
      {bell && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-line bg-bg p-2 shadow-2xl" role="menu">
          {total === 0 ? <p className="p-4 text-center text-sm text-muted">You're all caught up.</p> : [
            ['/admin/messages', 'new message', counts.messages], ['/admin/quotes', 'new quote request', counts.quotes], ['/admin/testimonials', 'review waiting for approval', counts.testimonials],
          ].filter((r) => r[2] > 0).map(([to, label, n]) => (
            <Link key={to} to={to} role="menuitem" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-brand/5"><span className="grid h-7 min-w-[1.75rem] place-items-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">{n}</span>{label}{n === 1 ? '' : 's'}</Link>))}
        </div>)}
    </div>)

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {items.map(([to, label, I, end, key]) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-brand/10 text-brand' : 'text-muted hover:bg-brand/5 hover:text-ink'}`}>
          <I size={18} />{label}{key && <Count n={counts[key]} />}
        </NavLink>
      ))}
      <div className="mt-auto space-y-1 border-t border-line pt-4">
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted hover:text-brand"><ExternalLink size={18} />View website</Link>
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted hover:text-red-500"><LogOut size={18} />Sign out</button>
        <p className="truncate px-3.5 pt-2 text-xs text-muted">{session?.user?.email}</p>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-r border-line p-5 lg:flex"><div className="flex items-center justify-between"><Logo />{Bellbtn}</div>{nav}</aside>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-5 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">{Bellbtn}
        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open} className="glass grid h-10 w-10 place-items-center rounded-full">{open ? <X size={18} /> : <Menu size={18} />}</button></div>
      </header>
      {open && <div className="fixed inset-x-0 bottom-0 top-16 z-20 flex flex-col overflow-y-auto bg-bg p-5 lg:hidden">{nav}</div>}
      <main className="min-w-0 p-5 sm:p-8"><Outlet /></main>
    </div>
  )
}
