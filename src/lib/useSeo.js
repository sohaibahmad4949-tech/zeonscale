import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { loadSeoOverrides } from './content'

const BASE = 'Zeon Scale Agency'
const ensureMeta = (name) => {
  let m = document.querySelector(`meta[name="${name}"]`)
  if (!m) { m = document.createElement('meta'); m.name = name; document.head.appendChild(m) }
  return m
}

// Sets title and description for the page. Overrides saved in Admin > SEO & Analytics win over the defaults.
export default function useSeo(title, description) {
  const { pathname } = useLocation()
  useEffect(() => {
    let cancelled = false
    const apply = (t, d, noindex) => {
      document.title = t ? `${t} | ${BASE}` : `${BASE} | We Build Digital Experiences That Scale`
      const set = (sel, val) => document.querySelector(sel)?.setAttribute('content', val)
      if (d) { set('meta[name="description"]', d); set('meta[property="og:description"]', d) }
      set('meta[property="og:title"]', document.title)
      ensureMeta('robots').setAttribute('content', noindex ? 'noindex,follow' : 'index,follow')
    }
    apply(title, description, false)
    loadSeoOverrides().then((o) => {
      const r = o[pathname.replace(/\/$/, '') || '/']
      if (!cancelled && r) apply(r.title || title, r.description || description, r.noindex)
    })
    return () => { cancelled = true }
  }, [title, description, pathname])
}
