import { useEffect, useMemo, useState } from 'react'
import { Eye, Users, FileText, Percent, Download, CheckCircle2, AlertTriangle, XCircle, Search, Smartphone, Monitor, Tablet, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useProjects } from '../lib/content'
import { analyticsStatus } from '../lib/analytics'
import { site } from '../data/site'
import { ErrorBox, PageHead, Spinner } from './ui'

// Pages and the defaults each one ships with (kept in sync with the useSeo() calls in src/pages).
const STATIC_PAGES = [
  { path: '/', name: 'Home', title: 'Zeon Scale Agency | We Build Digital Experiences That Scale', description: 'Zeon Scale Agency builds websites, Shopify stores, SEO content and digital marketing that help businesses grow online.' },
  { path: '/about', name: 'About', title: 'About Us', description: 'Learn how Zeon Scale Agency works: modern technology, clear communication and solutions tailored to your business.' },
  { path: '/services', name: 'Services', title: 'Services', description: 'SEO and content writing, WordPress, Shopify, custom web development, digital marketing and graphic design from Zeon Scale Agency.' },
  { path: '/portfolio', name: 'Our Work', title: 'Our Work', description: 'Concept projects from Zeon Scale Agency across WordPress, Shopify, custom web, SEO and design.' },
  { path: '/contact', name: 'Contact', title: 'Contact Us', description: 'Contact Zeon Scale Agency about your website, store, SEO or marketing project.' },
  { path: '/get-quote', name: 'Get a Quote', title: 'Get a Quote', description: 'Request a quote from Zeon Scale Agency for web development, Shopify, SEO, marketing or design.' },
]
const fullTitle = (t) => (!t ? '' : t.includes('Zeon Scale Agency') ? t : `${t} | Zeon Scale Agency`)
const TITLE = [30, 60], DESC = [70, 160]
const tone = { ok: 'text-emerald-600', warn: 'text-amber-600', bad: 'text-red-500' }
const grade = (len, [lo, hi]) => (!len ? 'bad' : len < lo || len > hi ? 'warn' : 'ok')
const dayKey = (d) => new Date(d).toLocaleDateString('en-CA')

async function fetchViews(sinceISO) {
  const out = []
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await supabase.from('page_views').select('created_at,session_id,path,referrer,device')
      .gte('created_at', sinceISO).order('created_at', { ascending: false }).range(from, from + 999)
    if (error) throw error
    out.push(...data)
    if (data.length < 1000) break
  }
  return out
}

/* ---------- Analytics ---------- */
function Analytics() {
  const [days, setDays] = useState(30)
  const [rows, setRows] = useState(null)
  const [quotes, setQuotes] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    setRows(null); setError('')
    const since = new Date(Date.now() - days * 864e5); since.setHours(0, 0, 0, 0)
    Promise.all([
      fetchViews(since.toISOString()),
      supabase.from('quote_requests').select('*', { count: 'exact', head: true }).gte('created_at', since.toISOString()),
    ]).then(([v, q]) => { setRows(v); setQuotes(q.count || 0) }).catch((e) => setError(`${e.message}. Run the latest supabase/schema.sql to create the page_views table.`))
  }, [days])

  const d = useMemo(() => {
    if (!rows) return null
    const visitors = new Set(rows.map((r) => r.session_id)).size
    const byDay = {}
    rows.forEach((r) => { const k = dayKey(r.created_at); byDay[k] = (byDay[k] || 0) + 1 })
    const series = Array.from({ length: days }, (_, i) => { const k = dayKey(Date.now() - (days - 1 - i) * 864e5); return { k, n: byDay[k] || 0 } })
    const tally = (fn) => Object.entries(rows.reduce((a, r) => { const k = fn(r); a[k] = (a[k] || 0) + 1; return a }, {})).sort((a, b) => b[1] - a[1])
    return { views: rows.length, visitors, series, pages: tally((r) => r.path).slice(0, 8), refs: tally((r) => r.referrer || 'Direct / none').slice(0, 6), devices: tally((r) => r.device || 'desktop') }
  }, [rows, days])

  const Tile = ({ label, value, sub, I }) => (
    <div className="glass rounded-3xl p-5"><div className="flex items-center justify-between text-sm text-muted">{label}<I size={18} className="text-brand" /></div>
      <p className="mt-3 font-display text-4xl font-extrabold">{value}</p><p className="text-xs text-muted">{sub}</p></div>)
  const List = ({ title, items, total }) => (
    <section className="glass rounded-3xl p-5"><h2 className="mb-3 font-bold">{title}</h2>
      {items.length === 0 ? <p className="py-4 text-sm text-muted">No data yet.</p> : (
        <ul className="space-y-2.5">{items.map(([k, n]) => (
          <li key={k} className="text-sm"><div className="flex justify-between gap-3"><span className="truncate">{k}</span><span className="font-semibold tabular-nums">{n}</span></div>
            <div className="mt-1 h-1.5 rounded-full bg-brand/10"><div className="h-full rounded-full bg-brand" style={{ width: `${(n / total) * 100}%` }} /></div></li>))}</ul>)}
    </section>)

  const max = d ? Math.max(1, ...d.series.map((s) => s.n)) : 1
  const DevIcon = { mobile: Smartphone, tablet: Tablet, desktop: Monitor }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Date range">
          {[7, 30, 90].map((n) => <button key={n} onClick={() => setDays(n)} aria-pressed={days === n} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${days === n ? 'bg-brand text-white' : 'glass hover:border-brand'}`}>Last {n} days</button>)}
        </div>
        <p className="text-xs text-muted">Cookie-free counter. No IP addresses or personal data stored.{analyticsStatus.ga ? ' Google Analytics 4 is also connected.' : ''}</p>
      </div>
      <ErrorBox msg={error} />
      {!d && !error && <Spinner />}
      {d && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Tile label="Page views" value={d.views} sub={`last ${days} days`} I={Eye} />
            <Tile label="Visitors" value={d.visitors} sub="unique browsing sessions" I={Users} />
            <Tile label="Pages per visit" value={d.visitors ? (d.views / d.visitors).toFixed(1) : '0'} sub="engagement" I={FileText} />
            <Tile label="Quote conversion" value={d.visitors ? `${((quotes / d.visitors) * 100).toFixed(1)}%` : '0%'} sub={`${quotes} quote request${quotes === 1 ? '' : 's'}`} I={Percent} />
          </div>

          <section className="glass mt-6 rounded-3xl p-5">
            <h2 className="font-bold">Page views per day</h2>
            {d.views === 0 ? <p className="py-10 text-center text-sm text-muted">No visits recorded yet. Views appear here as people browse the public site.</p> : (
              <>
                <svg viewBox={`0 0 ${days * 12} 150`} className="mt-4 h-44 w-full" role="img" aria-label={`Daily page views over the last ${days} days. Peak ${max}.`} preserveAspectRatio="none">
                  {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={days * 12} y1={130 - g * 120} y2={130 - g * 120} stroke="var(--line)" />)}
                  {d.series.map((s, i) => <rect key={s.k} x={i * 12 + 1.5} width="9" y={130 - (s.n / max) * 120} height={(s.n / max) * 120} rx="2" fill="var(--brand)"><title>{`${s.k}: ${s.n} views`}</title></rect>)}
                  <line x1="0" x2={days * 12} y1="130" y2="130" stroke="var(--line)" />
                </svg>
                <div className="mt-1 flex justify-between text-xs text-muted"><span>{d.series[0].k}</span><span>Peak: {max}/day</span><span>{d.series.at(-1).k}</span></div>
              </>)}
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <List title="Top pages" items={d.pages} total={d.views} />
            <List title="Traffic sources" items={d.refs} total={d.views} />
            <section className="glass rounded-3xl p-5"><h2 className="mb-3 font-bold">Devices</h2>
              {d.devices.length === 0 ? <p className="py-4 text-sm text-muted">No data yet.</p> : (
                <ul className="space-y-3">{d.devices.map(([k, n]) => { const I = DevIcon[k] || Monitor; return (
                  <li key={k} className="flex items-center gap-3 text-sm"><I size={18} className="text-brand" /><span className="flex-1 capitalize">{k}</span><span className="font-semibold tabular-nums">{Math.round((n / d.views) * 100)}%</span></li>) })}</ul>)}
            </section>
          </div>
        </>)}
    </>
  )
}

/* ---------- Page SEO ---------- */
function useSeoPages() {
  const { projects } = useProjects()
  const [over, setOver] = useState(null)
  const [error, setError] = useState('')
  const load = () => supabase.from('seo_pages').select('*').then(({ data, error }) => {
    if (error) { setError(`${error.message}. Run the latest supabase/schema.sql to create the seo_pages table.`); setOver({}) } else setOver(Object.fromEntries(data.map((r) => [r.path, r])))
  })
  useEffect(() => { load() }, [])
  const pages = useMemo(() => [
    ...STATIC_PAGES,
    ...projects.map((p) => ({ path: `/portfolio/${p.slug}`, name: p.title, title: p.title, description: p.text || '' })),
  ].map((p) => {
    const o = over?.[p.path]
    return { ...p, o, effTitle: o?.title || p.title, effDesc: o?.description || p.description, noindex: !!o?.noindex }
  }), [projects, over])
  return { pages, over, error, setError, reload: load, projects }
}

function Serp({ url, title, desc }) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-4" aria-label="Search result preview">
      <p className="truncate text-xs text-muted">{url}</p>
      <p className="mt-0.5 truncate text-lg font-medium text-brand">{fullTitle(title) || 'Untitled page'}</p>
      <p className="mt-0.5 line-clamp-2 text-sm text-muted">{desc || 'No description. Search engines will pick text from the page.'}</p>
    </div>)
}

function PageSeo({ data }) {
  const { pages, over, error, setError, reload } = data
  const [open, setOpen] = useState(null)
  const [f, setF] = useState(null)
  const [saving, setSaving] = useState(false)
  const origin = typeof location !== 'undefined' ? location.origin.replace(/^https?:\/\//, '') : ''

  const edit = (p) => { setOpen(p.path); setF({ title: p.o?.title || '', description: p.o?.description || '', noindex: p.noindex }); setError('') }
  const save = async (p) => {
    setSaving(true); setError('')
    const { error } = await supabase.from('seo_pages').upsert({ path: p.path, title: f.title.trim() || null, description: f.description.trim() || null, noindex: f.noindex, updated_at: new Date().toISOString() })
    setSaving(false)
    if (error) return setError(error.message)
    setOpen(null); reload()
  }
  const reset = async (p) => {
    const { error } = await supabase.from('seo_pages').delete().eq('path', p.path)
    if (error) return setError(error.message)
    setOpen(null); reload()
  }
  if (!over) return <Spinner />
  const cur = pages.find((p) => p.path === open)
  const Count = ({ n, r }) => <span className={`text-xs font-semibold tabular-nums ${tone[grade(n, r)]}`}>{n} characters · aim for {r[0]}–{r[1]}</span>

  return (
    <>
      <p className="mb-4 text-sm text-muted">Edit the search title and description for any page. Changes apply to the live site the next time the page loads. Leave a field empty to keep the built-in default.</p>
      <ErrorBox msg={error} />
      <ul className="mt-3 grid gap-3">
        {pages.map((p) => (
          <li key={p.path} className="glass rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold">{p.name}<code className="rounded bg-brand/10 px-1.5 py-0.5 text-xs font-normal text-brand">{p.path}</code>
                  {p.o && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600">customised</span>}
                  {p.noindex && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-500">hidden from search</span>}</p>
                <p className="mt-1 truncate text-sm text-muted">{fullTitle(p.effTitle)}</p>
              </div>
              <button onClick={() => (open === p.path ? setOpen(null) : edit(p))} aria-expanded={open === p.path} className="btn-ghost !py-2">{open === p.path ? 'Close' : 'Edit SEO'}</button>
            </div>
            {open === p.path && f && (
              <div className="mt-4 space-y-4 border-t border-line pt-4">
                <label className="block text-sm font-medium">Search title
                  <input className="field mt-1.5" value={f.title} placeholder={p.title} maxLength={120} onChange={(e) => setF({ ...f, title: e.target.value })} />
                  <span className="mt-1 block"><Count n={fullTitle(f.title || p.title).length} r={TITLE} /></span></label>
                <label className="block text-sm font-medium">Meta description
                  <textarea rows={3} className="field mt-1.5" value={f.description} placeholder={p.description} maxLength={320} onChange={(e) => setF({ ...f, description: e.target.value })} />
                  <span className="mt-1 block"><Count n={(f.description || p.description).length} r={DESC} /></span></label>
                <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--brand)]" checked={f.noindex} onChange={(e) => setF({ ...f, noindex: e.target.checked })} />
                  <span><span className="font-medium">Hide this page from search engines</span><span className="block text-xs text-muted">Adds a noindex tag. Leave off for pages you want to rank.</span></span></label>
                <Serp url={`${origin}${p.path}`} title={f.title || p.title} desc={f.description || p.description} />
                <div className="flex justify-between gap-2">
                  {p.o ? <button onClick={() => reset(p)} className="btn-ghost !py-2"><RotateCcw size={15} />Reset to default</button> : <span />}
                  <button disabled={saving} onClick={() => save(cur)} className="btn-primary !py-2 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
                </div>
              </div>)}
          </li>))}
      </ul>
    </>
  )
}

/* ---------- Audit ---------- */
const download = (name, text, type) => {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href)
}
const probe = async (path, kind) => {
  try {
    const r = await fetch(path, { cache: 'no-store' }); const t = await r.text()
    return r.ok && !/^\s*<!doctype html/i.test(t) && (kind === 'xml' ? t.includes('<urlset') : /user-agent/i.test(t))
  } catch { return false }
}

function Audit({ data }) {
  const { pages, projects } = data
  const [files, setFiles] = useState(null)
  useEffect(() => { Promise.all([probe('/sitemap.xml', 'xml'), probe('/robots.txt', 'txt')]).then(([s, r]) => setFiles({ s, r })) }, [])

  const pageChecks = pages.map((p) => {
    const t = fullTitle(p.effTitle).length, ds = p.effDesc.length
    const issues = []
    if (grade(t, TITLE) !== 'ok') issues.push(t === 0 ? 'Missing title' : t < TITLE[0] ? `Title is short (${t})` : `Title is long (${t})`)
    if (grade(ds, DESC) !== 'ok') issues.push(ds === 0 ? 'Missing description' : ds < DESC[0] ? `Description is short (${ds})` : `Description is long (${ds})`)
    if (p.noindex) issues.push('Hidden from search engines')
    return { p, issues }
  })
  const dup = (key) => { const seen = {}; pages.forEach((p) => { seen[p[key]] = (seen[p[key]] || 0) + 1 }); return Object.values(seen).some((n) => n > 1) }
  const withVideo = projects.filter((p) => p.video_url).length
  const siteChecks = [
    { ok: location.protocol === 'https:', bad: 'Site is not served over HTTPS', good: 'Served over HTTPS', soft: location.hostname === 'localhost' },
    { ok: files?.s, bad: 'No sitemap.xml found. Download one below and put it in the public folder.', good: 'sitemap.xml is published', wait: !files },
    { ok: files?.r, bad: 'No robots.txt found. Download one below and put it in the public folder.', good: 'robots.txt is published', wait: !files },
    { ok: !dup('effTitle'), bad: 'Two or more pages share the same title', good: 'Every page has a unique title' },
    { ok: !dup('effDesc'), bad: 'Two or more pages share the same description', good: 'Every page has a unique description' },
    { ok: !!document.querySelector('meta[property="og:image"]'), bad: 'No social share image (og:image)', good: 'Social share image is set' },
    { ok: analyticsStatus.builtIn, bad: 'Built-in analytics are off (Supabase not connected)', good: 'Built-in analytics are recording' },
    { ok: analyticsStatus.ga, bad: 'Google Analytics is not connected. Optional: set VITE_GA_ID in .env.', good: 'Google Analytics 4 is connected', optional: true },
    { ok: projects.length > 0 && withVideo === projects.length, bad: `${projects.length - withVideo} project${projects.length - withVideo === 1 ? ' has' : 's have'} no video`, good: 'Every project has a video', optional: true },
    { ok: !!site.email, bad: 'No contact email set (VITE_CONTACT_EMAIL)', good: 'Contact email is set', optional: true },
  ]
  const total = siteChecks.length + pageChecks.length
  const passed = siteChecks.filter((c) => c.ok).length + pageChecks.filter((c) => c.issues.length === 0).length
  const score = Math.round((passed / total) * 100)

  const sitemap = () => {
    const base = location.origin
    const urls = pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${base}${p.path === '/' ? '' : p.path}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`)
    download('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, 'application/xml')
  }
  const robots = () => download('robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${location.origin}/sitemap.xml\n`, 'text/plain')

  return (
    <>
      <div className="glass flex flex-wrap items-center gap-6 rounded-3xl p-6">
        <div className="grid h-24 w-24 place-items-center rounded-full border-8 font-display text-2xl font-extrabold" style={{ borderColor: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }} role="img" aria-label={`SEO health ${score} out of 100`}>{score}</div>
        <div className="min-w-0 flex-1"><h2 className="text-xl font-bold">SEO health</h2><p className="mt-1 text-sm text-muted">{passed} of {total} checks passed. Titles of {TITLE[0]}–{TITLE[1]} characters and descriptions of {DESC[0]}–{DESC[1]} display fully in Google results.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={sitemap} className="btn-ghost !py-2"><Download size={15} />sitemap.xml</button><button onClick={robots} className="btn-ghost !py-2"><Download size={15} />robots.txt</button></div>
      </div>

      <section className="glass mt-6 rounded-3xl p-5"><h2 className="mb-3 font-bold">Site checks</h2>
        <ul className="divide-y divide-line">{siteChecks.map((c, i) => {
          const I = c.wait ? Search : c.ok ? CheckCircle2 : c.optional || c.soft ? AlertTriangle : XCircle
          return <li key={i} className="flex items-start gap-3 py-2.5 text-sm"><I size={18} className={`mt-0.5 shrink-0 ${c.wait ? 'text-muted' : c.ok ? 'text-emerald-600' : c.optional || c.soft ? 'text-amber-600' : 'text-red-500'}`} />{c.wait ? 'Checking…' : c.ok ? c.good : c.bad}</li>
        })}</ul>
      </section>

      <section className="glass mt-6 rounded-3xl p-5"><h2 className="mb-3 font-bold">Page checks</h2>
        <ul className="divide-y divide-line">{pageChecks.map(({ p, issues }) => (
          <li key={p.path} className="flex items-start gap-3 py-2.5 text-sm">
            {issues.length === 0 ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />}
            <span className="min-w-0"><span className="font-semibold">{p.name}</span> <code className="text-xs text-muted">{p.path}</code>
              <span className="block text-muted">{issues.length ? issues.join(' · ') : 'Title and description look good'}</span></span></li>))}</ul>
      </section>
    </>
  )
}

/* ---------- Page ---------- */
const TABS = [['analytics', 'Analytics'], ['seo', 'Page SEO'], ['audit', 'SEO audit']]
export default function SeoAnalytics() {
  const [tab, setTab] = useState('analytics')
  const data = useSeoPages()
  return (
    <>
      <PageHead title="SEO & Analytics" text="See who visits the site, and control how each page appears in search." />
      <div className="mb-6 flex gap-1 border-b border-line" role="tablist">
        {TABS.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${tab === k ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}>{label}</button>)}
      </div>
      {tab === 'analytics' && <Analytics />}
      {tab === 'seo' && <PageSeo data={data} />}
      {tab === 'audit' && <Audit data={data} />}
    </>
  )
}
