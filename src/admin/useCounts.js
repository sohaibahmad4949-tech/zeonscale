import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const head = (table, status) => supabase.from(table).select('*', { count: 'exact', head: true }).eq('status', status)

// Counts of items waiting for the admin. Refreshes every 20 seconds, when the tab regains focus,
// and whenever another admin screen fires the "zeon-counts" event.
export default function useCounts() {
  const [c, setC] = useState({ messages: 0, quotes: 0, testimonials: 0 })
  const refresh = useCallback(() => {
    Promise.all([head('contact_messages', 'new'), head('quote_requests', 'new'), head('testimonials', 'pending')])
      .then(([m, q, t]) => setC({ messages: m.count || 0, quotes: q.count || 0, testimonials: t.count || 0 }))
      .catch(() => {})
  }, [])
  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 20000)
    const onFocus = () => document.visibilityState === 'visible' && refresh()
    window.addEventListener('zeon-counts', refresh); window.addEventListener('focus', onFocus); document.addEventListener('visibilitychange', onFocus)
    return () => { clearInterval(id); window.removeEventListener('zeon-counts', refresh); window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onFocus) }
  }, [refresh])
  return [c, refresh]
}
