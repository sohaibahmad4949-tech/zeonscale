import { useState } from 'react'
import useSeo from '../lib/useSeo'
import { useProjects } from '../lib/content'
import { SectionHead, ProjectCard } from '../components/Cards'

export default function Portfolio() {
  useSeo('Our Work', 'Concept projects from Zeon Scale Agency across WordPress, Shopify, custom web, SEO and design.')
  const { projects, categories } = useProjects()
  const [cat, setCat] = useState('All')
  const list = cat === 'All' ? projects : projects.filter((p) => p.category === cat)
  return (
    <section className="section wrap">
      <SectionHead title="Our work" text={projects.some((p) => p.demo) ? "Projects marked Concept demo are samples that demonstrate our approach. They are not client work." : "A selection of our recent work."} />
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${cat === c ? 'bg-brand text-white' : 'glass hover:border-brand'}`}>{c}</button>))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
    </section>
  )
}
