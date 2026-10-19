import { Loader2, AlertCircle, DatabaseZap } from 'lucide-react'

export const fmt = (d) => new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })

const tone = {
  new: 'bg-brand/15 text-brand', read: 'bg-slate-500/15 text-muted', archived: 'bg-slate-500/15 text-muted',
  contacted: 'bg-amber-500/15 text-amber-600', won: 'bg-emerald-500/15 text-emerald-600', lost: 'bg-red-500/15 text-red-500',
  live: 'bg-emerald-500/15 text-emerald-600', pending: 'bg-amber-500/15 text-amber-600', approved: 'bg-emerald-500/15 text-emerald-600', rejected: 'bg-red-500/15 text-red-500', draft: 'bg-slate-500/15 text-muted',
}
export const Badge = ({ s, label }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone[s] || tone.read}`}>{label || s}</span>
export const Spinner = () => <div className="grid place-items-center py-16 text-brand"><Loader2 className="animate-spin" /></div>
export const ErrorBox = ({ msg }) => msg ? <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500"><AlertCircle size={18} className="mt-0.5 shrink-0" />{msg}</p> : null

export function PageHead({ title, text, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>{text && <p className="mt-1 text-sm text-muted">{text}</p>}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  )
}

export function NotConfigured() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="glass max-w-md rounded-3xl p-8 text-center">
        <DatabaseZap className="mx-auto text-brand" size={32} />
        <h1 className="mt-4 text-xl font-bold">Supabase is not connected</h1>
        <p className="mt-2 text-sm text-muted">Check your .env: VITE_SUPABASE_URL must look like https://YOUR-PROJECT-ID.supabase.co and VITE_SUPABASE_ANON_KEY must be the anon (publishable) key, not the service_role key. Run supabase/schema.sql, then restart the dev server. The browser console shows which value is wrong.</p>
      </div>
    </div>
  )
}
