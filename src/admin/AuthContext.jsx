import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [state, setState] = useState({ loading: !!supabase, session: null, isAdmin: false })

  useEffect(() => {
    if (!supabase) return
    let active = true
    const check = async (session) => {
      if (!session) return active && setState({ loading: false, session: null, isAdmin: false })
      const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle()
      if (active) setState({ loading: false, session, isAdmin: !!data })
    }
    supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { setTimeout(() => check(session), 0) })
    return () => { active = false; sub.subscription.unsubscribe() }
  }, [])

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signOut = () => supabase.auth.signOut()
  return <Ctx.Provider value={{ ...state, signIn, signOut }}>{children}</Ctx.Provider>
}
