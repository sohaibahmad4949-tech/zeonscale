import { useEffect, useMemo, useState } from 'react'
import { Download, Mail, Trash2, X, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Badge, ErrorBox, PageHead, Spinner, fmt } from './ui'

const CONFIG = {
  messages: { table: 'contact_messages', title: 'Messages', text: 'Messages from the contact form.', statuses: ['new', 'read', 'archived'], autoRead: true },
  quotes: { table: 'quote_requests', title: 'Quote requests', text: 'Requests from the Get a Quote form.', statuses: ['new', 'contacted', 'won', 'lost'] },
}

const csv = (rows, table) => {
  const cols = table === 'quote_requests' ? ['created_at', 'name', 'email', 'phone', 'services', 'budget', 'message', 'status', 'notes'] : ['created_at', 'name', 'email', 'message', 'status', 'notes']
  const esc = (v) => `"${String(Array.isArray(v) ? v.join('; ') : v ?? '').replace(/"/g, '""')}"`
  const text = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }))
  a.download = `${table}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function Submissions({ kind }) {
  const cfg = CONFIG[kind]
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [sel, setSel] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setLoading(true); setSel(null); setFilter('all')
    supabase.from(cfg.table).select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) setError(error.message); else setRows(data)
      setLoading(false)
    })
  }, [cfg.table])

  const shown = useMemo(() => rows.filter((r) =>
    (filter === 'all' || r.status === filter) &&
    `${r.name} ${r.email} ${r.message} ${(r.services || []).join(' ')}`.toLowerCase().includes(q.toLowerCase())), [rows, q, filter])
  const current = rows.find((r) => r.id === sel)

  const patch = async (id, values) => {
    setError('')
    const { error } = await supabase.from(cfg.table).update(values).eq('id', id)
    if (error) return setError(error.message)
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...values } : r)))
    window.dispatchEvent(new Event('zeon-counts'))
  }
  const open = (r) => { setSel(r.id); setNotes(r.notes || ''); if (cfg.autoRead && r.status === 'new') patch(r.id, { status: 'read' }) }
  const remove = async (r) => {
    if (!window.confirm(`Delete this ${kind === 'quotes' ? 'quote request' : 'message'} from ${r.name}? This cannot be undone.`)) return
    const { error } = await supabase.from(cfg.table).delete().eq('id', r.id)
    if (error) return setError(error.message)
    setRows((rs) => rs.filter((x) => x.id !== r.id)); setSel(null)
  }

  return (
    <>
      <PageHead title={cfg.title} text={cfg.text}>
        <button onClick={() => csv(shown, cfg.table)} disabled={!shown.length} className="btn-ghost !py-2 disabled:opacity-50"><Download size={16} />Export CSV</button>
      </PageHead>
      <ErrorBox msg={error} />
      <div className="mb-4 mt-2 flex flex-wrap gap-3">
        <label className="relative min-w-[12rem] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input className="field !pl-10" placeholder="Search name, email or text" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="field !w-auto" aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>{cfg.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ul className="glass divide-y divide-line overflow-hidden rounded-3xl">
            {shown.length === 0 && <li className="p-8 text-center text-sm text-muted">{rows.length ? 'No results match your filters.' : 'Nothing here yet. Submissions from your website will appear here.'}</li>}
            {shown.map((r) => (
              <li key={r.id}>
                <button onClick={() => open(r)} className={`w-full p-4 text-left transition hover:bg-brand/5 ${sel === r.id ? 'bg-brand/10' : ''}`}>
                  <span className="flex items-center justify-between gap-3"><span className={`truncate text-sm ${r.status === 'new' ? 'font-extrabold' : 'font-semibold'}`}>{r.name}</span><Badge s={r.status} /></span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{r.email} · {fmt(r.created_at)}</span>
                  <span className="mt-1 block truncate text-sm text-muted">{r.services?.length ? `${r.services.join(', ')}: ` : ''}{r.message}</span>
                </button>
              </li>))}
          </ul>

          {current && (
            <section className="fixed inset-0 z-40 overflow-y-auto bg-bg p-5 lg:sticky lg:top-6 lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0" aria-label="Details">
              <div className="glass rounded-3xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><h2 className="truncate text-xl font-bold">{current.name}</h2><p className="text-xs text-muted">{fmt(current.created_at)}</p></div>
                  <button onClick={() => setSel(null)} aria-label="Close details" className="glass grid h-9 w-9 shrink-0 place-items-center rounded-full lg:hidden"><X size={16} /></button>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex gap-2"><dt className="w-20 text-muted">Email</dt><dd className="min-w-0 break-words"><a className="text-brand" href={`mailto:${current.email}`}>{current.email}</a></dd></div>
                  {current.phone && <div className="flex gap-2"><dt className="w-20 text-muted">Phone</dt><dd>{current.phone}</dd></div>}
                  {current.services && <div className="flex gap-2"><dt className="w-20 text-muted">Services</dt><dd>{current.services.join(', ')}</dd></div>}
                  {current.budget && <div className="flex gap-2"><dt className="w-20 text-muted">Budget</dt><dd>{current.budget}</dd></div>}
                </dl>
                <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-line p-4 text-sm">{current.message}</p>

                <label className="mt-5 block text-sm font-medium">Status
                  <select className="field mt-1.5" value={current.status} onChange={(e) => patch(current.id, { status: e.target.value })}>{cfg.statuses.map((s) => <option key={s}>{s}</option>)}</select>
                </label>
                <label className="mt-4 block text-sm font-medium">Private notes
                  <textarea rows="3" className="field mt-1.5" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to admins" />
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => patch(current.id, { notes })} disabled={notes === (current.notes || '')} className="btn-ghost !py-2 disabled:opacity-50">Save notes</button>
                  <a className="btn-primary !py-2" href={`mailto:${current.email}?subject=${encodeURIComponent('Re: your enquiry to Zeon Scale Agency')}`}><Mail size={16} />Reply by email</a>
                  <button onClick={() => remove(current)} className="btn ml-auto text-red-500 hover:bg-red-500/10 !py-2"><Trash2 size={16} />Delete</button>
                </div>
              </div>
            </section>)}
        </div>)}
    </>
  )
}
