import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Quote, Star, PenLine } from 'lucide-react'
import ReviewForm from './ReviewForm'
import { useTestimonials } from '../lib/content'
import { SectionHead } from './Cards'

export default function Testimonials() {
  const testimonials = useTestimonials()
  const [writing, setWriting] = useState(false)
  return (
    <section className="section wrap">
      <SectionHead title="What clients say" center />
      {testimonials.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id || t.name} className="glass rounded-3xl p-7">
              {t.rating ? <div className="flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={18} className={n <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted/40'} />)}</div> : <Quote className="text-brand" size={22} />}
              <blockquote className="mt-4">{t.quote}</blockquote>
              <figcaption className="mt-4 text-sm text-muted">{t.name}{t.role ? `, ${t.role}` : ''}</figcaption>
            </figure>))}
        </div>
      ) : (
        <div className="glass mx-auto max-w-2xl rounded-3xl p-8 text-center">
          <p className="text-muted">Client reviews will appear here once our first projects with Zeon Scale are complete and clients have approved sharing their feedback.</p>
          <Link to="/get-quote" className="btn-primary mt-6">Be one of our first clients</Link>
        </div>
      )}
      <div className="mt-10 text-center">
        {writing ? <ReviewForm onDone={() => setWriting(false)} /> : <button onClick={() => setWriting(true)} className="btn-ghost"><PenLine size={16} />Write a review</button>}
      </div>
    </section>
  )
}
