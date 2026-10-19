import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers, Play, Check } from 'lucide-react'
import { categoryIcon } from '../data/site'
import ProjectVideo from './ProjectVideo'

export function SectionHead({ title, text, center }) {
  return (
    <div className={`mb-8 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <h2 className="text-3xl font-bold sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted">{text}</p>}
    </div>
  )
}

export function ServiceCard({ s }) {
  const I = s.icon
  return (
    <article id={s.slug} className="glass group scroll-mt-28 rounded-3xl p-7 transition duration-300 hover:-translate-y-1 hover:border-brand">
      <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand2))' }}><I size={22} /></span>
      <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
      <p className="mt-2 text-muted">{s.text}</p>
      {s.features?.length > 0 && <ul className="mt-4 space-y-1.5 text-sm">{s.features.map((f) => <li key={f} className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-brand" />{f}</li>)}</ul>}
      <Link to={`/get-quote?service=${s.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">Request this service <ArrowUpRight size={16} /></Link>
    </article>
  )
}

export function ProjectCard({ p }) {
  const I = p.icon || categoryIcon[p.category] || Layers
  return (
    <article className="glass overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-brand">
      <Link to={`/portfolio/${p.slug}`} tabIndex={-1} aria-hidden="true" className="animated-gradient relative grid aspect-video place-items-center overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0a3fd1, #1f6bff, #050b1f)' }}>
        {p.video_url ? <ProjectVideo src={p.video_url} poster={p.poster_url} title={p.title} mode="card" /> : <I size={44} strokeWidth={1.5} />}
        {p.demo && <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur">Concept demo</span>}
        {p.video_url && <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold backdrop-blur"><Play size={12} />Video</span>}
      </Link>
      <div className="p-6">
        <p className="text-sm font-semibold text-brand">{p.category}</p>
        <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
        <p className="mt-2 text-muted">{p.text}</p>
        <Link to={`/portfolio/${p.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">View project details <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  )
}
