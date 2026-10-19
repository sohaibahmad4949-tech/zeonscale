import { Link } from 'react-router-dom'
import { Palette, Code2, TrendingUp, ArrowRight } from 'lucide-react'
import useSeo from '../lib/useSeo'
import { reasons, process } from '../data/site'
import { SectionHead } from '../components/Cards'

const pillars = [
  { icon: Palette, title: 'Design', text: 'Clear, modern interfaces and brand assets that make your business look as good as it is.' },
  { icon: Code2, title: 'Development', text: 'Fast, responsive WordPress, Shopify and custom React builds that are easy to maintain.' },
  { icon: TrendingUp, title: 'Growth', text: 'SEO, content and digital marketing that bring the right visitors to what we build.' },
]

export default function About() {
  useSeo('About Us', 'Learn how Zeon Scale Agency works: modern technology, clear communication and solutions tailored to your business.')
  return (
    <>
      <section className="section wrap relative">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">We help businesses grow online, one build at a time.</h1>
            <p className="mt-6 max-w-xl text-lg text-muted">Zeon Scale Agency is a digital agency for businesses that want to grow their online presence, attract customers and scale their brands. We bring design, development and marketing together so your website works as part of your growth, not on its own.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/get-quote" className="btn-primary">Start a project <ArrowRight size={16} /></Link>
              <Link to="/services" className="btn-ghost">Our services</Link>
            </div>
          </div>
          <div className="glass relative rounded-[2rem] p-8 text-center shadow-2xl shadow-brand/10">
            <img src="/logo.png" alt="Zeon Scale logo: a bold Z with rising bars and an upward arrow" width="220" height="220" className="mx-auto h-44 w-44 object-contain sm:h-56 sm:w-56" />
            <p className="mt-4 text-sm text-muted">Our mark: a bold Z, rising bars and an upward arrow. Steady, measured growth.</p>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <SectionHead title="What we do" text="Three disciplines, one team, one plan." />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: I, title, text }) => (
            <article key={title} className="glass rounded-3xl p-7 transition duration-300 hover:-translate-y-1 hover:border-brand">
              <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand2))' }}><I size={22} /></span>
              <h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-2 text-muted">{text}</p>
            </article>))}
        </div>
      </section>

      <section className="section wrap">
        <SectionHead title="How we work" />
        <div className="grid gap-6 sm:grid-cols-2">
          {reasons.map((r) => { const I = r.icon; return (
            <div key={r.title} className="flex gap-4 border-l-2 border-brand pl-5"><I className="mt-1 shrink-0 text-brand" /><div><h3 className="text-lg font-bold">{r.title}</h3><p className="mt-1 text-muted">{r.text}</p></div></div>) })}
        </div>
      </section>

      <section className="section wrap">
        <SectionHead title="Our process" text="Five steps from first conversation to a site that keeps improving." />
        <ol className="relative ml-4 space-y-6 border-l border-line">
          {process.map(([t, d], i) => (
            <li key={t} className="relative pl-8">
              <span className="absolute -left-[17px] top-0 grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
              <h3 className="font-bold">{t}</h3><p className="text-muted">{d}</p>
            </li>))}
        </ol>
      </section>

      <section className="section wrap">
        <div className="animated-gradient rounded-[2rem] p-10 text-center text-white sm:p-14" style={{ background: 'linear-gradient(120deg, #0a3fd1, #1f6bff, #050b1f)' }}>
          <h2 className="text-3xl font-bold sm:text-4xl">Have a project in mind?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">Tell us what you want to build and we will reply with clear next steps.</p>
          <Link to="/get-quote" className="btn mt-7 bg-white text-brand2 hover:-translate-y-0.5">Get a Quote</Link>
        </div>
      </section>
    </>
  )
}
