import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

// A secret/service_role key must never run in a browser. Detect it and refuse to use it.
function isSecretKey(k) {
  if (k.startsWith('sb_secret_')) return true
  try {
    const part = k.split('.')[1]
    return !!part && JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))).role === 'service_role'
  } catch { return false }
}

let client = null
try {
  if (url && key) {
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) {
      console.error('Supabase: VITE_SUPABASE_URL should look like https://YOUR-PROJECT-ID.supabase.co')
    } else if (isSecretKey(key)) {
      console.error('Supabase: this is a secret/service_role key. Use the anon (publishable) key in VITE_SUPABASE_ANON_KEY.')
    } else {
      client = createClient(url, key)
    }
  }
} catch (e) {
  console.error('Supabase setup failed:', e.message)
}

export const supabase = client
