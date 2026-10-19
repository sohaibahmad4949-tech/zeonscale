import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import useSeo from '../lib/useSeo'
import { reasons, process } from '../data/site'
import { useProjects, useServices } from '../lib/content'
import { SectionHead, ServiceCard, ProjectCard } from '../components/Cards'
import HeroVisual from '../components/HeroVisual'
import Testimonials from '../components/Testimonials'
import ContactSection from '../components/ContactSection'

export default function Home() {
  const { projects } = useProjects()
  const services = useServices()
  useSeo('', 'Zeon Scale Agency builds websites, Shopify stores, SEO content and digital marketing that help businesses grow online.')
  return (
    <>
      <section className="hero-bg relative overflow-hidden">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-14 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-7xl">We build digital experiences that scale.</h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">Zeon Scale Agency designs and develops websites, online stores and marketing that help your business get found, win customers and grow.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/services" className="btn-primary !px-7 !py-3.5">Explore Our Services <ArrowRight size={16} /></Link>
              <Link to="/get-quote" className="btn-ghost !px-7 !py-3.5">Start a Project</Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted">
              {['Responsive on every device', 'SEO-ready structure', 'Clear communication'].map((t) => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 size={17} className="text-brand" />{t}</li>))}
            </ul>
          </motion.div>
          <HeroVisual />
        </div>
        <div className="relative border-y border-line bg-bg/60 backdrop-blur">
          <ul className="wrap flex flex-wrap justify-center gap-x-8 gap-y-3 py-5">
            {services.map((s) => { const I = s.icon; return (
              <li key={s.slug}><Link to="/services" className="flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand"><I size={16} />{s.title}</Link></li>) })}
          </ul>
        </div>
      </section>

      <section className="section wrap">
        <SectionHead title="Growth, built in from day one" text="We plan every website around what it should do for your business, not only how it looks." />
        <div className="grid gap-6 md:grid-cols-3">
          {[['Found', 'Clean structure and SEO foundations so search engines and people can find you.'], ['Trusted', 'Clear design and fast, reliable pages that make visitors confident to contact you.'], ['Ready to grow', 'Modular builds you can extend with new pages, products and campaigns.']].map(([t, d]) => (
            <div key={t} className="border-l-2 border-brand pl-5"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2 text-muted">{d}</p></div>))}
        </div>
      </section>

      <section className="section wrap">
        <SectionHead title="Services" text="Everything you need to launch and grow online." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
      </section>

      <section className="section wrap">
        <SectionHead title="Featured projects" text={projects.some((p) => p.demo) ? "Projects marked Concept demo are samples that show how we approach different kinds of work. They are not client projects." : "A selection of our recent work."} />
        <div className="grid gap-6 md:grid-cols-3">{projects.slice(0, 3).map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
        <Link to="/portfolio" className="btn-ghost mt-10">See all work <ArrowRight size={16} /></Link>
      </section>

      <section className="section wrap">
        <SectionHead title="Why choose us" />
        <div className="grid gap-8 sm:grid-cols-2">
          {reasons.map((r) => { const I = r.icon; return (
            <div key={r.title} className="flex gap-4"><I className="mt-1 shrink-0 text-brand" /><div><h3 className="text-lg font-bold">{r.title}</h3><p className="mt-1 text-muted">{r.text}</p></div></div>) })}
        </div>
      </section>

      <section className="section wrap">
        <SectionHead title="Our process" text="Five steps from first conversation to a site that keeps improving." />
        <ol className="grid gap-4 md:grid-cols-5">
          {process.map(([t, d], i) => (
            <li key={t} className="glass rounded-3xl p-5"><span className="font-display text-2xl font-bold text-brand">{i + 1}</span><h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></li>))}
        </ol>
      </section>

      <Testimonials />

      <section className="section wrap">
        <div className="animated-gradient rounded-[2rem] p-10 text-center text-white sm:p-16" style={{ background: 'linear-gradient(120deg, #0a3fd1, #1f6bff, #050b1f)' }}>
          <h2 className="text-3xl font-bold sm:text-5xl">Ready to talk about your next project?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">Tell us what you want to build. We will reply with clear next steps.</p>
          <Link to="/get-quote" className="btn mt-8 bg-white text-brand2 hover:-translate-y-0.5">Get a Quote</Link>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
