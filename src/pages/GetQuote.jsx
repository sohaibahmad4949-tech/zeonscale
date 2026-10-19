import { useSearchParams } from 'react-router-dom'
import useSeo from '../lib/useSeo'
import { useServices } from '../lib/content'
import { QuoteForm } from '../components/Forms'

export default function GetQuote() {
  useSeo('Get a Quote', 'Request a quote from Zeon Scale Agency for web development, Shopify, SEO, marketing or design.')
  const services = useServices()
  const [params] = useSearchParams()
  const pre = services.find((s) => s.slug === params.get('service'))?.title
  return (
    <section className="section wrap max-w-3xl">
      <h1 className="text-4xl font-extrabold sm:text-6xl">Get a quote</h1>
      <p className="mb-10 mt-5 text-lg text-muted">Tell us what you need and we will reply with next steps and a price.</p>
      <QuoteForm key={pre || 'none'} preselect={pre} />
    </section>
  )
}
