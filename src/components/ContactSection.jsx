import { Mail, MessageCircle, ArrowUpRight, MessageSquareText, Phone, MapPin } from 'lucide-react'
import { socialIcons } from './SocialIcons'
import { site } from '../data/site'
import { ContactForm } from './Forms'

const steps = [
  ['You send the details', 'Tell us about your business and what you want to build.'],
  ['We reply by email', 'We answer questions and suggest next steps.'],
  ['We agree the plan', 'Scope, timeline and price are confirmed before any work starts.'],
]

function Method({ icon: I, label, value, href, external }) {
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="glass group flex items-center gap-4 rounded-2xl p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand2))' }}><I size={20} /></span>
      <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-muted">{label}</span><span className="block truncate font-semibold">{value}</span></span>
      <ArrowUpRight size={18} className="text-muted transition group-hover:text-brand" />
    </a>
  )
}

export default function ContactSection({ as: H = 'h2' }) {
  const hasDirect = site.email || site.whatsapp || site.phone
  return (
    <section className="section wrap relative">
      <div className="absolute -left-10 top-10 -z-10 h-64 w-64 rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <H className="text-3xl font-extrabold sm:text-5xl">Let’s talk about your project</H>
          <p className="mt-4 max-w-md text-lg text-muted">Questions, ideas or a project in mind? Send a message and we will take it from there.</p>

          <div className="mt-8 space-y-3">
            {site.email && <Method icon={Mail} label="Email us" value={site.email} href={`mailto:${site.email}`} />}
            {site.phone && <Method icon={Phone} label="Call us" value={site.phone} href={site.phoneHref} />}
            {site.whatsapp && <Method icon={MessageCircle} label="Message us on WhatsApp" value="Start a chat" href={site.whatsapp} external />}
            {site.address && <Method icon={MapPin} label="Find us" value={site.address} href={site.mapUrl} external />}
            {!hasDirect && (
              <div className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand2))' }}><MessageSquareText size={20} /></span>
                <p className="text-sm text-muted">Use the form and we will reply by email.</p>
              </div>
            )}
          </div>

          <h3 className="mt-10 text-lg font-bold">What happens next</h3>
          <ol className="mt-4 space-y-4 border-l border-line pl-6">
            {steps.map(([t, d], i) => (
              <li key={t} className="relative">
                <span className="absolute -left-[2.15rem] grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-bold text-white">{i + 1}</span>
                <p className="font-semibold">{t}</p><p className="text-sm text-muted">{d}</p>
              </li>))}
          </ol>

          {site.socials.length > 0 && (
            <div className="mt-8 flex items-center gap-2">
              <span className="mr-2 text-sm text-muted">Follow us</span>
              {site.socials.map((s) => { const I = socialIcons[s.icon]; return (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="glass grid h-10 w-10 place-items-center rounded-full transition hover:border-brand hover:text-brand"><I size={17} /></a>) })}
            </div>
          )}
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
