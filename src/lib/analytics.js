import { supabase } from './supabase'

// Privacy-friendly, cookie-free page view counter. No IP address or personal data is stored.
// The visitor id lives only in sessionStorage and disappears when the tab closes.
const GA_ID = (import.meta.env.VITE_GA_ID || '').trim()

const sessionId = () => {
  try {
    let id = sessionStorage.getItem('zeon-sid')
    if (!id) { id = (crypto.randomUUID?.() || String(Math.random()).slice(2) + Date.now()).slice(0, 36); sessionStorage.setItem('zeon-sid', id) }
    return id
  } catch { return 'anon' }
}
const device = () => {
  const w = window.innerWidth
  return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
}
const refHost = () => {
  try {
    if (!document.referrer) return null
    const h = new URL(document.referrer).hostname
    return h === location.hostname ? null : h.replace(/^www\./, '')
  } catch { return null }
}

let gaReady = false
function ga(path) {
  if (!GA_ID) return
  if (!gaReady) {
    gaReady = true
    const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`; document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date()); window.gtag('config', GA_ID, { send_page_view: false })
  }
  window.gtag('event', 'page_view', { page_path: path, page_title: document.title })
}

export const analyticsStatus = { builtIn: !!supabase, ga: !!GA_ID }

export function trackPageview(path) {
  if (navigator.doNotTrack === '1' || path.startsWith('/admin')) return
  ga(path)
  if (!supabase) return
  supabase.from('page_views').insert({ session_id: sessionId(), path: path.slice(0, 300), referrer: refHost(), device: device() }).then(() => {}, () => {})
}
