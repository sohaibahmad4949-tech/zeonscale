import { useState } from 'react'
import { Star, Send, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { validators } from '../lib/submit'

export default function ReviewForm({ onDone }) {
  const [v, setV] = useState({ name: '', role: '', email: '', quote: '', rating: 5, website: '' })
  const [err, setErr] = useState('')
  const [state, setState] = useState('idle')
  const set = (k, x) => setV((s) => ({ ...s, [k]: x }))

  const submit = async (e) => {
    e.preventDefault()
    if (v.website) return setState('done') // hidden spam trap
    const msg = validators.name(v.name) || (v.email && validators.email(v.email)) || (v.quote.trim().length < 10 ? 'Please write at least a sentence (10 characters).' : '')
    if (msg) return setErr(msg)
    if (!supabase) return setErr('Reviews are not connected yet. Please contact us directly.')
    setErr(''); setState('loading')
    const { error } = await supabase.from('testimonials').insert({
      name: v.name.trim(), role: v.role.trim() || null, email: v.email.trim() || null, quote: v.quote.trim(), rating: v.rating, status: 'pending', published: false,
    })
    if (error) { setState('idle'); return setErr('Could not send your review. Please try again.') }
    setState('done')
  }

  if (state === 'done') return (
    <div role="status" className="glass mx-auto max-w-xl rounded-3xl p-8 text-center">
      <CheckCircle2 className="mx-auto text-emerald-500" size={32} />
      <h3 className="mt-3 text-xl font-bold">Thank you for your review</h3>
      <p className="mt-2 text-muted">We check every review before it appears on the website. Yours will be visible once it is approved.</p>
      {onDone && <button onClick={onDone} className="btn-ghost mt-5">Close</button>}
    </div>)

  return (
    <form onSubmit={submit} noValidate className="glass mx-auto max-w-xl space-y-4 rounded-3xl p-6 sm:p-8">
      <h3 className="text-xl font-bold">Write a review</h3>
      <fieldset>
        <legend className="text-sm font-medium">Your rating</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => set('rating', n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={v.rating === n}>
              <Star size={30} className={n <= v.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'} />
            </button>))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Name<input className="field mt-1.5" value={v.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={100} /></label>
        <label className="block text-sm font-medium">Role or company (optional)<input className="field mt-1.5" value={v.role} onChange={(e) => set('role', e.target.value)} maxLength={100} /></label>
      </div>
      <label className="block text-sm font-medium">Email (optional, never shown)<input type="email" className="field mt-1.5" value={v.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></label>
      <label className="block text-sm font-medium">Your review<textarea rows="4" className="field mt-1.5" value={v.quote} onChange={(e) => set('quote', e.target.value)} maxLength={1000} /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={v.website} onChange={(e) => set('website', e.target.value)} />
      {err && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{err}</p>}
      <button type="submit" disabled={state === 'loading'} className="btn-primary w-full disabled:opacity-60">{state === 'loading' ? 'Sending…' : 'Submit review'}<Send size={16} /></button>
      <p className="text-center text-xs text-muted">Reviews are checked by our team before they are published.</p>
    </form>
  )
}
