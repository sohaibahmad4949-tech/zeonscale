import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, FileText, Briefcase, FolderKanban, Quote, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Badge, ErrorBox, PageHead, Spinner, fmt } from './ui'

const count = (table, status) => {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (status) q = q.eq('status', status)
  return q
}

export default function Dashboard() {
  const [d, setD] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      count('contact_messages', 'new'), count('contact_messages'), count('quote_requests', 'new'), count('quote_requests'),
      count('projects'), count('testimonials'),
      supabase.from('contact_messages').select('id,name,email,status,created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('quote_requests').select('id,name,email,services,status,created_at').order('created_at', { ascending: false }).limit(5),
      count('services'), count('testimonials', 'pending'),
    ]).then((r) => {
      const err = r.find((x) => x.error)?.error
      if (err) return setError(err.message)
      setD({ nm: r[0].count, tm: r[1].count, nq: r[2].count, tq: r[3].count, pr: r[4].count, te: r[5].count, msgs: r[6].data, quotes: r[7].data, sv: r[8].count, pt: r[9].count })
    })
  }, [])

  if (error) return <ErrorBox msg={error} />
  if (!d) return <Spinner />

  const stats = [
    ['New messages', d.nm, `${d.tm} total`, MessageSquare, '/admin/messages'],
    ['New quote requests', d.nq, `${d.tq} total`, FileText, '/admin/quotes'],
    ['Services', d.sv, 'on the website', Briefcase, '/admin/services'],
    ['Projects', d.pr, 'in portfolio', FolderKanban, '/admin/projects'],
    ['Testimonials', d.pt, `${d.te} total · waiting for approval`, Quote, '/admin/testimonials'],
  ]
  const Recent = ({ title, rows, to, sub }) => (
    <section className="glass rounded-3xl p-5">
      <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">{title}</h2><Link to={to} className="flex items-center gap-1 text-sm font-semibold text-brand">View all<ArrowRight size={14} /></Link></div>
      {rows.length === 0 ? <p className="py-6 text-center text-sm text-muted">Nothing yet.</p> : (
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.id}><Link to={to} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0"><span className="block truncate text-sm font-semibold">{r.name}</span><span className="block truncate text-xs text-muted">{sub(r)} · {fmt(r.created_at)}</span></span>
              <Badge s={r.status} />
            </Link></li>))}
        </ul>)}
    </section>
  )

  return (
    <>
      <PageHead title="Dashboard" text="What needs your attention." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, n, sub, I, to]) => (
          <Link key={label} to={to} className="glass rounded-3xl p-5 transition hover:-translate-y-0.5 hover:border-brand">
            <div className="flex items-center justify-between text-sm text-muted">{label}<I size={18} className="text-brand" /></div>
            <p className="mt-3 font-display text-4xl font-extrabold">{n ?? 0}</p><p className="text-xs text-muted">{sub}</p>
          </Link>))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Recent title="Latest messages" rows={d.msgs} to="/admin/messages" sub={(r) => r.email} />
        <Recent title="Latest quote requests" rows={d.quotes} to="/admin/quotes" sub={(r) => (r.services || []).join(', ')} />
      </div>
    </>
  )
}
