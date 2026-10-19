import { useState } from 'react'
import { CheckCircle2, AlertCircle, Send } from 'lucide-react'
import { submitForm, validators } from '../lib/submit'
import { useServices } from '../lib/content'

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1.5">{children}</div>
      {error && <span role="alert" className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

function useFormState(kind, initial, rules) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', msg: '' })
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }))
  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    rules.forEach((k) => { const m = validators[k](values[k]); if (m) errs[k] = m })
    setErrors(errs)
    if (Object.keys(errs).length) return setStatus({ type: 'error', msg: 'Please fix the highlighted fields.' })
    setStatus({ type: 'loading', msg: '' })
    try {
      const r = await submitForm(kind, values)
      setStatus({ type: 'success', msg: r === 'mailto' ? 'Your email app should now open with your message ready to send.' : 'Thanks. We received your message and will reply by email.' })
      setValues(initial)
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    }
  }
  return { values, set, errors, status, onSubmit }
}

function Status({ status }) {
  if (status.type === 'success') return <p role="status" className="flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />{status.msg}</p>
  if (status.type === 'error') return <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500"><AlertCircle size={18} className="mt-0.5 shrink-0" />{status.msg}</p>
  return null
}

const submitBtn = (loading, label) => (
  <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? 'Sending…' : label}<Send size={16} /></button>
)

export function ContactForm() {
  const f = useFormState('contact', { name: '', email: '', message: '' }, ['name', 'email', 'message'])
  return (
    <form onSubmit={f.onSubmit} noValidate className="glass space-y-4 rounded-3xl p-6 sm:p-8">
      <Field label="Name" error={f.errors.name}><input className="field" value={f.values.name} onChange={(e) => f.set('name', e.target.value)} autoComplete="name" /></Field>
      <Field label="Email" error={f.errors.email}><input type="email" className="field" value={f.values.email} onChange={(e) => f.set('email', e.target.value)} autoComplete="email" /></Field>
      <Field label="Message" error={f.errors.message}><textarea rows="5" className="field" value={f.values.message} onChange={(e) => f.set('message', e.target.value)} /></Field>
      <Status status={f.status} />
      {submitBtn(f.status.type === 'loading', 'Send message')}
    </form>
  )
}

export function QuoteForm({ preselect }) {
  const services = useServices()
  const f = useFormState('quote', { name: '', email: '', phone: '', services: preselect ? [preselect] : [], budget: '', message: '' }, ['name', 'email', 'services', 'message'])
  const toggle = (t) => f.set('services', f.values.services.includes(t) ? f.values.services.filter((x) => x !== t) : [...f.values.services, t])
  return (
    <form onSubmit={f.onSubmit} noValidate className="glass space-y-5 rounded-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={f.errors.name}><input className="field" value={f.values.name} onChange={(e) => f.set('name', e.target.value)} autoComplete="name" /></Field>
        <Field label="Email" error={f.errors.email}><input type="email" className="field" value={f.values.email} onChange={(e) => f.set('email', e.target.value)} autoComplete="email" /></Field>
      </div>
      <Field label="Phone or WhatsApp (optional)"><input type="tel" className="field" value={f.values.phone} onChange={(e) => f.set('phone', e.target.value)} autoComplete="tel" /></Field>
      <fieldset>
        <legend className="text-sm font-medium">Services you need</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {services.map((s) => (
            <label key={s.slug} className="glass flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm has-[:checked]:border-brand">
              <input type="checkbox" className="h-4 w-4 accent-[var(--brand)]" checked={f.values.services.includes(s.title)} onChange={() => toggle(s.title)} />{s.title}
            </label>))}
        </div>
        {f.errors.services && <span role="alert" className="mt-1 block text-xs text-red-500">{f.errors.services}</span>}
      </fieldset>
      <Field label="Budget range (optional)">
        <select className="field" value={f.values.budget} onChange={(e) => f.set('budget', e.target.value)}>
          <option value="">Not sure yet</option><option>Under $500</option><option>$500 – $1,500</option><option>$1,500 – $5,000</option><option>$5,000+</option>
        </select>
      </Field>
      <Field label="Tell us about your project" error={f.errors.message}><textarea rows="5" className="field" value={f.values.message} onChange={(e) => f.set('message', e.target.value)} /></Field>
      <Status status={f.status} />
      {submitBtn(f.status.type === 'loading', 'Request my quote')}
    </form>
  )
}
