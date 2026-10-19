import { site } from '../data/site'
import { supabase } from './supabase'

export async function submitForm(kind, values) {
  if (supabase) {
    const table = kind === 'quote' ? 'quote_requests' : 'contact_messages'
    const { error } = await supabase.from(table).insert(values)
    if (error) throw new Error('Could not send your message. Please try again.')
    return 'sent'
  }
  const payload = { form: kind, ...values }
  if (site.formEndpoint) {
    const res = await fetch(site.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('The server did not accept the message.')
    return 'sent'
  }
  if (site.email) {
    const body = Object.entries(payload).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Zeon Scale ${kind} request`)}&body=${encodeURIComponent(body)}`
    return 'mailto'
  }
  throw new Error('Forms are not connected yet. Set VITE_FORM_ENDPOINT or VITE_CONTACT_EMAIL in .env.')
}

export const validators = {
  name: (v) => (v.trim().length < 2 ? 'Enter your name.' : ''),
  email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address.' : ''),
  message: (v) => (v.trim().length < 10 ? 'Tell us a little more (at least 10 characters).' : ''),
  services: (v) => (!v.length ? 'Pick at least one service.' : ''),
}
