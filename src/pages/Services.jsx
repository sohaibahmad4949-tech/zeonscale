import { Link } from 'react-router-dom'
import useSeo from '../lib/useSeo'
import { useServices } from '../lib/content'
import { SectionHead, ServiceCard } from '../components/Cards'

export default function Services() {
  const services = useServices()
  useSeo('Services', 'SEO and content writing, WordPress, Shopify, custom web development, digital marketing and graphic design from Zeon Scale Agency.')
  return (
    <section className="section wrap">
      <SectionHead title="Our services" text="Pick one service or combine several. We will shape a plan around your goals." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
      <Link to="/get-quote" className="btn-primary mt-12">Get a Quote</Link>
    </section>
  )
}
