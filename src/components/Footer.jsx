import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { socialIcons as icons } from './SocialIcons'
import Logo from './Logo'
import { site } from '../data/site'
import { useServices } from '../lib/content'

export default function Footer() {
  const services = useServices()
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">A digital agency building websites, stores, content and marketing that help businesses grow their online presence.</p>
          <ul className="mt-5 space-y-2 text-sm text-muted">
            <li><a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-brand"><Mail size={16} className="text-brand" />{site.email}</a></li>
            <li><a href={site.phoneHref} className="flex items-center gap-2 hover:text-brand"><Phone size={16} className="text-brand" />{site.phone}</a></li>
            <li><a href={site.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand"><MapPin size={16} className="text-brand" />{site.address}</a></li>
          </ul>
          {site.socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {site.socials.map((s) => { const I = icons[s.icon]; return (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="glass grid h-10 w-10 place-items-center rounded-full hover:border-brand"><I size={17} /></a>
              ) })}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold">Navigate</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {[['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/portfolio', 'Our Work'], ['/contact', 'Contact'], ['/get-quote', 'Get a Quote']].map(([to, l]) => (
              <li key={to}><Link className="hover:text-brand" to={to}>{l}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold">Services</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {services.map((s) => <li key={s.slug}><Link className="hover:text-brand" to="/services">{s.title}</Link></li>)}
          </ul>
        </div>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-muted">© {new Date().getFullYear()} Zeon Scale Agency. All rights reserved.</p>
    </footer>
  )
}
