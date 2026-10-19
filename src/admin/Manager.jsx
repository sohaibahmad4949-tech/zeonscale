import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Check, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Badge, ErrorBox, PageHead, Spinner } from './ui'

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Generic list + create/edit/delete screen driven by a field config.
export default function Manager({ table, title, text, noun, fields, blank, order, primary, secondary, approval, seed }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')

  const load = () => supabase.from(table).select('*').order(order.col, { ascending: order.asc }).then(({ data, error }) => {
    if (error) setError(error.message); else setRows(data); setLoading(false)
  })
  useEffect(() => { load() }, [table])

  const edit = (r) => setForm(r ? { ...r, ...Object.fromEntries(fields.filter((f) => f.type === 'lines').map((f) => [f.name, (r[f.name] || []).join('\n')])) } : { ...blank })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {}
    fields.forEach((f) => {
      let v = form[f.name]
      if (f.type === 'lines') v = String(v || '').split('\n').map((x) => x.trim()).filter(Boolean)
      if (f.type === 'number') v = Number(v) || 0
      if (typeof v === 'string') v = v.trim()
      payload[f.name] = v === '' && !f.required ? null : v
    })
    if ('slug' in payload && !payload.slug) payload.slug = slugify(payload.title || '')
    if ('rating' in payload && !payload.rating) payload.rating = null
    if (approval) payload.status = payload.published ? 'approved' : (form.status === 'pending' || form.status === 'rejected' ? form.status : 'approved')
    const { error } = form.id ? await supabase.from(table).update(payload).eq('id', form.id) : await supabase.from(table).insert(payload)
    setSaving(false)
    if (error) return setError(error.code === '23505' ? 'That slug is already used. Choose a different one.' : error.message)
    setForm(null); load()
  }
  const remove = async (r) => {
    if (!window.confirm(`Delete this ${noun}? This cannot be undone.`)) return
    const { error } = await supabase.from(table).delete().eq('id', r.id)
    if (error) return setError(error.message)
    setRows((rs) => rs.filter((x) => x.id !== r.id)); window.dispatchEvent(new Event('zeon-counts'))
  }
  const review = async (r, ok) => {
    const { error } = await supabase.from(table).update({ status: ok ? 'approved' : 'rejected', published: ok }).eq('id', r.id)
    if (error) return setError(error.message)
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: ok ? 'approved' : 'rejected', published: ok } : x)))
    window.dispatchEvent(new Event('zeon-counts'))
  }
  const missing = (seed || []).filter((d) => !rows.some((r) => r.slug === d.slug))
  const importSeed = async () => {
    setError('')
    const { error } = await supabase.from(table).insert(missing)
    if (error) return setError(error.message)
    load()
  }
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const upload = async (f, file) => {
    if (!file) return
    if (file.size > 50 * 1024 * 1024) return setError('That file is over 50 MB. Compress it or paste a YouTube/Vimeo link instead.')
    setUploading(f.name); setError('')
    const path = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`
    const { error } = await supabase.storage.from(f.bucket).upload(path, file, { contentType: file.type, upsert: false })
    setUploading('')
    if (error) return setError(`Upload failed: ${error.message}. Run the latest supabase/schema.sql to create the storage bucket.`)
    set(f.name, supabase.storage.from(f.bucket).getPublicUrl(path).data.publicUrl)
  }
  useEffect(() => {
    if (!form) return
    const onKey = (e) => e.key === 'Escape' && setForm(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [!!form])

  return (
    <>
      <PageHead title={title} text={text}><button onClick={() => edit(null)} className="btn-primary !py-2"><Plus size={16} />Add {noun}</button></PageHead>
      {!form && <ErrorBox msg={error} />}
      {!loading && missing.length > 0 && (
        <div className="glass mb-4 flex flex-wrap items-center gap-4 rounded-2xl border-brand/40 p-4">
          <div className="min-w-0 flex-1 text-sm"><p className="font-semibold">{missing.length} sample demo {noun}{missing.length === 1 ? ' is' : 's are'} showing on your website but not in this list</p>
            <p className="text-muted">{missing.map((m) => m.title).join(', ')}. Add them here to edit, hide or delete them.{rows.some((r) => r.published) ? '' : ' Until you publish a project of your own, the website shows these samples.'}</p></div>
          <button onClick={importSeed} className="btn-primary !py-2"><Download size={16} />Add to my {noun}s</button>
        </div>)}
      {loading ? <Spinner /> : (
        <ul className="grid gap-3">
          {rows.length === 0 && <li className="glass rounded-3xl p-10 text-center text-sm text-muted">No {noun}s yet. Add your first one.</li>}
          {rows.map((r) => (
            <li key={r.id} className="glass flex items-center gap-4 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold"><span className="truncate">{primary(r)}</span>{approval && r.status !== 'approved' ? <Badge s={r.status} /> : <Badge s={r.published ? 'live' : 'draft'} />}{r.demo && <Badge s="read" label="concept demo" />}</p>
                <p className="truncate text-sm text-muted">{secondary(r)}</p>
              </div>
              {approval && r.status === 'pending' && <button onClick={() => review(r, true)} className="btn-primary !px-4 !py-2 text-xs"><Check size={14} />Approve</button>}
              {approval && r.status === 'pending' && <button onClick={() => review(r, false)} className="btn-ghost !px-4 !py-2 text-xs">Reject</button>}
              {approval && r.status === 'rejected' && <button onClick={() => review(r, true)} className="btn-ghost !px-4 !py-2 text-xs">Approve</button>}
              <button onClick={() => edit(r)} aria-label={`Edit ${primary(r)}`} className="glass grid h-9 w-9 place-items-center rounded-full hover:border-brand"><Pencil size={15} /></button>
              <button onClick={() => remove(r)} aria-label={`Delete ${primary(r)}`} className="grid h-9 w-9 place-items-center rounded-full text-red-500 hover:bg-red-500/10"><Trash2 size={15} /></button>
            </li>))}
        </ul>)}

      {form && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${form.id ? 'Edit' : 'Add'} ${noun}`}>
          <div className="mx-auto flex min-h-full max-w-xl items-center">
          <form onSubmit={save} className="my-4 w-full space-y-4 rounded-3xl border border-line bg-bg p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{form.id ? 'Edit' : 'Add'} {noun}</h2><button type="button" onClick={() => { setForm(null); setError('') }} aria-label="Close" className="glass grid h-9 w-9 place-items-center rounded-full"><X size={16} /></button></div>
            {fields.map((f) => f.type === 'checkbox' ? (
              <label key={f.name} className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--brand)]" checked={!!form[f.name]} onChange={(e) => set(f.name, e.target.checked)} /><span><span className="font-medium">{f.label}</span>{f.help && <span className="block text-xs text-muted">{f.help}</span>}</span></label>
            ) : (
              <label key={f.name} className="block text-sm font-medium">{f.label}
                {f.type === 'upload' ? (
                  <span className="mt-1.5 flex gap-2">
                    <input type="text" className="field" value={form[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
                    <span className="btn-ghost relative shrink-0 cursor-pointer !py-2 focus-within:outline focus-within:outline-2"><Upload size={15} />{uploading === f.name ? 'Uploading…' : 'Upload'}
                      <input type="file" accept={f.accept} disabled={!!uploading} className="absolute inset-0 cursor-pointer opacity-0" aria-label={`Upload ${f.label}`} onChange={(e) => { upload(f, e.target.files[0]); e.target.value = '' }} /></span>
                  </span>
                ) : f.type === 'select' ? (
                  <select required={f.required} className="field mt-1.5" value={form[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}>
                    {!f.required && <option value="">None</option>}
                    {f.required && !form[f.name] && <option value="" disabled>Choose…</option>}
                    {[...new Set([...(f.options || []), ...(form[f.name] ? [form[f.name]] : [])])].map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === 'textarea' || f.type === 'lines' ? (
                  <textarea rows={f.type === 'lines' ? 4 : 4} required={f.required} className="field mt-1.5" value={form[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
                ) : (
                  <input type={f.type === 'number' ? 'number' : 'text'} required={f.required} className="field mt-1.5" value={form[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
                )}
                {f.help && <span className="mt-1 block text-xs font-normal text-muted">{f.help}</span>}
              </label>))}
                        <ErrorBox msg={error} />
            <div className="flex justify-end gap-2"><button type="button" onClick={() => { setForm(null); setError('') }} className="btn-ghost">Cancel</button><button disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button></div>
          </form>
          </div>
        </div>)}
    </>
  )
}
