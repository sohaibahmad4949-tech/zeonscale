import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import useSeo from '../lib/useSeo'
import { useProjects } from '../lib/content'
import ProjectVideo from '../components/ProjectVideo'

export default function ProjectDetail() {
  const { projects, ready } = useProjects()
  const p = projects.find((x) => x.slug === useParams().slug)
  useSeo(p ? p.title : 'Project not found', p?.text)
  if (!p && !ready) return null
  if (!p) return <section className="section wrap"><h1 className="text-3xl font-bold">Project not found</h1><Link to="/portfolio" className="btn-primary mt-6">Back to our work</Link></section>
  return (
    <section className="section wrap max-w-4xl">
      <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-brand"><ArrowLeft size={16} />All work</Link>
      {p.video_url && <ProjectVideo src={p.video_url} poster={p.poster_url} title={p.title} mode="player" className="mt-6" />}
      <p className="mt-8 text-sm font-semibold text-brand">{p.category}{p.demo ? ' · Concept demo' : ''}</p>
      <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{p.title}</h1>
      <p className="mt-5 text-lg text-muted">{p.text}{p.demo ? ' This is a demonstration project created to show our approach. It is not a real client engagement.' : ''}</p>
      {p.scope?.length > 0 && <h2 className="mt-10 text-xl font-bold">{p.demo ? 'What this concept covers' : 'What we delivered'}</h2>}
      <ul className="mt-4 space-y-2">{(p.scope || []).map((s) => <li key={s} className="flex items-center gap-3"><Check size={18} className="text-brand" />{s}</li>)}</ul>
      <Link to="/get-quote" className="btn-primary mt-10">Start a similar project</Link>
    </section>
  )
}
